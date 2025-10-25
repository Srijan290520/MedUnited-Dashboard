import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace with the name of your GitHub repository.
  // This ensures that asset paths are correct when deployed.
  // For example, if your repo URL is 'https://github.com/user/my-app',
  // the base should be '/my-app/'.
  base: '/<YOUR_REPOSITORY_NAME>/',
})
