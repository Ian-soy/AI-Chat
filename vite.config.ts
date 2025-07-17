import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
// https://vite.dev/config/

console.log('VITE_MODE', process.env.VITE_MODE)

export default defineConfig({
  base: './', // electron打包采用
  // base: '/search/', // web端打包采用
  build: {
    outDir: 'dist',
    assetsDir: 'static'  // 静态资源子目录
  },
  plugins: [vue(), 
    process.env.VITE_MODE === 'electron' && electron([
      {
        entry: 'src/electron/main/index.ts',
        vite: {
          build: {
            outDir: 'public/main',
          }
        }
      },
      {
        entry: 'src/electron/preload/index.ts',
        vite: {
          build: {
            outDir: 'public/preload',
          }
        }
      }
    ])
  ],
})
