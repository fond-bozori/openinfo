import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import ViteComponents from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://new-api.openinfo.uz',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/'),
      },
    },
  },
  plugins: [
    vue(),
    ViteComponents({
      resolvers: [
        AntDesignVueResolver({
          importSass: true,
        }),
      ],
      // globalComponentsDeclaration: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
