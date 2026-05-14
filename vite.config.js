import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

publicPath: process.env.NODE_ENV === 'development';
export const publicPath = process.env.NODE_ENV === 'production' ? '/formulario_ecc/' : '/';

// https://vite.dev/config/
export default defineConfig({
  base:  process.env.NODE_ENV === 'production' ? '/formulario_ecc/' : '/',
  build: {
    rollupOptions: {
      input: 'index.html'
    }
  },
  esbuild: {
    target: 'esnext'
  },
  plugins: [
    vue(),
    process.env.NODE_ENV === 'development' && vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
