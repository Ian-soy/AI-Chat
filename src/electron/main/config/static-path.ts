/**
 * 静态文件路径
 * 这里定义了静态文件路径的位置
 * 打包时会将 dist 文件夹复制到 public 文件夹下
 * 所以这里的路径都是相对于 public 文件夹的
 * author: yuanjun
 * date: 2025-07-02
 * */ 

// 这里定义了静态文件路径的位置
import { join } from 'path'
import { app } from 'electron'
// import config from "../../../../config/index";
const env = app.isPackaged ? 'production' : 'development'

const filePath = {
  winURL: {
    development: `http://localhost:5173`,
    production: `${join('dist', 'index.html')}`,
  },
  loadingURL: {
    development: `http://localhost:5173/loader.html`,
    production: `file://${join(app.getAppPath(), 'dist', 'loader.html')}`,
  }
}

export const winURL = filePath.winURL[env]
export const loadingURL = filePath.loadingURL[env]
