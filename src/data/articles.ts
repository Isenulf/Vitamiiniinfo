import fs from 'node:fs';
import path from 'node:path';

export type ArticleSection = 'vitamiinid' | 'mineraalained' | 'toidulisandid' | 'kasulik-info-ja-uudised';
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

export interface BlockResult {
  title?: string;
  items: ArticleMeta[];
  hasMore: boolean;
  moreLink?: string;
}

export interface ArticleBlocks {
  supporting: BlockResult;
  cluster: BlockResult;
  editorial: BlockResult;
}

const sectionDescriptions: Record<ArticleSection, string> = {
  vitamiinid: 'Kõik, mida pead teadma vitamiinidest – nende rollist organismis, puuduse sümptomitest ja parimatest allikatest.',
  mineraalained: 'Olulised mineraalained, nende mõju tervisele ning praktilised soovitused tasakaalu hoidmiseks.',
  toidulisandid: 'Tasakaalukas ülevaade toidulisanditest, annustamisest ja teadlikust kasutamisest.',
  'kasulik-info-ja-uudised': 'Uudised teadusuuringutest ning praktilised terviseartiklid igapäevaseks otsustamiseks.',
};

export const sectionMeta: Record<ArticleSection, { title: string; description: string; icon: string; href: string }> = {
  vitamiinid: { title: 'Vitamiinid', description: sectionDescriptions.vitamiinid, icon: 'vitamiinid', href: '/vitamiinid/' },
  mineraalained: { title: 'Mineraalained', description: sectionDescriptions.mineraalained, icon: 'mineraalained', href: '/mineraalained/' },
  toidulisandid: { title: 'Toidulisandid', description: sectionDescriptions.toidulisandid, icon: 'toidulisandid', href: '/toidulisandid/' },
  'kasulik-info-ja-uudised': {
    title: 'Kasulik info ja uudised',
    description: sectionDescriptions['kasulik-info-ja-uudised'],
    icon: 'kasulik-info-ja-uudised',
    href: '/kasulik-info-ja-uudised/',
  },
};

export const articleTypeLabels: Record<ArticleType, string> = {
  pillar: 'Ülevaade',
  supporting: 'Lisainfo',
  uudis: 'Uudis',
  praktiline: 'Artikkel',
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

export const getSharedTopicsCount = (a: ArticleMeta, b: ArticleMeta) => {
  if (!a.topics.length || !b.topics.length) return 0;
  const bTopics = new Set(b.topics);
  let sharedCount = 0;

  for (const topic of a.topics) {
    if (bTopics.has(topic)) sharedCount += 1;
  }

  return sharedCount;
};

export const getParentSectionUrl = (section: ArticleSection) => {
  if (section === 'kasulik-info-ja-uudised') return '/kasulik-info-ja-uudised/';
  return sectionMeta[section].href;
};

const byDateDesc = (a: ArticleMeta, b: ArticleMeta) => +new Date(b.date) - +new Date(a.date);

export const getArticleBlocks = (current: ArticleMeta, articles: ArticleMeta[]): ArticleBlocks => {
  // Stores URLs that were already shown in an earlier block to avoid duplicates.
  const usedUrls = new Set<string>();
  const isPillar = current.type === 'pillar';

  const supportingCandidates: ArticleMeta[] = [];
  const clusterCandidates: Array<{ article: ArticleMeta; sharedTopics: number }> = [];
  const editorialCandidates: ArticleMeta[] = [];

  // Single pass over all articles: classify items into candidate pools.
  for (const article of articles) {
    if (article.url === current.url) continue;

    if (isPillar && article.mainGuide === current.url) {
      supportingCandidates.push(article);
      continue;
    }

    const sharedTopics = getSharedTopicsCount(current, article);
    if (sharedTopics === 0) continue;

    if (article.section === 'kasulik-info-ja-uudised') {
      editorialCandidates.push(article);
      continue;
    }

    clusterCandidates.push({ article, sharedTopics });
  }

  // Block 1: supporting articles for a pillar, latest first.
  const supportingSorted = supportingCandidates.sort(byDateDesc);
  const supportingItems = supportingSorted.slice(0, 4);
  for (const item of supportingItems) usedUrls.add(item.url);

  // Block 2: related cluster articles, ranked by shared topics then freshness.
  const filteredCluster = clusterCandidates.filter(({ article }) => !usedUrls.has(article.url));
  const clusterSorted = filteredCluster.sort((a, b) => {
    if (b.sharedTopics !== a.sharedTopics) return b.sharedTopics - a.sharedTopics;
    return byDateDesc(a.article, b.article);
  });
  const clusterItems = clusterSorted.slice(0, 3).map(({ article }) => article);
  for (const item of clusterItems) usedUrls.add(item.url);

  // Block 3: editorial materials with shared topics, newest first.
  const filteredEditorial = editorialCandidates
    .filter((article) => !usedUrls.has(article.url))
    .sort(byDateDesc);
  const editorialItems = filteredEditorial.slice(0, 3);

  return {
    supporting: {
      title: `${current.title} huvitab sind? Loe lisaks`,
      items: isPillar ? supportingItems : [],
      hasMore: isPillar ? supportingSorted.length > 4 : false,
      moreLink: isPillar && supportingSorted.length > 4 ? current.url : undefined,
    },
    cluster: {
      title: 'Seotud teemad',
      items: clusterItems,
      hasMore: clusterSorted.length > 3,
      moreLink: clusterSorted.length > 3 ? getParentSectionUrl(current.section) : undefined,
    },
    editorial: {
      title: 'Hea teada',
      items: editorialItems,
      hasMore: filteredEditorial.length > 3,
      moreLink: filteredEditorial.length > 3 ? '/kasulik-info-ja-uudised/' : undefined,
    },
  };
};

export const getSupportingForGuide = (guideUrl: string) =>
  allArticles.filter((article) => article.type === 'supporting' && article.mainGuide === guideUrl);

export const getArticleByUrl = (url: string) => allArticles.find((article) => article.url === url);
