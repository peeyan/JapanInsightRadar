/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // テーマ切り替え用のカスタムカラーを定義（CSS変数と連動）
        bgPrimary: "var(--bg-primary)",
        bgSecondary: "var(--bg-secondary)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        accent: "var(--accent)",
        accentGlow: "var(--accent-glow)",
      }
    },
  },
  plugins: [],
}