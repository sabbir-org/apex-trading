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

export const oauth2Client: any = new google.auth.OAuth2(
  "",
  "",
  REDIRECT_URI
);

export function loadTokens() {
  try {
    return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  } catch {
    return null;
  }
}
export function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
}
export function getAuthURL() {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"
  });
  return url;
}
