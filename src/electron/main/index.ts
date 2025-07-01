/**
 * 主进程配置
 * 主进程负责创建浏览器窗口、加载应用内容、与渲染进程通信等
 * 主进程可以使用Node.js的API，例如文件系统、网络、数据库等
 * 主进程不应该访问DOM，因为它在渲染进程的沙箱中运行
 * author: yuanjun
 * date: 2025-06-20
*/
import { app } from 'electron';
import InitWindow from "./service/window-manager.ts";

// 主进程事件监听
app.whenReady().then(() => {
  new InitWindow().initWindow();
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
    app.removeAsDefaultProtocolClient('Space Helper')
    console.log('connot work')
  }
} else {
  app.setAsDefaultProtocolClient('Space Helper')
}