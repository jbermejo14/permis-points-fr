import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { InfractionsTable } from '@/components/InfractionsTable';
import { AdSlot } from '@/components/AdSlot';
import { StageCtaCard } from '@/components/StageCtaCard';
import { getInfractions } from '@/lib/permis';
import { buildMetadata, infractionsSeo } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(infractionsSeo());

export default function InfractionsPage() {
  const infractions = getInfractions();

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ name: 'Barème des infractions' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-fg tracking-tight">
          Barème des infractions et retrait de points 2026
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
