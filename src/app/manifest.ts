import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Twahanur Rahman | Full-Stack Web Developer',
    short_name: 'Twahanur',
    description:
      'Twahanur Rahman — Full-Stack Developer building multi-tenant SaaS, RAG systems, and scalable backends with NestJS, Next.js, PostgreSQL & Redis.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030014',
    theme_color: '#030014',
    icons: [
      {
        src: '/Photo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/Photo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
