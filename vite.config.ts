import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages 项目页地址为 https://<用户名>.github.io/<仓库名>/
// 若仓库名不是 index_web，改这里即可；若用自定义域名则改为 '/'
export default defineConfig({
  base: '/index_web/',
  plugins: [react(), tailwindcss()],
})