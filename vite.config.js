import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@core': path.resolve(__dirname, './src/core'),
        '@shared': path.resolve(__dirname, './src/shared'),
        '@features': path.resolve(__dirname, './src/features'),
        '@api': path.resolve(__dirname, './src/core/api'),
      }
    },
    server: {
      port: 5173
    }
  };
})
