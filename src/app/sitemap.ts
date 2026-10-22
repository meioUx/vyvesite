import type { MetadataRoute } from 'next';
import { site } from '@/lib/config';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/contato'].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: 'monthly',
    priority: path ? 0.5 : 1,
  }));
}
