import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ビルド設定
  build: {
    // gitHubPagesで表紙するために出力先を 'docs' に変更
    outDir: 'docs',
  },
  // ベースパスをリポジトリ名に変更
  base: "/PatentViewer/", // GitHubのリポジトリ名と揃る
})
