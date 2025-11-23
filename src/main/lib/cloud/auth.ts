import { BrowserWindow } from "electron";
import express from "express";
import { getAuthURL, loadTokens, oauth2Client, saveTokens } from "./main";

export let authWindow: BrowserWindow | null = null;

export async function login() {
  return new Promise((resolve, reject) => {
    const authURL = getAuthURL();
    const app = express();
    const server = app.listen(3000, "127.0.0.1");
    app.get("/oauth2callback", async (req, res) => {
      try {
        const code = req.query.code;
        if (!code) {
          res.send("No code found");
          authWindow?.close();
          server.close();
          return reject(new Error("No code found"));
        }
        const { tokens } = await oauth2Client.getToken(code);
        saveTokens(tokens);
        oauth2Client.setCredentials(tokens);
        server.close();
        authWindow?.close();
        resolve({ success: true, message: "Login successful" });
      } catch (err) {
        reject(err);
      }
    });
    authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      webPreferences: { nodeIntegration: false }
    });
    authWindow.loadURL(authURL);
    authWindow.on("closed", () => {
      authWindow = null;
      resolve({ success: false, message: "Login window closed" });
      server.close();
    });
  });
}

export async function verify(): Promise<{ success: boolean; message: string; data?: any }> {
  const savedTokens = loadTokens();
  if (!savedTokens) {
    await login();
  }

  try {
    // Simple token validation by calling userinfo
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${savedTokens.access_token}`
      }
    });

    if (userResponse.status === 401) {
      throw new Error("Token expired or invalid");
    }

    if (!userResponse.ok) {
      throw new Error(`API error: ${userResponse.status}`);
    }

    const userInfo = await userResponse.json();

    return {
      success: true,
      message: "Authentication valid",
      data: userInfo
    };
  } catch (error) {
    console.log("Authentication failed:", error);
    return {
      success: false,
      message: "Authentication failed"
    };
  }
}
