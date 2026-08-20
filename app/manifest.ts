import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DevIcons — Developer Icon & Raw Asset Registry',
    short_name: 'DevIcons',
    description: 'A high-craft developer icon repository merging native web capabilities with structural aesthetics and direct raw CDN file access.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030305',
    theme_color: '#00f0ff',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
