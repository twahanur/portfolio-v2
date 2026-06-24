import '../index.css';
import 'katex/dist/katex.min.css';
import StyledComponentsRegistry from '../lib/registry';
import AiPortfolioAssistant from '../components/AiPortfolioAssistant';

export const metadata = {
  title: "Twahanur Rahman full-stack Web Developer",
  description: "Welcome to my website! I’m Twahanur Rahman — a full-stack web developer passionate about building responsive and user-friendly interfaces using technologies like React, Next.js, and Tailwind CSS. Explore my work and projects right here.",
  keywords: "Twahanur, Twaha, Twahanur Rahman, Thoha, Thohanur, Thohanur Rahman, Twahanur Rahman full-stack Web Developer, Twahanur Rahman Web Developer, Twahanur Rahman full-stack",
  verification: {
    google: "ZYNfZwMUiNwSMF3EMvY85bid2BVvB12uMMRfUNWw75A",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  openGraph: {
    type: "website",
    url: "https://twahanur.vercel.app",
    title: "Twahanur Rahman full-stack Web Developer",
    description: "Welcome to my website! I’m Twahanur Rahman — a full-stack web developer passionate about building responsive and user-friendly interfaces using technologies like React, Next.js, and Tailwind CSS. Explore my work and projects right here.",
    images: [
      {
        url: "https://twahanur.vercel.app",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    url: "https://twahanur.vercel.app/",
    title: "Twahanur Rahman full-stack Web Developer",
    description: "Welcome to my website! I’m Twahanur Rahman — a full-stack web developer passionate about building responsive and user-friendly interfaces using technologies like React, Next.js, and Tailwind CSS. Explore my work and projects right here.",
    images: ["https://twahanur.vercel.app"],
  }
};

export const viewport = {
  themeColor: "rgb(3,0,20)",
};

import { PortfolioProvider } from '../context/PortfolioContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/Photo.png" />
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
      </head>
      <body suppressHydrationWarning>
        <StyledComponentsRegistry>
          <PortfolioProvider>
            {children}
            <AiPortfolioAssistant />
          </PortfolioProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
