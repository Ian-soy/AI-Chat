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
const icon = electron.nativeImage.createFromPath(path__namespace.join(__dirname, "..", "logo.png"));
electron.app.whenReady().then(() => {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 650,
    icon,
    titleBarStyle: "hidden",
    // 隐藏原生标题栏
    frame: false,
    // 无边框窗口（可选）
    show: false,
    center: true,
    webPreferences: {
      preload: path__namespace.join(__dirname, "..", "preload/index.js"),
      contextIsolation: true
    }
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile("dist/index.html");
  }
  const tray = new electron.Tray(icon);
  const contextMenu = electron.Menu.buildFromTemplate([
    { label: "显示", click: () => mainWindow.show() },
    { label: "退出", role: "quit" }
  ]);
  tray.setToolTip("AI Chat");
  tray.setContextMenu(contextMenu);
  electron.ipcMain.on("window-minimize", () => mainWindow.minimize());
  electron.ipcMain.on("window-toggle-maximize", () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  });
  electron.ipcMain.on("window-close", () => mainWindow.close());
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
