import { buildBreadcrumbs } from '../../data/articles';
import { SITE_URL } from './constants';

export const buildBreadcrumbSchema = (pathname: string) => {
  const crumbs = buildBreadcrumbs(pathname);

  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: new URL(crumb.href, SITE_URL).toString(),
    })),
  };
};
