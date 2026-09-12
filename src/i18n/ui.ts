// ====================================================
// i18n/ui.ts — языки сайта и подписи интерфейса
// ====================================================
// Уроки по умолчанию на русском. У некоторых есть перевод —
// тогда на странице появляется переключатель языка.
//
// Как устроено:
//   • русский — язык по умолчанию, его страницы живут по обычным адресам
//     /lessons/<урок>/
//   • перевод лежит по адресу с кодом языка на конце: /lessons/<урок>/fr/
//   • компоненты узнают текущий язык из адреса страницы —
//     getLangFromUrl(Astro.url). Пропсы протаскивать не нужно: содержимое
//     урока приходит в <slot>, до него пропсы не доходят.
// ====================================================

export const DEFAULT_LANG = 'ru';

/** Все языки сайта. Первый — язык по умолчанию (без кода в адресе). */
export const LANGS = ['ru', 'fr'] as const;

export type Lang = (typeof LANGS)[number];

/** Названия языков для переключателя: короткое — на кнопке, полное — в подсказке */
export const LANG_NAMES: Record<Lang, { short: string; full: string }> = {
  ru: { short: 'RU', full: 'Русский' },
  fr: { short: 'FR', full: 'Français' },
};

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}

/**
 * Определяет язык страницы по её адресу.
 * Код языка — последний сегмент пути: /gis-lessons/lessons/qgis-first-project/fr/
 * Если кода нет (или это главная) — язык по умолчанию.
 */
export function getLangFromUrl(url: URL): Lang {
  const last = url.pathname.split('/').filter(Boolean).at(-1);
  return isLang(last) ? last : DEFAULT_LANG;
}

// ====================================================
// Подписи интерфейса
// ====================================================
// Русский словарь — эталон: он задаёт набор ключей, остальные языки
// обязаны его повторить (за этим следит тип Record<Lang, ...>).
// Текст самих уроков здесь не живёт — он в .mdx.
// ====================================================

const ru = {
  'site.tagline': 'Учебные материалы по ДЗЗ и QGIS',
  'site.footer': 'Учебные материалы по ДЗЗ',

  'nav.top': 'Прокрутить наверх',
  'theme.toggle': 'Переключить тему',

  'lang.label': 'Язык урока',

  'toc.title': 'Содержание',
  'progress.title': 'Прогресс',
  /** {done} и {total} подставляются числами */
  'progress.count': '{done} из {total}',
  'step.mark': 'Отметить шаг выполненным',
  'step.done': '✓ Шаг выполнен',

  'callout.tip': 'Совет',
  'callout.warning': 'Важно',
  'callout.info': 'Заметка',
  'callout.attention': 'Обратите внимание',

  'checkpoint.title': 'Сверьтесь',
  'rescue.title': 'Не получилось? Возьмите готовый файл',
  'rescue.button': 'Скачать файл',
  'troubleshoot.title': 'Если не получилось',
  'submit.title': 'Что сдать',
  'submit.where': 'Куда:',

  'video.title': 'Видео',

  // Сложность урока: во frontmatter значение всегда русское (это ключ),
  // на странице показываем перевод
  'difficulty.новичок': 'новичок',
  'difficulty.средний': 'средний',
  'difficulty.продвинутый': 'продвинутый',
} as const;

export type UIKey = keyof typeof ru;

const fr: Record<UIKey, string> = {
  'site.tagline': 'Cours de télédétection et de QGIS',
  'site.footer': 'Cours de télédétection',

  'nav.top': 'Revenir en haut',
  'theme.toggle': 'Changer de thème',

  'lang.label': 'Langue de la leçon',

  'toc.title': 'Sommaire',
  'progress.title': 'Progression',
  'progress.count': '{done} sur {total}',
  'step.mark': 'Marquer l’étape comme faite',
  'step.done': '✓ Étape faite',

  'callout.tip': 'Astuce',
  'callout.warning': 'Important',
  'callout.info': 'À noter',
  'callout.attention': 'Attention',

  'checkpoint.title': 'Vérifiez',
  'rescue.title': 'Ça n’a pas marché ? Prenez le fichier tout prêt',
  'rescue.button': 'Télécharger le fichier',
  'troubleshoot.title': 'Si ça n’a pas marché',
  'submit.title': 'À rendre',
  'submit.where': 'Où :',

  'video.title': 'Vidéo',

  'difficulty.новичок': 'débutant',
  'difficulty.средний': 'intermédiaire',
  'difficulty.продвинутый': 'avancé',
};

const UI: Record<Lang, Record<UIKey, string>> = { ru, fr };

/**
 * Возвращает функцию перевода для языка:
 *   const t = useTranslations(lang);
 *   t('toc.title')
 *   t('progress.count', { done: 3, total: 12 })
 * Если ключа в словаре языка нет — отдаём русский вариант, а не пустоту.
 */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey, vars?: Record<string, string | number>): string {
    let text: string = UI[lang]?.[key] ?? ru[key];
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  };
}

/** Перевод значения difficulty из frontmatter («новичок» → «débutant») */
export function translateDifficulty(lang: Lang, value: string): string {
  const key = `difficulty.${value}` as UIKey;
  return UI[lang]?.[key] ?? value;
}
