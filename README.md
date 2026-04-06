# PatentViewer 📜

日本の特許公報（XML/TXT形式）をブラウザ上で読みやすく表示するためのビューアーアプリケーションです。

![introduce.mp4](https://github.com/user-attachments/assets/7dbe398f-3ae3-4526-948d-9d212a594574)

[![Deploy to GitHub Pages](https://github.com/Y-Kitaro/PatentViewer/actions/workflows/deploy.yml/badge.svg)](https://github.com/Y-Kitaro/PatentViewer/actions/workflows/deploy.yml)

## 🚀 概要

このプロジェクトは、特許公報のXMLデータを解析し、構造化された見やすい形式でレンダリングします。複雑なタグ構成を持つ特許データを、人間が直感的に理解できるレイアウトに変換します。

## ✨ 特徴

- **XML/TXT解析**: 特許庁から提供される標準的なXML/TXT形式の公報データをサポート。
- **データ抽出**: 書誌事項、要約、請求の範囲、詳細な説明などの重要セクションを自動抽出。
- **モダンなUI**: Reactを使用した高速でレスポンシブなインターフェース。
- **セキュア**: すべての処理はクライアントサイド（ブラウザ内）で行われるため、アップロードしたデータがサーバーに送信されることはありません。

## 🛠 技術スタック

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Logic**: XML DOM Parser, Custom Data Extractor
- **Styling**: Vanilla CSS (CSS Modules-like structure)
- **Deployment**: GitHub Actions & GitHub Pages

## 💻 開発ガイド

### ローカル実行

1.  リポジトリをクローンします。
2.  依存関係をインストールします。
    ```bash
    npm install
    ```
3.  開発サーバーを起動します。
    ```bash
    npm run dev
    ```
4.  ブラウザで `http://localhost:5173` を開きます。

### ビルド

本番環境用にビルドするには以下のコマンドを実行します。
```bash
npm run build
```
出力は `dist/` ディレクトリに生成されます。

## 🌐 デプロイについて

このプロジェクトは GitHub Actions を使用して GitHub Pages に自動デプロイされるよう設定されています。

- **自動デプロイ**: `main` ブランチにプッシュされると、`.github/workflows/deploy.yml` が実行され、自動的にビルドとデプロイが行われます。
- **GitHub Pages 設定**: リポジトリの `Settings > Pages` で、Source を `GitHub Actions` に設定してください。
