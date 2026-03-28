import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 自動でアプリをアップデート
      manifest: {
        name: 'Japan Insight Radar',
        short_name: 'InsightRadar',
        description: '世界の事実と裏の噂を覗き見る諜報ダッシュボード',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone', // これでブラウザのURLバーが消え、ネイティブアプリのようになります
        icons: [
          {
            // スマホのホーム画面に表示されるアイコン（仮のサイバーなアイコンURLを設定）
            src: 'https://cdn-icons-png.flaticon.com/512/11186/11186906.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})