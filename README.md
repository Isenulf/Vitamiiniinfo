# Vitamiiniinfo.ee — простая документация для загрузки статей

Ниже — инструкция для редактора: как добавлять новые статьи **через папки и файлы** в `src/pages`.

---

## 1) Главный принцип

В этом проекте статьи = отдельные файлы в структуре GitHub.

Пример:

```text
src/pages/
  vitamiinid/
    d-vitamiin/
      index.md
      puudus.md
      kasulikkus.md

  mineraalained/
    magneesium/
      index.md

  kasulik-info-ja-uudised/
    praktiline-terviseinfo/
      uni-ja-taastumine.md
```

- `index.md` обычно основной материал типа `pillar` (лейбл: Ülevaade).
- Дополнительные статьи можно хранить рядом (`puudus.md`, `kasulikkus.md` и т.д.).

---

## 2) Какие типы статей есть

Во frontmatter у статьи есть `type`:

- `pillar` — Ülevaade
- `supporting` — Lisainfo
- `uudis` — Uudis
- `praktiline` — Artikkel

Раздел задаётся полем `section`:

- `vitamiinid`
- `mineraalained`
- `toidulisandid`
- `kasulik-info-ja-uudised`

---

## 3) Шаблон новой статьи (как ты и хотел)

```md
---
layout: ../../../layouts/ArticlePage.astro
title: "C-vitamiini uus annustamise soovitus"
description: "Короткое описание статьи"
section: "kasulik-info-ja-uudised"
type: "uudis"
categorySlug: "uudised"
date: "2026-02-02"

topics:
  - c-vitamiin

cluster: true
seoTitle: "C-vitamiini uus annustamise soovitus | Vitamiiniinfo.ee"
seoDescription: "Короткое SEO-описание"
---

<h1>C-vitamiini uus annustamise soovitus</h1>
<p>Siin algab artikli sisu…</p>
```

---

## 4) Важные поля frontmatter

Обязательные:
- `layout`
- `title`
- `section`
- `type`
- `date` (формат `YYYY-MM-DD`)
- `topics` (массив)

Очень желательно:
- `description`
- `seoTitle`
- `seoDescription`

Дополнительно:
- `categorySlug`: только для блока `kasulik-info-ja-uudised`
  - `uudised` или `praktiline-terviseinfo`
- `mainGuide`: для `supporting` статьи ссылка на основной материал, например:
  - `mainGuide: "/vitamiinid/c-vitamiin/"`

### Поля для блока annustamine (дозировки)

Если хотите показать карточку дозировок (annustamine), добавьте во frontmatter:

- `dosageTitle` *(опционально)* — заголовок карточки.
  - Если не задан, заголовок собирается автоматически по статье (`<Pillar name> - palju võtta?`).
- `dosageRows` *(обязательно для показа блока)* — массив строк в формате:
  - `"Label|Value"`
- `dosageWarning` *(опционально)* — выделенная строка-предупреждение.
- `dosageNote` *(опционально)* — нижняя поясняющая строка.

Пример:

```md
dosageRows:
  - "Täiskasvanud|250–500 mg EPA + DHA"
  - "Rasedad|vähemalt 200 mg DHA"
dosageWarning: "Üle 3 g päevas kasuta arsti nõuandel"
dosageNote: "Vaata EPA + DHA kogust, mitte ainult kalaõli mg."
```

Важно:
- если `dosageRows` нет, annustamise plokk не выводится;
- это работает для всех разделов (`vitamiinid`, `mineraalained`, `toidulisandid`, `kasulik-info-ja-uudised`).

---

## 5) Как работает перелинковка

Перелинковка строится автоматически на основе:
- `topics`
- `type`
- `section`
- `mainGuide` (для supporting)

То есть вручную блоки “Seotud teemad / Uudised / Praktilised artiklid” прописывать не нужно.

---

## 5.1) Schema.org теперь заполняется автоматически (JSON-LD)

После последних изменений в `main` schema.org-разметка собирается автоматически для:

- главной страницы;
- страниц разделов/категорий;
- всех статей (`pillar`, `supporting`, `uudis`, `praktiline`).

Что важно для редактора:

- **`topics` = ваши теги**. Они используются не только для блоков “Seotud teemad”, но и для SEO/schema-связей между материалами.
- Для статьи в schema добавляются:
  - `about` (берётся из первого `topics`, если он есть),
  - `mentions` (формируется из связанных материалов по общим тегам/topics),
  - `isPartOf` (привязка к разделу, а для `supporting` — ещё и к `mainGuide`).

Итог: чем аккуратнее и стабильнее вы задаёте `topics`, тем точнее автоматически строятся и внутренние связи, и schema.org-граф.

---

## 6) Быстрый алгоритм добавления статьи

1. Создай нужную папку и файл в `src/pages/...`.
2. Вставь frontmatter + текст статьи.
3. Проверь, что `section`, `type`, `topics` заполнены корректно.
   - Желательно использовать одни и те же формулировки тегов в похожих статьях (например, везде `c-vitamiin`, а не в одном месте `c-vitamiin`, в другом `vitamiin-c`).
4. Запусти локальную проверку:

```bash
npm run build
```

Если build прошёл — маршрут и страница собраны корректно.

---

## 6.1) Как вставить annustamise plokk внутрь статьи на мобильном

Теперь можно управлять местом блока в тексте статьи с помощью короткого маркера:

- вставьте отдельной строкой: `[annus]`

Рекомендуемый сценарий:

```md
## Kuidas võtta

[annus]

Siia tuleb tavatekst…
```

