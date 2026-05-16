// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Публичный адрес сайта (без подпапки)
  site: 'https://fruwilo.github.io',

  // Подпапка, в которой живёт сайт на GitHub Pages
  base: '/sentinel2-lab',

  // Все URL с завершающим слэшем: /lessons/ndvi/ вместо /lessons/ndvi
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx()],
});