import { BrowserWindow, ipcMain, nativeImage, Menu, Tray } from "electron";
import config from "../../../../config/index";
import { winURL, loadingURL } from "../config/static-path";
import * as path from 'path';
const icon = nativeImage.createFromPath(path.join(__dirname, '..', "logo.png"));
class MainInit {
  public winURL: string = "";
  public shartURL: string = "";
  public loadWindow: BrowserWindow | null = null;
  public mainWindow: BrowserWindow  | null = null;

  constructor() {
    this.winURL = winURL;
    this.shartURL = loadingURL;
  }
  // 主窗口函数
  createMainWindow() {
    this.mainWindow = new BrowserWindow({
        width: 900,
        height: 650,
        icon: path.join(__dirname, '..', "logo.png"),
        titleBarStyle: config.IsUseSysTitle ? "default" : "hidden",
        frame: false, // 无边框窗口（可选）
        show: false,
        center: true,
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload/index.js'),
            contextIsolation: true
        }
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        this.mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL as string)
    } else {
        // 生产环境下，加载打包后的文件
        this.mainWindow.loadFile(this.winURL);
    }
    // dom-ready之后显示界面
    this.mainWindow.once("ready-to-show", () => {
      if (config.UseStartupChart && this.loadWindow) this.loadWindow.destroy();
      this.mainWindow?.show();
    });

    this.mainWindow.on("closed", () => {
      this.mainWindow = null;
    });

    // 系统托盘
    // 开发环境使用 src 目录
    // const devIcon = icon
    // 生产环境使用 resources 目录
    // const prodIcon = path.join(process.resourcesPath, 'assets/icon.ico')
    // const finalIcon = process.env.NODE_ENV === 'development' ? devIcon : prodIcon
    const tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        { label: '显示', click: () => this.mainWindow?.show() },
        { label: '退出', role: 'quit' }
    ])
    tray.setToolTip('Space Helper')
    tray.setContextMenu(contextMenu)

    ipcMain.on('window-minimize', () => this.mainWindow?.minimize())
    ipcMain.on('window-toggle-maximize', () => {
        this.mainWindow?.isMaximized() ? this.mainWindow?.unmaximize() : this.mainWindow?.maximize();
    })
    ipcMain.on('window-close', () => this.mainWindow?.close())
  }
  // 加载窗口函数
  loadingWindow(loadingURL: string) {
    this.loadWindow = new BrowserWindow({
      width: 400,
      height: 600,
      frame: false,
      skipTaskbar: true,
      transparent: true,
      resizable: false,
      show: false,
      webPreferences: {
        experimentalFeatures: true,
        preload: path.join(__dirname, '..', 'preload/index.js'),
      },
    })

    this.loadWindow.loadURL(loadingURL);
    this.loadWindow.show();
    this.loadWindow.setAlwaysOnTop(true);
    // 延迟两秒可以根据情况后续调快，= =，就相当于个，sleep吧，就那种。 = =。。。
    setTimeout(() => {
      this.createMainWindow();
    }, 2000);
  }
  // 初始化窗口函数
  initWindow() {
    if (config.UseStartupChart) {
      return this.loadingWindow(this.shartURL);
    } else {
      return this.createMainWindow();
    }
  }
}
export default MainInit;
