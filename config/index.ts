/**
 * 打包配置
 * build: 打包配置
 * dev: 开发配置
 * DllFolder: dll 文件夹
 * HotUpdateFolder: 热更新文件夹
 * UseStartupChart: 是否使用启动图表
 * IsUseSysTitle: 是否使用系统标题
 * author: yuanjun
 * date: 2025-07-02

 * */ 
export default {
  build: {
    hotPublishUrl: '',
    hotPublishConfigName: 'update-config',
  },
  dev: {
    removeElectronJunk: true,
    chineseLog: false,
    port: 9080,
  },
  DllFolder: '',
  HotUpdateFolder: 'update',
  UseStartupChart: true,
  IsUseSysTitle: false,
}
