import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSenseScript } from '@/components/AdSenseScript';
import { buildMetadata, homeSeo } from '@/lib/seo';

export const metadata: Metadata = {
  ...buildMetadata(homeSeo()),
  metadataBase: new URL('https://ododex.com'),
  icons: {
    icon: '/fr/permis-points/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('ododex-theme');
                  var prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved || (prefDark ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
        <AdSenseScript />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-fg font-sans antialiased">
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