Как это работает:
- **мобильная версия**: блок дозировок подставится прямо в место `[annus]`;
- **десктоп**: блок останется в правой sticky-колонке;
- если маркер не добавлен, мобильный блок остаётся внизу (в сайдбарной секции после статьи).

### Важно про маркер `[annus]`

- Маркер должен быть отдельной строкой (как отдельный абзац).
- Рекомендуется использовать **один маркер на статью**.
- Если `dosageRows` не заполнены, маркер ничего не вставит (и просто останется текстом в markdown, поэтому лучше не ставить маркер без данных).
- Если в статье нет маркера, карточка annustamine на мобильном не вставляется в середину и остаётся в стандартной зоне сайдбара/ниже статьи.

---

## 6.2) Как теперь устроены блоки справа и под статьёй (по разделам)

Ниже — текущая логика вывода блоков на страницах статьи (`ArticlePage`):

### Разделы `vitamiinid`, `mineraalained`, `toidulisandid`

**Справа (sidebar):**
- `Annustamine` (если есть `dosageRows`)
- `%Pillar huvitab sind? Loe lisaks` (supporting-материалы)

**Под статьёй (ниже контента):**
- `Seotud teemad`
- `Hea teada`

### Раздел `kasulik-info-ja-uudised`

**Справа (sidebar):**
- `Seotud teemad`

**Под статьёй (ниже контента):**
- `Hea teada`

Примечание: подбор карточек в этих блоках формируется автоматически из `topics`, `section`, `type`, `mainGuide`.

---

## 6.3) Полный пример pillar-статьи с annustamine + мобильной вставкой

```md
---
layout: ../../../layouts/ArticlePage.astro
title: "Omega-3 rasvhapped – teaduspõhine juhend"
description: "Kuidas valida omega-3 lisandit ja millal sellest kasu võib olla."
section: "toidulisandid"
type: "pillar"
date: "2026-01-22"
topics:
  - omega-3
  - süda
  - ajutervis
cluster: true
seoTitle: "Omega-3 juhend: valik ja annus | Vitamiiniinfo.ee"
seoDescription: "Praktiline omega-3 juhend: millal kaaluda lisandit..."

dosageRows:
  - "Täiskasvanud|250–500 mg EPA + DHA"
  - "Rasedad|vähemalt 200 mg DHA"
dosageWarning: "Üle 3 g päevas kasuta arsti nõuandel"
dosageNote: "Vaata EPA + DHA kogust, mitte ainult kalaõli mg."
---

## Kuidas võtta

[annus]

Praktiline lähenemine lisandile...
```

Что получится:
- на десктопе annustamine будет справа;
- на мобильном annustamine будет встроен прямо после `## Kuidas võtta`.

---

## 6.4) Быстрый чек-лист перед публикацией

1. Проверить `section`, `type`, `topics`.
2. Для supporting-материала проверить `mainGuide`.
3. Если нужен annustamine:
   - добавить `dosageRows`;
   - при необходимости `dosageWarning`/`dosageNote`;
   - если нужна вставка в тело на mobile — добавить `[annus]` в нужное место.
4. Проверить `seoTitle` и `seoDescription`.
5. Запустить `npm run build`.

---

## 6.5) Частые ошибки редактора

- **`dosageRows` без разделителя `|`**
  - Неправильно: `"Täiskasvanud 250 mg"`
  - Правильно: `"Täiskasvanud|250 mg"`

- **Случайные разные теги для одной темы**
  - Например: `c-vitamiin`, `vitamiin-c`, `C Vitamiin`.
  - Лучше выбрать один стандарт и использовать везде одинаково.

- **`mainGuide` без завершающего `/`**
  - Лучше использовать URL в формате `"/vitamiinid/c-vitamiin/"`.

- **Маркер `[annus]` вставлен, но нет `dosageRows`**
  - Блок не отрисуется как карточка, поэтому проверяйте frontmatter вместе с контентом.

---

## 7) Полезные примеры из проекта

- Основная статья:
  - `src/pages/vitamiinid/d-vitamiin/index.md`
- Supporting-статья:
  - `src/pages/vitamiinid/c-vitamiin/puudus.md`
- Новость:
  - `src/pages/kasulik-info-ja-uudised/uudised/c-vitamiini-uus-annustamise-soovitus.md`
- Практическая статья:
  - `src/pages/kasulik-info-ja-uudised/praktiline-terviseinfo/5-koige-olulisemat-vitamiini-talvel.md`

---

## 8) Команды

```bash
npm install
npm run dev
npm run build
```

---

Если хочешь, следующим шагом сделаю ещё и **готовый пустой шаблон-файл** `article-template.md`, чтобы ты просто копировал его и менял поля.

---

## 9) Зависимости — очень простыми словами

В `package.json` есть несколько библиотек. Ниже — зачем каждая нужна, без сложных терминов:

- `astro`
  - Это "двигатель" сайта. Он собирает страницы из файлов и делает готовый сайт.

- `@astrojs/mdx`
  - Позволяет писать статьи в формате MDX (Markdown + немного компонентов).

- `@astrojs/rss`
  - Нужен, чтобы сайт мог отдавать RSS-ленту (подписка на новые материалы).

- `@astrojs/sitemap`
  - Автоматически делает `sitemap.xml`, чтобы поисковикам было проще находить страницы.

- `sharp`
  - Обрабатывает картинки: уменьшает размер, оптимизирует качество, ускоряет загрузку.

Также в `engines` указано:

- `node >= 22.12.0`
  - Это минимальная версия Node.js, с которой проект гарантированно работает.

Если кратко: `astro` собирает сайт, плагины добавляют полезные функции (MDX/RSS/sitemap), а `sharp` отвечает за изображения.
