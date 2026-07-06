// ====================================================
// remark-toc-labels — короткие названия для оглавления
// ====================================================
// Синтаксис в MDX-заголовке:
//
//   ### Шаг 2 — Добавьте подложку Yandex через QuickMapServices || Подложка Yandex
//
// На странице останется полное название (часть до "||"),
// а короткое имя попадёт в оглавление сайдбара.
// Если "||" нет — в оглавлении будет полный текст заголовка.
//
// Как это работает: плагин собирает короткие имена всех заголовков
// в порядке документа и кладёт массив в frontmatter (tocLabels).
// Страница урока получает его через remarkPluginFrontmatter
// и сшивает с массивом headings по индексу.
// ====================================================

export default function remarkTocLabels() {
  return (tree, file) => {
    const labels = [];

    (function walk(node) {
      if (node.type === 'heading') {
        labels.push(extractLabel(node));
        return;
      }
      if (node.children) node.children.forEach(walk);
    })(tree);

    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.tocLabels = labels;
  };
}

// Ищет "||" в тексте заголовка. Возвращает короткое имя (или null)
// и удаляет маркер со всем, что после него, из видимого заголовка.
function extractLabel(heading) {
  const children = heading.children ?? [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type !== 'text') continue;

    const idx = child.value.indexOf('||');
    if (idx === -1) continue;

    // Короткое имя: остаток этого текстового узла + все узлы после него
    let label = child.value.slice(idx + 2);
    for (let j = i + 1; j < children.length; j++) {
      label += toPlainText(children[j]);
    }

    // Из видимого заголовка убираем маркер и всё, что за ним
    child.value = child.value.slice(0, idx).trimEnd();
    heading.children = children
      .slice(0, i + 1)
      .filter(c => !(c.type === 'text' && c.value === ''));

    return label.trim() || null;
  }

  return null;
}

function toPlainText(node) {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(toPlainText).join('');
}
