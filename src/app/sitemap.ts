import type { MetadataRoute } from 'next';
import { TEMPLATES } from '@/lib/data/mock-templates';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) return [];

  const lastModified = new Date();
  return [
    ...['', '/templates', '/pricing', '/about', '/contact'].map((route) => ({
      url: new URL(route, baseUrl).toString(),
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.7,
    })),
    ...TEMPLATES.map((template) => ({
      url: new URL(`/templates/${template.slug}`, baseUrl).toString(),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
