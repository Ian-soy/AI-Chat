/// <reference types="vite/client" />

declare global {
  interface Window {
    electronAPI: {
      minimize: () => any; // 根据实际 API 定义方法
      toggleMaximize: () => any;
      close: () => any;
      // 其他 Electron API 方法
    };
  }
}

export {};