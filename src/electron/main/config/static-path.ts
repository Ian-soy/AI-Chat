// 这里定义了静态文件路径的位置
import { join } from 'path'
import { app } from 'electron'
// import config from "../../../../config/index";
const env = app.isPackaged ? 'production' : 'development'
const filePath = {
  winURL: {
    development: `http://localhost:5173`,
    production: `file://${join(app.getAppPath(), 'dist', 'electron', 'renderer', 'index.html')}`,
  },
  loadingURL: {
    development: `http://localhost:5173/loader.html`,
    production: `file://${join(app.getAppPath(), 'dist', 'electron', 'renderer', 'loader.html')}`,
  }
}

export const winURL = filePath.winURL[env]
export const loadingURL = filePath.loadingURL[env]
