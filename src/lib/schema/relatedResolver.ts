import { allArticles, getArticleBlocks, getArticleByUrl, type ArticleMeta } from '../../data/articles';
import { SITE_URL } from './constants';

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
