import '../index.css';
import 'katex/dist/katex.min.css';
import type { Metadata, Viewport } from 'next';
import StyledComponentsRegistry from '../lib/registry';
import AiPortfolioAssistant from '../components/AiPortfolioAssistant';
import { PortfolioProvider } from '../context/PortfolioContext';
import TerminalModal from '../components/TerminalModal';
import CustomContextMenu from '../components/CustomContextMenu';
import VisitorTracker from '../components/VisitorTracker';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twahanur.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Twahanur Rahman | Full-Stack Web Developer (Node.js, NestJS, Next.js)',
    template: '%s | Twahanur Rahman',
  },
  description:
    'Twahanur Rahman — full-stack developer building multi-tenant SaaS, RAG systems, and scalable backends with NestJS, Next.js, PostgreSQL & Redis.',
  keywords: [
    'Twahanur Rahman',
    'Twahanur',
    'Twaha',
    'Thohanur Rahman',
    'Full-Stack Web Developer',
    'NestJS Developer',
    'Next.js Developer',
    'React Developer',
    'Node.js Backend Developer',
    'TypeScript Developer',
    'SaaS Architecture',
    'RAG Systems',
    'Full-Stack Developer Bangladesh',
    'Software Engineer',
    'Web Developer Portfolio',
    'PostgreSQL Specialist',
  ],
  authors: [{ name: 'Twahanur Rahman', url: siteUrl }],
  creator: 'Twahanur Rahman',
  publisher: 'Twahanur Rahman',
  applicationName: 'Twahanur Rahman Portfolio',
  category: 'technology',
  classification: 'Software Engineering & Web Development Portfolio',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/Photo.png', sizes: '32x32', type: 'image/png' },
      { url: '/Photo.png', sizes: '192x192', type: 'image/png' },
      { url: '/Photo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/Photo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/Photo.png',
  },
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'ZYNfZwMUiNwSMF3EMvY85bid2BVvB12uMMRfUNWw75A',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Twahanur Rahman | Portfolio',
    title: 'Twahanur Rahman | Full-Stack Web Developer (Node.js, NestJS, Next.js)',
    description:
      'Twahanur Rahman — full-stack developer building multi-tenant SaaS, RAG systems, and scalable backends with NestJS, Next.js, PostgreSQL & Redis.',
    images: [
      {
        url: '/Meta.png',
        width: 1200,
        height: 630,
        alt: 'Twahanur Rahman - Full-Stack Web Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twahanur Rahman | Full-Stack Web Developer (Node.js, NestJS, Next.js)',
    description:
      'Twahanur Rahman — full-stack developer building multi-tenant SaaS, RAG systems, and scalable backends with NestJS, Next.js, PostgreSQL & Redis.',
    images: ['/Meta.png'],
    creator: '@Twahanur',
    site: '@Twahanur',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: 'rgb(3,0,20)',
  width: 'device-width',
  initialScale: 1,
};

const jsonLdPerson = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Twahanur Rahman',
  alternateName: ['Twaha', 'Thohanur', 'Thohanur Rahman'],
  url: siteUrl,
  image: `${siteUrl}/Photo.png`,
  jobTitle: 'Full-Stack Web Developer & Software Engineer',
  description:
    'Twahanur Rahman is a full-stack developer building multi-tenant SaaS, RAG systems, and scalable backends with NestJS, Next.js, PostgreSQL & Redis.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dhaka',
    addressCountry: 'Bangladesh',
  },
  sameAs: [
    'https://github.com/Twahanur',
    'https://linkedin.com/in/twahanur',
    'https://twitter.com/Twahanur',
    'https://codeforces.com/profile/Twaha',
    'https://leetcode.com/u/Twahanur/',
  ],
  knowsLanguage: ['English', 'Bengali'],
  knowsAbout: [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'Redis',
    'Tailwind CSS',
    'Multi-tenant SaaS Architecture',
    'Retrieval-Augmented Generation (RAG)',
  ],
};

const jsonLdProfilePage = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  dateCreated: '2024-01-01T00:00:00+06:00',
  dateModified: new Date().toISOString(),
  mainEntity: {
    '@type': 'Person',
    name: 'Twahanur Rahman',
    alternateName: ['Twaha', 'Thohanur'],
    description:
      'Full-stack developer building multi-tenant SaaS, RAG systems, and scalable backends with NestJS, Next.js, PostgreSQL & Redis.',
    image: `${siteUrl}/Photo.png`,
    sameAs: [
      'https://github.com/Twahanur',
      'https://linkedin.com/in/twahanur',
      'https://twitter.com/Twahanur',
    ],
  },
};

const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Twahanur Rahman | Portfolio',
  url: siteUrl,
  inLanguage: 'en-US',
  description:
    'Portfolio and blog of Twahanur Rahman, full-stack software engineer and web developer.',
  author: {
    '@type': 'Person',
    name: 'Twahanur Rahman',
    url: siteUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/Photo.png" />
        <link rel="apple-touch-icon" href="/Photo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProfilePage) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'xvf7z4zj8f'}");
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <StyledComponentsRegistry>
          <PortfolioProvider>
            <VisitorTracker />
            {children}
            <AiPortfolioAssistant />
            <TerminalModal />
            <CustomContextMenu />
          </PortfolioProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

