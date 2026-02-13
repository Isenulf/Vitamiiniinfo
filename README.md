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

  mineraalid/
    magneesium/
      index.md

  kasulik-info-ja-uudised/
    praktiline-terviseinfo/
      uni-ja-taastumine.md
```

- `index.md` обычно основной (pillar) материал.
- Дополнительные статьи можно хранить рядом (`puudus.md`, `kasulikkus.md` и т.д.).

---

## 2) Какие типы статей есть

Во frontmatter у статьи есть `type`:

- `pillar` — главная статья по теме
- `supporting` — дополнительная статья по теме
- `uudis` — новость
- `praktiline` — практическая статья

Раздел задаётся полем `section`:

- `vitamiinid`
- `mineraalid`
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

---

## 5) Как работает перелинковка

Перелинковка строится автоматически на основе:
- `topics`
- `type`
- `section`
- `mainGuide` (для supporting)

То есть вручную блоки “Seotud teemad / Uudised / Praktilised artiklid” прописывать не нужно.

---

## 6) Быстрый алгоритм добавления статьи

1. Создай нужную папку и файл в `src/pages/...`.
2. Вставь frontmatter + текст статьи.
3. Проверь, что `section`, `type`, `topics` заполнены корректно.
4. Запусти локальную проверку:

```bash
npm run build
```

Если build прошёл — маршрут и страница собраны корректно.

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
