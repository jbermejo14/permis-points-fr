import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { InfractionsTable } from '@/components/InfractionsTable';
import { AdSlot } from '@/components/AdSlot';
import { StageCtaCard } from '@/components/StageCtaCard';
import { getInfractions } from '@/lib/permis';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Barème des Infractions & Retrait de Points 2026 : Liste Complète | Ododex',
  description: 'Consultez la liste officielle de toutes les infractions au Code de la route en France, le nombre de points retirés (0 à 6 pts) et les amendes associées.',
  alternates: {
    canonical: absoluteUrl('/infractions'),
  },
};

export default function InfractionsPage() {
  const infractions = getInfractions();

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ name: 'Barème des infractions' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-fg tracking-tight">
          Barème Officiel des Infractions & Retrait de Points 2026
        </h1>
        <p className="text-sm text-secondary leading-relaxed max-w-3xl">
          Retrouvez ci-dessous l'intégralité des contraventions et délits routiers prévus par le Code de la route français. Cliquez sur chaque infraction pour consulter les articles de loi applicables, les montants des amendes (minorée, forfaitaire, majorée) et les peines complémentaires (suspension de permis, rétention, confiscation).
        </p>
      </div>

      <AdSlot id="infractions-top" label="Publicité" />

      <InfractionsTable initialInfractions={infractions} />

      <StageCtaCard urgencyLevel="normal" />

      <AdSlot id="infractions-bottom" label="Publicité" />
    </div>
  );
}
