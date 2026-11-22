import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSenseScript } from '@/components/AdSenseScript';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Permis à Points 2026 : Simulateur de Retrait, Amendes & Stages | Ododex',
  description: 'Simulateur officiel de perte de points et amendes (Code de la route 2026). Calculez vos délais de récupération, l\'impact des infractions et trouvez un stage de récupération de points agréé (+4 points).',
  metadataBase: new URL('https://ododex.com'),
  alternates: {
    canonical: absoluteUrl('/'),
  },
  icons: {
    icon: '/fr/permis-points/icon.svg',
  },
  openGraph: {
    title: 'Permis à Points 2026 : Simulateur de Retrait, Amendes & Stages | Ododex',
    description: 'Calculez en direct votre solde de points restant, le montant de l\'amende et trouvez un stage agréé dans votre département.',
    url: absoluteUrl('/'),
    siteName: 'Ododex',
    locale: 'fr_FR',
    type: 'website',
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
