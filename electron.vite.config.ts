import { join, resolve } from 'node:path'
import { defineConfig } from 'electron-vite'
import type { UserConfig } from 'vite'
import viteCp from 'vite-plugin-cp'
import viteZipPack from 'unplugin-zip-pack/vite'

const slug = 'ark_sender'

const baseConfig: UserConfig = {
  resolve: {
    alias: {
      '@/manifest': join(__dirname, 'manifest.json'),
      '@': join(__dirname, 'src')
    }
  },
  build: {
    minify: 'esbuild'
  }
}

export default defineConfig({
  main: {
    ...baseConfig
  },
  preload: {
    ...baseConfig
  },

  /**
   * 修正renderer的入口文件，以及打包模式
   */
  renderer: {
    ...baseConfig,
    plugins: [
      viteCp({
        targets: [
          { src: './manifest.json', dest: 'out' },
          { src: './assets/icon.svg', dest: 'out/assets' },
          { src: './style/global.css', dest: 'out/style' },
        ]
      }),
      viteZipPack({
        in: './out',
        out: resolve(__dirname, `./${slug}.zip`)
      })
    ],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'src/renderer/index.ts')
      },
      lib: {
        entry: resolve(__dirname, 'src/renderer/index.ts'),
        formats: ['es'],
        // FIX: 使用函数返回可以避免生成非mjs后缀
        fileName: () => 'index.js'
      },
      minify: 'esbuild'
    }
  }
})
