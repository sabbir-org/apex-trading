import { app } from "electron";
import yaml from "js-yaml";

export async function hasNewUpdate() {
  const url = "https://github.com/sabbir-org/apex-trading/releases/latest/download/latest.yml";

  let newVersion = false;
  try {
    const response = await fetch(url);
    const asText = await response.text();
    const data = yaml.load(asText);
    newVersion = data.version > app.getVersion();
  } catch (err) {
    console.log(err);
  }
  return {
    success: newVersion,
    message: (newVersion && "New version available") || "No new update available"
  };
}
