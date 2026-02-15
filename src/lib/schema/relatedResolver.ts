import { allArticles, getArticleBlocks, getArticleByUrl, type ArticleMeta } from '../../data/articles';
import { SITE_URL } from './constants';

const sectionPartOfBySection: Record<ArticleMeta['section'], { name: string; url: string }> = {
  vitamiinid: { name: 'Vitamiinid', url: '/vitamiinid/' },
  mineraalained: { name: 'Mineraalained', url: '/mineraalained/' },
  toidulisandid: { name: 'Toidulisandid', url: '/toidulisandid/' },
  'kasulik-info-ja-uudised': { name: 'Kasulik info ja uudised', url: '/kasulik-info-ja-uudised/' },
};

const categoryPartOfBySlug: Record<NonNullable<ArticleMeta['categorySlug']>, { name: string; url: string }> = {
  uudised: { name: 'Uudised', url: '/kasulik-info-ja-uudised/uudised/' },
  'praktiline-terviseinfo': { name: 'Praktiline terviseinfo', url: '/kasulik-info-ja-uudised/praktiline-terviseinfo/' },
};

export const resolveMainGuide = (article: ArticleMeta) => {
  if (!article.mainGuide) return null;
  const guide = getArticleByUrl(article.mainGuide);
  if (!guide) return null;

  return {
    '@type': 'CreativeWork',
    name: guide.title,
    url: new URL(guide.url, SITE_URL).toString(),
  };
};

export const resolveSectionPartOf = (article: ArticleMeta) => {
  if (article.section !== 'kasulik-info-ja-uudised') {
    const part = sectionPartOfBySection[article.section];
    return {
      '@type': 'CollectionPage',
      name: part.name,
      url: new URL(part.url, SITE_URL).toString(),
    };
  }

  if (article.categorySlug) {
    const part = categoryPartOfBySlug[article.categorySlug];
    return {
      '@type': 'CollectionPage',
      name: part.name,
      url: new URL(part.url, SITE_URL).toString(),
    };
  }

  const part = sectionPartOfBySection[article.section];
  return {
    '@type': 'CollectionPage',
    name: part.name,
    url: new URL(part.url, SITE_URL).toString(),
  };
};

export const resolveIsPartOf = (article: ArticleMeta) => {
  const entries = [resolveMainGuide(article), resolveSectionPartOf(article)].filter(Boolean);
  if (!entries.length) return undefined;
  if (entries.length === 1) return entries[0];
  return entries;
};

export const resolveMentions = (article: ArticleMeta) => {
  const blocks = getArticleBlocks(article, allArticles);
  const related = [...blocks.supporting.items, ...blocks.cluster.items, ...blocks.editorial.items];
  const unique = Array.from(new Map(related.map((entry) => [entry.url, entry])).values());

  return unique.map((entry) => ({
    '@type': 'Article',
    url: new URL(entry.url, SITE_URL).toString(),
    headline: entry.title,
  }));
};
