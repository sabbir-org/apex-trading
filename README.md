```ts
// main/index.ts
export let mainWindow: BrowserWindow;
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "App name"
    // ............
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  // check if any issue. any memory lick etc
  mainWindow.on("closed", () => {
    if (authWindow) {
      authWindow.close();
    }
  });

  // ✅ Open DevTools in development
  mainWindow.webContents.openDevTools({ mode: "right" });

  // Check for updates after window is ready
  mainWindow.once("ready-to-show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

// Auto Updater Events
autoUpdater.on("checking-for-update", () => {
  mainWindow.webContents.send("update-status", "Checking for update...");
});

autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("update-status", "Update available. Downloading...");
});

autoUpdater.on("update-not-available", () => {
  mainWindow.webContents.send("update-status", "Update not available.");
});

autoUpdater.on("error", (err) => {
  mainWindow.webContents.send("update-status", `Error in auto-updater: ${err}`);
});

autoUpdater.on("download-progress", (progressObj) => {
  mainWindow.webContents.send("download-progress", progressObj);
});

autoUpdater.on("update-downloaded", () => {
  mainWindow.webContents.send("update-status", "Update downloaded. Restart to install.");
  // Optionally prompt user to restart
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5000);
});
```

```ts
// perload/index.d.ts
declare global {
  interface Window {
    context: {
      onUpdateStatus: (callback) => void;
      onDownloadProgress: (callback) => void;
      checkForUpdates: () => void;
      restartApp: () => void;
    };
  }
}
```

```ts
// perload/index.ts
if (!process.contextIsolated) {
  throw new Error("contextIsolation must be enabled in the BrowserWindow");
}

try {
  contextBridge.exposeInMainWorld("context", {
    onUpdateStatus: (callback) => ipcRenderer.on("update-status", callback),
    onDownloadProgress: (callback) => ipcRenderer.on("download-progress", callback),
    checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
    restartApp: () => ipcRenderer.invoke("restart-app")
  });
} catch (error) {
  console.error(error);
}
```
