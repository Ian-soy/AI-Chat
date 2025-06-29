/**
 * 环境变量声明 src/env.d.ts
 * author: yuanjun
 * date: 2025-06-20
 * */ 

declare module '*.vue' {
  import { DefineComponent } from 'vue' // 定义vue组件
  const component: DefineComponent<{}, {}, any> // 定义vue组件的类型
  export default component
}

// 在 vite-env.d.ts 或类似的类型定义文件中
declare global {
  interface Window {
    electronAPI: any; // 或者更具体的类型定义
  }
}