import { appDirectory } from "@shared/constants";
import { app } from "electron";
import { homedir } from "os";
import { join } from "path";

export const getHomeDir = () => {
  return join(homedir(), appDirectory);
};

export const getAppDir = () => {
  return join(app.getPath("userData"), appDirectory);
};
