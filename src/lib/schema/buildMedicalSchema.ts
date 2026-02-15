import { execSync } from 'node:child_process';
import { buildBreadcrumbSchema } from './breadcrumbBuilder';
import { AUTHOR, DEFAULT_IMAGE_URL, EDITOR, PUBLISHER, SITE_URL } from './constants';
import { buildFaqSchema } from './faqParser';
import { buildHowToSchema } from './howToParser';
import { resolveMainGuide, resolveMentions } from './relatedResolver';
import { buildCategoryGraph } from './categoryBuilder';
import type { JsonLd, SchemaBuildInput } from './types';

const modifiedCache = new Map<string, string>();

const toAbsoluteUrl = (value: string) => {
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return new URL(value, SITE_URL).toString();
};

const getDateModified = (filePath: string | undefined, fallback: string) => {
  if (!filePath) return fallback;
  if (modifiedCache.has(filePath)) return modifiedCache.get(filePath) as string;

  try {
    const value = execSync(`git log -1 --format=%cI -- ${JSON.stringify(filePath)}`, { encoding: 'utf-8' }).trim();
    const normalized = value || fallback;
    modifiedCache.set(filePath, normalized);
    return normalized;
  } catch {
    modifiedCache.set(filePath, fallback);
    return fallback;
  }
};

const createHomeGraph = ({ pageTitle, pageDescription, canonicalUrl }: SchemaBuildInput): JsonLd[] => {
  const organizationId = `${SITE_URL}/#organization`;

  return [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: 'Vitamiiniinfo.ee',
      url: SITE_URL,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Vitamiiniinfo.ee',
      url: SITE_URL,
      publisher: { '@id': organizationId },
    },
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      name: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      isPartOf: { '@id': `${SITE_URL}/#website` },
    },
  ];
};

const dedupeGraph = (graph: JsonLd[]) => {
  const seen = new Set<string>();
  return graph.filter((item) => {
    const id = (item['@id'] as string | undefined) || JSON.stringify([item['@type'], item.url, item.name]);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

export const buildSchemaGraph = (input: SchemaBuildInput): JsonLd[] => {
  const { article, pageUrl, canonicalUrl, pageTitle, pageDescription, categoryItems, categoryName, categoryDescription, isHomePage } = input;

  if (isHomePage) {
    return dedupeGraph(createHomeGraph(input));
  }

  if (categoryItems && categoryName && categoryDescription) {
    return dedupeGraph(
      buildCategoryGraph({
        pageUrl,
        name: categoryName,
        description: categoryDescription,
        items: categoryItems,
      }),
    );
  }

  if (!article) return [];

  const image = toAbsoluteUrl(article.heroImage || DEFAULT_IMAGE_URL);
  const datePublished = article.date;
  const dateModified = getDateModified(article.filePath, datePublished);
  const breadcrumb = {
    ...buildBreadcrumbSchema(pageUrl),
    '@id': `${canonicalUrl}#breadcrumb`,
  };
  const mainEntityOfPage = {
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
  };
  const baseMetadata = {
    mainEntityOfPage,
    datePublished,
    dateModified,
    author: AUTHOR,
    editor: EDITOR,
    publisher: PUBLISHER,
    image,
    about: article.topics[0] || article.title,
    isPartOf: resolveMainGuide(article) || undefined,
    mentions: resolveMentions(article),
  };

  const graph: JsonLd[] = [];

  if (article.type === 'pillar') {
    graph.push({
      '@type': 'MedicalWebPage',
      '@id': `${canonicalUrl}#medical-webpage`,
      name: article.title,
      description: article.description,
      url: canonicalUrl,
      ...baseMetadata,
    });
    graph.push({
      '@type': 'MedicalEntity',
      '@id': `${canonicalUrl}#medical-entity`,
      name: article.title,
      description: article.description,
      url: canonicalUrl,
    });
  }

  if (article.type === 'supporting') {
    graph.push({
      '@type': 'MedicalWebPage',
      '@id': `${canonicalUrl}#medical-webpage`,
      name: article.title,
      description: article.description,
      url: canonicalUrl,
      ...baseMetadata,
    });
    graph.push({
      '@type': 'Article',
      '@id': `${canonicalUrl}#article`,
      headline: article.title,
      description: article.description,
      url: canonicalUrl,
      ...baseMetadata,
    });

    const intentType = article.intent === 'ravi' ? 'MedicalTherapy' : 'MedicalCondition';
    graph.push({
      '@type': intentType,
      '@id': `${canonicalUrl}#intent`,
      name: article.title,
      description: article.description,
      url: canonicalUrl,
    });
  }

  if (article.type === 'uudis') {
    graph.push({
      '@type': 'NewsArticle',
      '@id': `${canonicalUrl}#news`,
      headline: article.title,
      description: article.description,
      url: canonicalUrl,
      ...baseMetadata,
    });
  }

  if (article.type === 'praktiline') {
    graph.push({
      '@type': 'Article',
      '@id': `${canonicalUrl}#article`,
      headline: article.title,
      description: article.description,
      url: canonicalUrl,
      ...baseMetadata,
    });
  }

  const faq = buildFaqSchema(article.rawContent);
  if (faq) graph.push({ ...faq, '@id': `${canonicalUrl}#faq` });

  const shouldBuildHowTo = article.type === 'praktiline' || article.howTo;
  if (shouldBuildHowTo) {
    const howTo = buildHowToSchema({
      rawContent: article.rawContent,
      pageTitle,
      pageDescription,
    });
    if (howTo) graph.push({ ...howTo, '@id': `${canonicalUrl}#howto` });
  }

  graph.push(breadcrumb);

  return dedupeGraph(graph);
};
