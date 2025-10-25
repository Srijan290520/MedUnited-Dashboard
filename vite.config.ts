import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For local development, an empty base is fine and resolves path issues.
  //
  // IMPORTANT: For GitHub Pages deployment, you MUST change this back.
  // Follow the instructions in README.md to set the 'base' property
  // to your repository name. For example: base: '/medunited-dashboard/',
  base: '',
})
