import type { ArticleMeta } from '../../data/articles';
import { DEFAULT_IMAGE_URL, SITE_URL } from './constants';
import { buildBreadcrumbSchema } from './breadcrumbBuilder';

const resolveImageUrl = (image?: string) => {
  if (!image) return DEFAULT_IMAGE_URL;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return new URL(image, SITE_URL).toString();
};

export const buildCategoryGraph = ({
  pageUrl,
  name,
  description,
  items,
}: {
  pageUrl: string;
  name: string;
  description: string;
  items: ArticleMeta[];
}) => {
  const canonicalUrl = new URL(pageUrl, SITE_URL).toString();
  const sorted = [...items].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const dateModified = sorted[0]?.date || new Date().toISOString().slice(0, 10);

  return [
    {
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl}#collection`,
      name,
      description,
      url: canonicalUrl,
      dateModified,
      mainEntity: sorted.map((item) => ({
        '@type': 'Article',
        headline: item.title,
        url: new URL(item.url, SITE_URL).toString(),
        datePublished: item.date,
        image: resolveImageUrl(item.heroImage),
      })),
    },
    {
      ...buildBreadcrumbSchema(pageUrl),
      '@id': `${canonicalUrl}#breadcrumb`,
    },
  ];
};
