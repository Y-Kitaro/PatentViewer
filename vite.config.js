import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ベースパスをリポジトリ名に変更
  base: "/PatentViewer/", // GitHubのリポジトリ名と揃える
})
