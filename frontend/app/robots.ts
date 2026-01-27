import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://numeros.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/numerology/results', '/astrology/results'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
