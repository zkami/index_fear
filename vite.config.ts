import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages 项目页地址为 https://zkami.github.io/index_fear/
// 若改仓库名或改用自定义域名，这里要同步修改
export default defineConfig({
  base: '/index_fear/',
  plugins: [react(), tailwindcss()],
})