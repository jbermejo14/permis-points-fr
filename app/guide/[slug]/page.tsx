import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { StageCtaCard } from '@/components/StageCtaCard';
import { getGuides, getGuideBySlug } from '@/lib/permis';
import { absoluteUrl } from '@/lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const guides = getGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: `${guide.titre} | Guide Permis à Points Ododex`,
    description: guide.description,
    alternates: {
      canonical: absoluteUrl(`/guide/${slug}`),
    },
    openGraph: {
      title: `${guide.titre} | Ododex`,
      description: guide.description,
      url: absoluteUrl(`/guide/${slug}`),
      siteName: 'Ododex',
      locale: 'fr_FR',
      type: 'article',
    },
  };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const otherGuides = getGuides().filter((g) => g.slug !== guide.slug);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: 'Guides officiels', url: '/#guides' },
          { name: guide.titre }
        ]}
      />

      <article className="space-y-6">
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="flex items-center gap-1 text-accent font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              Guide pratique officiel
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {guide.tempsLecture} de lecture
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-fg">
            {guide.titre}
          </h1>

          <p className="text-base text-secondary leading-relaxed">
            {guide.description}
          </p>
        </header>

        <AdSlot id={`guide-${slug}-top`} label="Publicité" />

        <div className="space-y-6 text-sm text-secondary leading-relaxed">
          {guide.chapitres.map((chapitre, idx) => (
            <section key={idx} className="card space-y-2">
              <h2 className="text-lg md:text-xl font-extrabold text-fg">
                {chapitre.titre}
              </h2>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                {chapitre.contenu}
              </p>
            </section>
          ))}
        </div>
      </article>

      <StageCtaCard urgencyLevel="normal" />

      {otherGuides.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-line">
          <h2 className="text-xl font-extrabold text-fg">
            Autres guides utiles sur le permis de conduire
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {otherGuides.map((og) => (
              <Link
                key={og.slug}
                href={`/guide/${og.slug}`}
                className="p-4 rounded-xl border border-line bg-surface hover:border-accent hover:bg-elevated/40 transition-all space-y-2 group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] text-muted block mb-1">
                    {og.tempsLecture} de lecture
                  </span>
                  <h3 className="font-bold text-sm text-fg group-hover:text-accent transition-colors">
                    {og.titre}
                  </h3>
                </div>
                <span className="text-xs text-accent font-semibold flex items-center gap-1 mt-2">
                  <span>Lire le guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
