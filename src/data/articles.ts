import fs from 'node:fs';
import path from 'node:path';

export type ArticleSection = 'vitamiinid' | 'mineraalid' | 'toidulisandid' | 'kasulik-info-ja-uudised';
export type ArticleType = 'pillar' | 'supporting' | 'uudis' | 'praktiline';

export interface ArticleMeta {
  url: string;
  title: string;
  description: string;
  date: string;
  section: ArticleSection;
  type: ArticleType;
  topics: string[];
  cluster?: boolean;
  categorySlug?: 'uudised' | 'praktiline-terviseinfo';
  mainGuide?: string;
}

const sectionDescriptions: Record<ArticleSection, string> = {
  vitamiinid: 'Kõik, mida pead teadma vitamiinidest – nende rollist organismis, puuduse sümptomitest ja parimatest allikatest.',
  mineraalid: 'Olulised mineraalid, nende mõju tervisele ning praktilised soovitused tasakaalu hoidmiseks.',
  toidulisandid: 'Tasakaalukas ülevaade toidulisanditest, annustamisest ja teadlikust kasutamisest.',
  'kasulik-info-ja-uudised': 'Uudised teadusuuringutest ning praktilised terviseartiklid igapäevaseks otsustamiseks.',
};

export const sectionMeta: Record<ArticleSection, { title: string; description: string; icon: string; href: string }> = {
  vitamiinid: { title: 'Vitamiinid', description: sectionDescriptions.vitamiinid, icon: 'vitamiinid', href: '/vitamiinid/' },
  mineraalid: { title: 'Mineraalid', description: sectionDescriptions.mineraalid, icon: 'mineraalid', href: '/mineraalid/' },
  toidulisandid: { title: 'Toidulisandid', description: sectionDescriptions.toidulisandid, icon: 'toidulisandid', href: '/toidulisandid/' },
  'kasulik-info-ja-uudised': {
    title: 'Kasulik info ja uudised',
    description: sectionDescriptions['kasulik-info-ja-uudised'],
    icon: 'kasulik-info-ja-uudised',
    href: '/kasulik-info-ja-uudised/',
  },
};

const pagesRoot = path.join(process.cwd(), 'src/pages');

const findMarkdownFiles = (dir: string, acc: string[] = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findMarkdownFiles(fullPath, acc);
      continue;
    }
    if (entry.name.endsWith('.md')) acc.push(fullPath);
  }
  return acc;
};

const parseFrontmatter = (raw: string) => {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {} as Record<string, any>;
  const lines = match[1].split('\n');
  const data: Record<string, any> = {};
  let currentArrayKey = '';

  for (const line of lines) {
    const arrayItem = line.match(/^\s*-\s*(.+)$/);
    if (arrayItem && currentArrayKey) {
      data[currentArrayKey].push(arrayItem[1].replace(/^"|"$/g, ''));
      continue;
    }

    const pair = line.match(/^([\w]+):\s*(.*)$/);
    if (!pair) continue;

    const [, key, valueRaw] = pair;
    if (valueRaw === '') {
      currentArrayKey = key;
      data[key] = [];
      continue;
    }

    currentArrayKey = '';
    const value = valueRaw.replace(/^"|"$/g, '');
    if (value === 'true' || value === 'false') {
      data[key] = value === 'true';
    } else {
      data[key] = value;
    }
  }

  return data;
};

const filePathToUrl = (filePath: string) => {
  const relative = filePath.replace(pagesRoot, '').replace(/\\/g, '/').replace(/\.md$/, '');
  if (relative.endsWith('/index')) return `${relative.slice(0, -'/index'.length) || '/'}/`.replace('//', '/');
  return `${relative}/`.replace('//', '/');
};

const files = findMarkdownFiles(pagesRoot);

export const allArticles: ArticleMeta[] = files
  .map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const fm = parseFrontmatter(raw);
    if (!fm.section || !fm.type || !fm.title) return null;

    return {
      url: filePathToUrl(filePath),
      title: fm.title,
      description: fm.description || fm.title,
      date: fm.date || '2026-01-01',
      section: fm.section,
      type: fm.type,
      topics: Array.isArray(fm.topics) ? fm.topics : [],
      cluster: Boolean(fm.cluster),
      categorySlug: fm.categorySlug,
      mainGuide: fm.mainGuide,
    } as ArticleMeta;
  })
  .filter((entry): entry is ArticleMeta => Boolean(entry));

export const formatDate = (dateValue: string) =>
  new Date(dateValue).toLocaleDateString('et-EE', { day: 'numeric', month: 'long', year: 'numeric' });

export const buildBreadcrumbs = (pathname: string) => {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'Avaleht', href: '/' }];
  let running = '';

  for (const part of parts) {
    running += `/${part}`;
    crumbs.push({
      label: part
        .replaceAll('-', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .replace('Ja', 'ja'),
      href: `${running}/`,
    });
  }

  return crumbs;
};

export const latestArticles = [...allArticles].sort((a, b) => +new Date(b.date) - +new Date(a.date));
export const articlesBySection = (section: ArticleSection) => allArticles.filter((article) => article.section === section);

export const relatedForArticle = (article: ArticleMeta) => {
  const cluster = allArticles.filter(
    (entry) =>
      entry.url !== article.url &&
      entry.section !== 'kasulik-info-ja-uudised' &&
      entry.topics.some((topic) => article.topics.includes(topic)),
  );

  const editorial = allArticles.filter(
    (entry) =>
      entry.url !== article.url &&
      entry.section === 'kasulik-info-ja-uudised' &&
      entry.topics.some((topic) => article.topics.includes(topic)),
  );

  return [...cluster.slice(0, 2), ...editorial.slice(0, 2)];
};

export const getSupportingForGuide = (guideUrl: string) =>
  allArticles.filter((article) => article.type === 'supporting' && article.mainGuide === guideUrl);

export const getArticleByUrl = (url: string) => allArticles.find((article) => article.url === url);
