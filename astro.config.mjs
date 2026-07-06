// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import remarkTocLabels from './src/plugins/remark-toc-labels.mjs';

// https://astro.build/config
export default defineConfig({
  // Публичный адрес сайта (без подпапки)
  site: 'https://fruwilo.github.io',

  // Подпапка, в которой живёт сайт на GitHub Pages
  base: '/gis-lessons',

  // Все URL с завершающим слэшем: /lessons/ndvi/ вместо /lessons/ndvi
  trailingSlash: 'always',

  // Плагины Markdown/MDX. Здесь: короткие названия шагов для оглавления
  // (синтаксис "## Полное название || Короткое" — см. src/plugins/remark-toc-labels.mjs)
  markdown: {
    remarkPlugins: [remarkTocLabels],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx()],
});