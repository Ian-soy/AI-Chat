/**
 * electron-builder打包配置
 * 打包配置
 * productName: 产品名称
 * copyright: 版权信息
 * directories: 打包目录
 * files: 打包文件
 * asar: 是否启用asar打包
 * compression: 压缩级别
 * win: 打包windows安装包
 * nsis: 打包nsis安装包
 * h5: 打包h5安装包
 * mac: 打包mac安装包
 * linux: 打包linux安装包
 * author: yuanjun
 * date: 2025-06-20
 */ 

const currentTime = new Date().getTime().toString();
module.exports = {
    productName: "SpaceHelper",
    copyright: "Copyright©2025 SpaceHelper",
    publish: {
        provider: "github", // 自动更新提供商（如 GitHub Releases）
        token: "",
        owner: "Ian-soy",
        updaterCacheDirName: "AI-Chat-updater",
        repo: "AI-Chat",
        releaseType: "release",
        // source: false // 关键配置，设为 false 禁用源码压缩包生成
    },
    directories: {
        output: `release/${currentTime}`
    },
    files: [
        "dist/**/*",
        "public/**/*",
        "!node_modules",
        "*.js", // 主进程文件（根据实际路径调整）
        "!src/**/*", // 排除源码目录
        "!test/**/*", // 排除测试文件
        "!.vscode/**/*", // 排除开发配置
        "!*.config.js", // 排除配置文件（如需保留可移除）
        "!package.json", // 若不需要源码中的 `package.json` 可排除
        "!yarn.lock", // 排除依赖锁文件
        "!README.md" // 排除文档文件
    ],
    asar: true,
    // 仅在生产环境压缩
    compression: process.env.NODE_ENV === "production" ? "maximum" : "store",
    win: {
        icon: "public/icons/icon.ico",
    },
    mac: {
        target: 'dmg',
        category: "public.app-category.utilities"
    },
    dmg: {
        "icon": "public/icon.icns",             // 应用图标
        "iconSize": 100,                         // 图标尺寸
        "window": {                              // 窗口位置
        "x": 100,
        "y": 100,
        "width": 500,
        "height": 300
        },
    },
    nsis: {
        oneClick: false, // 不使用一键安装
        allowElevation: true, // 允许管理员权限安装
        allowToChangeInstallationDirectory: true, // 允许用户更改安装路径
        createDesktopShortcut: true, // 创建桌面快捷方式
        createStartMenuShortcut: true, // 创建开始菜单快捷方式
        shortcutName: 'SpaceHelper', // 自定义快捷方式名称
        runAfterFinish: false, // 不自动运行安装程序
        include: 'build/installer.nsh', // 自定义nsis安装脚本
        installerIcon: 'public/logo.ico', // 自定义安装图标
        uninstallerIcon: 'public/logo.ico', // 自定义卸载图标
        installerHeaderIcon: 'public/logo.ico' // 自定义安装器头部图标
    }
}
