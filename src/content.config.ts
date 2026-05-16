// ====================================================
// content.config.ts — описание коллекций контента
// ====================================================
// Здесь мы говорим Astro: "уроки лежат в src/content/lessons/,
// каждый — .mdx-файл, и у каждого должен быть такой набор полей".
// Astro проверит формат при сборке и даст ошибку, если что-то не так.
// ====================================================
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  // Откуда брать файлы уроков
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),

  // Схема — описание полей frontmatter
  schema: z.object({
    title: z.string(),                      // обязательно
    description: z.string(),                // обязательно
    duration: z.string(),                   // обязательно: "~1.5 часа" и т.п.
    tools: z.array(z.string()),             // обязательно: ["QGIS", ...]
    difficulty: z.enum(['новичок', 'средний', 'продвинутый']).optional(),
    order: z.number().optional(),           // порядок в списке (1, 2, 3...)
    cover: z.string().optional(),           // путь к превью-картинке
    publishedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),      // черновики не публикуются
  }),
});

// Экспортируем все коллекции одним объектом
export const collections = { lessons };