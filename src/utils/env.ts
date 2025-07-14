// utils/env.ts
export const isElectronEnv = () => {
  // 方案1：特征检测
  const hasElectron = typeof window !== 'undefined' && 
    !!window.require?.('electron') &&
    !!window.process?.versions?.electron
  
  // 方案2：Vite环境变量
  const viteFlag = import.meta.env.VITE_IS_ELECTRON === 'true'
  
  return hasElectron || viteFlag
}

