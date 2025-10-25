import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This base path is configured for deployment on GitHub Pages.
  // It MUST match your repository name.
  base: '/MedUnited-Dashboard/',
})
