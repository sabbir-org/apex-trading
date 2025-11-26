import fs from "fs";
import { join } from "path";
import { reloadDatabase } from "../localdb/main";
import { getRootDir } from "../root";
import { verify } from "./auth";
import { loadTokens } from "./main";

const GOOGLE_API_BASE = "https://www.googleapis.com";

export async function uploadToDrive() {
  const isAuthenticated = await verify();

  if (!isAuthenticated.success) {
    console.log("Authentication failed - upload cancelled");
    return {
      success: false,
      message: "Authentication failed"
    };
  }

  const fileName = `appdb.json`;
  const filePath = join(getRootDir(), fileName);
  const savedTokens = loadTokens();

  try {
    // Step 1: Check if file already exists
    const existingFile = await findFileByName(fileName, savedTokens.access_token);

    // Step 2: Read file content
    const fileContent = fs.readFileSync(filePath);

    if (existingFile) {
      // Update existing file
      return await updateFile(existingFile.id, fileContent, savedTokens.access_token);
    } else {
      // Create new file
      return await createFile(fileContent, savedTokens.access_token, fileName);
    }
  } catch (err) {
    console.error("Error uploading or updating file:", err);
    return {
      success: false,
      error: err
    };
  }
}

// Helper function to find file by name
async function findFileByName(fileName, accessToken) {
  try {
    const response = await fetch(
      `${GOOGLE_API_BASE}/drive/v3/files?q=name='${encodeURIComponent(fileName)}' and trashed=false&fields=files(id,name)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search files: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.files?.[0] || null;
  } catch (error) {
    console.error("Error finding file:", error);
    throw error;
  }
}

// Helper function to create new file
async function createFile(fileContent, accessToken, fileName) {
  const metadata = {
    name: fileName,
    mimeType: "application/json"
  };

  // Create form data for multipart upload
  const formData = new FormData();
  formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  formData.append("file", new Blob([fileContent], { type: "application/json" }));

  const response = await fetch(
    `${GOOGLE_API_BASE}/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: formData
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to create file: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  console.log(`Uploaded new file: ${data.name}`);

  return {
    success: true,
    message: "Backup completed"
  };
}

// Helper function to update existing file
async function updateFile(fileId, fileContent, accessToken) {
  // For simple updates, we can use the media upload endpoint
  const response = await fetch(
    `${GOOGLE_API_BASE}/upload/drive/v3/files/${fileId}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: fileContent
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update file: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  console.log(`Updated existing file: ${data.id}`);

  return {
    success: true,
    message: "Synced sucessfully"
  };
}

export async function readFromDrive(fileName = "appdb.json") {
  const isAuthenticated = await verify();

  if (!isAuthenticated.success) {
    console.log("Authentication failed - read cancelled");
    return {
      success: false,
      message: "Authentication failed"
    };
  }

  const savedTokens = loadTokens();

  try {
    // Step 1: check if file exists
    const existingFile = await findFileByName(fileName, savedTokens.access_token);

    if (!existingFile) {
      return {
        success: false,
        message: "File not found on Google Drive"
      };
    }

    // Step 2: Download file content
    const fileContent = await downloadFile(existingFile.id, savedTokens.access_token);

    // 🔥 IMPORTANT: reload in-memory DB
    await reloadDatabase();

    return {
      success: true,
      data: fileContent
    };
  } catch (err) {
    console.error("Error reading from Drive:", err);
    return {
      success: false,
      error: err
    };
  }
}

async function downloadFile(fileId, accessToken) {
  const response = await fetch(`${GOOGLE_API_BASE}/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to download file: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const text = await response.text();

  // Parse JSON
  let jsonData;
  try {
    jsonData = JSON.parse(text);
  } catch (err) {
    throw new Error("Downloaded file is not valid JSON");
  }

  // ⚡ Path where DB should be saved

  const filePath = join(getRootDir(), "appdb.json");

  // Ensure directory exists
  if (!fs.existsSync(getRootDir())) {
    fs.mkdirSync(getRootDir(), { recursive: true });
  }

  // Write file
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

  console.log("DB downloaded and saved to:", filePath);

  return jsonData;
}
