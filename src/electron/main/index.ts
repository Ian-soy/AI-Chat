/**
 * 主进程配置
 * 主进程负责创建浏览器窗口、加载应用内容、与渲染进程通信等
 * 主进程可以使用Node.js的API，例如文件系统、网络、数据库等
 * 主进程不应该访问DOM，因为它在渲染进程的沙箱中运行
 * author: yuanjun
 * date: 2025-06-20
*/
import { app, BrowserWindow, ipcMain, nativeImage, Menu, Tray } from 'electron';
import * as path from 'path';

  const icon = nativeImage.createFromPath(path.join(__dirname, '..', "logo.png"));
// 主进程事件监听
app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    icon: path.join(__dirname, '..', "logo.png"),
    titleBarStyle: 'hidden', // 隐藏原生标题栏
    frame: false, // 无边框窗口（可选）
    show: false,
    center: true,
    webPreferences: {
        preload: path.join(__dirname, '..', 'preload/index.js'),
        contextIsolation: true
    }
  })

  // 窗口控制IPC监听
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL as string)
  } else {
    // 生产环境下，加载打包后的文件
    mainWindow.loadFile('dist/index.html')
  }

  // 系统托盘
  // 开发环境使用 src 目录
  // const devIcon = icon
  // 生产环境使用 resources 目录
  // const prodIcon = path.join(process.resourcesPath, 'assets/icon.ico')
  // const finalIcon = process.env.NODE_ENV === 'development' ? devIcon : prodIcon
  const tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示', click: () => mainWindow.show() },
    { label: '退出', role: 'quit' }
  ])
  tray.setToolTip('Space Helper')
  tray.setContextMenu(contextMenu)

  ipcMain.on('window-minimize', () => mainWindow.minimize())
  ipcMain.on('window-toggle-maximize', () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  })
  ipcMain.on('window-close', () => mainWindow.close())
})

// 由于9.x版本问题，需要加入该配置关闭跨域问题
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')

app.on('window-all-closed', () => {
  // 所有平台均为所有窗口关闭就退出软件
  app.quit()
})
app.on('browser-window-created', () => {
  console.log('window-created')
})

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.removeAsDefaultProtocolClient('ai-chat')
    console.log('connot work')
  }
} else {
  app.setAsDefaultProtocolClient('ai-chat')
}