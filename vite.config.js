import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    root: 'src',
    build: {
      sourcemap: true,
      rollupOptions: {
        input: glob.sync('./src/*.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js';
            }
            return '[name].js';
          },
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      outDir: '../dist',
      emptyOutDir: true,
    },
    plugins: [
      injectHTML({
        injectData: {
          header: fs.readFileSync(path.resolve(__dirname, 'src/partials/header.html'), 'utf-8'),
          hero: fs.readFileSync(path.resolve(__dirname, 'src/partials/hero.html'), 'utf-8'),
          'furniture-list': fs.readFileSync(path.resolve(__dirname, 'src/partials/furniture-list.html'), 'utf-8'),
          'about-us': fs.readFileSync(path.resolve(__dirname, 'src/partials/about-us.html'), 'utf-8'),
          fag: fs.readFileSync(path.resolve(__dirname, 'src/partials/fag.html'), 'utf-8'),
          feedback: fs.readFileSync(path.resolve(__dirname, 'src/partials/feedback.html'), 'utf-8'),
          'furniture-detail': fs.readFileSync(path.resolve(__dirname, 'src/partials/furniture-detail.html'), 'utf-8'),
          'order-modal': fs.readFileSync(path.resolve(__dirname, 'src/partials/order-modal.html'), 'utf-8'),
          footer: fs.readFileSync(path.resolve(__dirname, 'src/partials/footer.html'), 'utf-8'),
        }
      }),
      FullReload(['./src/**/*.html']),
      SortCss({
        sort: 'mobile-first',
      }),
    ],
  };
});

