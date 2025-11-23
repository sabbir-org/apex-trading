import fs from "fs";
import { join } from "path";
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
