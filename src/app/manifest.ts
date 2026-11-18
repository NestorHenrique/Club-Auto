import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Clube Auto',
    short_name: 'Clube Auto',
    description: 'Plataforma de benefícios e descontos para motoristas de aplicativo.',
    start_url: '/',
    display: 'standalone',
    background_color: '#131315',
    theme_color: '#131315',
    icons: [
      { src: '/brand/icone-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icone-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
