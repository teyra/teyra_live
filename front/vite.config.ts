import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { viteVConsole } from 'vite-plugin-vconsole'
import path from 'path'
export default defineConfig({
  server: {
    port: 5000,
    host: '0.0.0.0'
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon'
        })
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),

        IconsResolver({
          enabledCollections: ['ep']
        })
      ]
    }),
    Icons({
      autoInstall: true
    }),
    viteVConsole({
      entry: path.resolve('src/main.ts'), // 入口文件，或者可以使用这个配置: [path.resolve('src/main.js')]
      localEnabled: false, // 本地是否启用
      enabled: false, // 是否启用
      config: {
        maxLogNumber: 1000,
        theme: 'light' // 主题颜色 'dark'|'light'
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
