import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://numeros.app';

  const routes = [
    '',
    '/numerology',
    '/astrology',
    '/universe',
    '/product',
    '/features',
    '/about',
    '/blog',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/numerology' ? 0.9 : 0.7,
  }));
}
