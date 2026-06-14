import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Must match the GitHub Pages repo name: https://<user>.github.io/<repo>/
export default defineConfig({
  base: '/bms-presentation/',
  plugins: [react(), tailwindcss()],
})
