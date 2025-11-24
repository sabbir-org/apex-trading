import { app } from "electron";
import fs from "fs";
import { google } from "googleapis";
import { join } from "path";
import { getRootDir } from "../root";
const REDIRECT_URI = "http://localhost:3000/oauth2callback";
const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/drive"
];

// const TOKEN_PATH = join(app.getPath("userData"), "tokens.json");
const TOKEN_PATH = join(getRootDir(), "tokens.json");

const devRootDir = app.getAppPath();
const configPath = join(devRootDir, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

export const oauth2Client: any = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

export function getAuthURL() {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"
  });
  return url;
}

export function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
}

export function loadTokens() {
  try {
    return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  } catch {
    return null;
  }
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.GOOGLE_CLIENT_ID,
      client_secret: config.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    })
  });

  if (!response.ok) throw new Error("Refresh failed");
  return await response.json();
}
