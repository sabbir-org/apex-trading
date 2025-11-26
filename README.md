https://github.com/iffy/electron-updater-example?tab=readme-ov-file

Exactly — that’s exactly what’s happening.

When you use db.update() (or any LowDB CRUD), you are modifying the in-memory object (\_db.data) directly in RAM.

Your UI reads from this live in-memory object, so updates appear immediately.

The JSON file on disk is just persistence — the disk write happens asynchronously via db.write().

If you edit db.json manually:

LowDB has already loaded \_db.data into memory.

It does not automatically watch the file, so your manual changes are ignored.

Reloading the app only works if your getDataBase() actually reads the disk before caching, but if you’re caching \_db globally, it may still serve the old in-memory object.

✅ Key point: LowDB’s “live updates” come from manipulating the cached RAM object, not from the file on disk.

If you want, I can explain how to make LowDB pick up manual edits from disk, though it’s usually not needed in normal apps.

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

```yml
# original one
appId: com.apextrading.app
productName: Apex Trading
directories:
  buildResources: build
files:
  - "!**/.vscode/*"
  - "!src/*"
  - "!electron.vite.config.{js,ts,mjs,cjs}"
  - "!{.eslintcache,eslint.config.mjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}"
  - "!{.env,.env.*,.npmrc,pnpm-lock.yaml}"
  - "!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}"
asarUnpack:
  - resources/**
win:
  executableName: Apex Trading
  icon: build/icon.ico
nsis:
  artifactName: ${name}-${version}-setup.${ext}
  shortcutName: ${productName}
  uninstallDisplayName: ${productName}
  createDesktopShortcut: always
mac:
  entitlementsInherit: build/entitlements.mac.plist
  extendInfo:
    - NSCameraUsageDescription: Application requests access to the device's camera.
    - NSMicrophoneUsageDescription: Application requests access to the device's microphone.
    - NSDocumentsFolderUsageDescription: Application requests access to the user's Documents folder.
    - NSDownloadsFolderUsageDescription: Application requests access to the user's Downloads folder.
  notarize: false
dmg:
  artifactName: ${name}-${version}.${ext}
linux:
  target:
    - AppImage
    - snap
    - deb
  maintainer: electronjs.org
  category: Utility
appImage:
  artifactName: ${name}-${version}.${ext}
npmRebuild: false
publish:
  provider: generic
  url: https://example.com/auto-updates
```
