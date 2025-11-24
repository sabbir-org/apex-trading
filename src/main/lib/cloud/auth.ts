import { is } from "@electron-toolkit/utils";
import { BrowserWindow } from "electron";
import express from "express";
import { join } from "path";
import { mainWindow } from "./../../index";
import { getAuthURL, loadTokens, oauth2Client, refreshAccessToken, saveTokens } from "./main";

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
      webPreferences: { nodeIntegration: false },
      autoHideMenuBar: true,
      modal: true,
      parent: mainWindow, // Associate with main window
      maximizable: false, // disables maximize button
      minimizable: false, // disables minimize button
      movable: false,
      icon: is.dev
        ? join(__dirname, "../../resources/icon.png")
        : join(__dirname, "../build/icon.ico")
    });

    authWindow.loadURL(authURL);
    authWindow.on("closed", () => {
      authWindow = null;
      resolve({ success: false, message: "Login window closed" });
      server.close();
    });
  });
}

async function fetchWithAuth(url: string, token: string) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
}

type TAuthResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export async function verify(): Promise<TAuthResponse> {
  const savedTokens = loadTokens();
  if (!savedTokens) {
    await login();
    return { success: false, message: "Please login" };
  }

  try {
    /**
     * STEP: 1
     * Token validation with currently saved token
     * */

    let response = await fetchWithAuth(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      savedTokens.access_token
    );

    /**
     * STEP: 2
     * Handle token expiration/invalid error
     * */
    if (response.status === 401 && savedTokens.refresh_token) {
      const newTokens = await refreshAccessToken(savedTokens.refresh_token);
      const updatedTokens = {
        ...savedTokens,
        access_token: newTokens.access_token,
        expires_in: newTokens.expires_in
      };

      saveTokens(updatedTokens);

      // Retry with new token
      response = await fetchWithAuth(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        newTokens.access_token
      );
    }

    // Handle final response
    if (response.status === 401) {
      await login();
      return { success: false, message: "Session expired" };
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const userInfo = await response.json();
    return { success: true, message: "Authentication valid", data: userInfo };
  } catch (error) {
    console.log("Authentication failed:", error);
    return {
      success: false,
      message: "Authentication failed"
    };
  }
}
