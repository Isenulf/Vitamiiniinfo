import type { ArticleMeta } from '../../data/articles';

export type JsonLd = Record<string, unknown>;

export interface SchemaBuildInput {
  pageUrl: string;
  canonicalUrl: string;
  pageTitle: string;
  pageDescription: string;
  article?: ArticleMeta;
  categoryItems?: ArticleMeta[];
  categoryName?: string;
  categoryDescription?: string;
  isHomePage?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}
