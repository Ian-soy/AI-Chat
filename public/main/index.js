"use strict";
const electron = require("electron");
const path = require("path");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const env = electron.app.isPackaged ? "production" : "development";
const filePath = {
  winURL: {
    development: `http://localhost:5173`,
    production: `file://${path.join(electron.app.getAppPath(), "dist", "electron", "renderer", "index.html")}`
  },
  loadingURL: {
    development: `http://localhost:5173/loader.html`,
    production: `file://${path.join(electron.app.getAppPath(), "dist", "electron", "renderer", "loader.html")}`
  }
};
const winURL = filePath.winURL[env];
const loadingURL = filePath.loadingURL[env];
const icon = electron.nativeImage.createFromPath(path__namespace.join(__dirname, "..", "logo.png"));
class MainInit {
  winURL = "";
  shartURL = "";
  loadWindow = null;
  mainWindow = null;
  constructor() {
    this.winURL = winURL;
    this.shartURL = loadingURL;
  }
  // 主窗口函数
  createMainWindow() {
    this.mainWindow = new electron.BrowserWindow({
      width: 900,
      height: 650,
      icon: path__namespace.join(__dirname, "..", "logo.png"),
      titleBarStyle: "hidden",
      frame: false,
      // 无边框窗口（可选）
      show: false,
      center: true,
      webPreferences: {
        preload: path__namespace.join(__dirname, "..", "preload/index.js"),
        contextIsolation: true,
        devTools: false
        // 彻底禁用开发者工具
      }
    });
    if (process.env.VITE_DEV_SERVER_URL) {
      this.mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      this.mainWindow.loadFile(this.winURL);
    }
    this.mainWindow.once("ready-to-show", () => {
      if (this.loadWindow) this.loadWindow.destroy();
      this.mainWindow?.show();
    });
    this.mainWindow.on("closed", () => {
      this.mainWindow = null;
    });
    const tray = new electron.Tray(icon);
    const contextMenu = electron.Menu.buildFromTemplate([
      { label: "显示", click: () => this.mainWindow?.show() },
      { label: "退出", role: "quit" }
    ]);
    tray.setToolTip("Space Helper");
    tray.setContextMenu(contextMenu);
    electron.ipcMain.on("window-minimize", () => this.mainWindow?.minimize());
    electron.ipcMain.on("window-toggle-maximize", () => {
      this.mainWindow?.isMaximized() ? this.mainWindow?.unmaximize() : this.mainWindow?.maximize();
    });
    electron.ipcMain.on("window-close", () => this.mainWindow?.close());
  }
  // 加载窗口函数
  loadingWindow(loadingURL2) {
    this.loadWindow = new electron.BrowserWindow({
      width: 400,
      height: 600,
      frame: false,
      skipTaskbar: true,
      transparent: true,
      resizable: false,
      show: false,
      webPreferences: {
        experimentalFeatures: true,
        preload: path__namespace.join(__dirname, "..", "preload/index.js")
      }
    });
    this.loadWindow.loadURL(loadingURL2);
    this.loadWindow.show();
    this.loadWindow.setAlwaysOnTop(true);
    setTimeout(() => {
      this.createMainWindow();
    }, 2e3);
  }
  // 初始化窗口函数
  initWindow() {
    {
      return this.loadingWindow(this.shartURL);
    }
  }
}
electron.app.whenReady().then(() => {
  new MainInit().initWindow();
});
electron.app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
electron.app.on("window-all-closed", () => {
  electron.app.quit();
});
electron.app.on("browser-window-created", () => {
  console.log("window-created");
});
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    electron.app.removeAsDefaultProtocolClient("ai-chat");
    console.log("connot work");
  }
} else {
  electron.app.setAsDefaultProtocolClient("ai-chat");
}
