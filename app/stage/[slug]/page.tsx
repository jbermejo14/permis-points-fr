import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Award, Clock, MapPin, CheckCircle2, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { StageCtaCard } from '@/components/StageCtaCard';
import { getDepartements, getDepartementBySlug } from '@/lib/permis';
import { buildMetadata, stageSeo } from '@/lib/seo';
import { getDepartementLocative } from '@/lib/departement-articles';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const departements = getDepartements();
  return departements.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dept = getDepartementBySlug(slug);
  if (!dept) return {};

  return buildMetadata(stageSeo(dept), 'article');
}

export default async function DepartementStagePage({ params }: PageProps) {
  const { slug } = await params;
  const dept = getDepartementBySlug(slug);
  if (!dept) notFound();

  const allDepts = getDepartements();
  // Voisins ou départements de la même région
  const sameRegion = allDepts
    .filter((d) => d.region === dept.region && d.code !== dept.code)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: 'Stages par département', url: '/#stages' },
          { name: `${dept.code} - ${dept.nom}` }
        ]}
      />

      {/* EN-TÊTE DU DÉPARTEMENT */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent text-white">
            Département {dept.code}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-elevated text-secondary border border-line">
            Région {dept.region}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-elevated text-secondary border border-line">
            {dept.prefecture}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-fg">
          Stage de récupération de points {getDepartementLocative(dept.code)} ({dept.code})
        </h1>

        <p className="text-base text-secondary leading-relaxed max-w-3xl">
          Consultez les dates, tarifs et centres de formation agréés par la Préfecture{' '}
          <strong>{getDepartementLocative(dept.code)}</strong>. Récupérez jusqu'à <strong>+4 points</strong> sur votre permis de conduire dès le lendemain de votre stage, sans aucun examen.
        </p>
      </section>

      {/* CALL TO ACTION STAGE RÉSERVATION */}
      <StageCtaCard departement={dept} urgencyLevel="normal" />

      {/* STATISTIQUES & INFOS LOCALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-line bg-surface space-y-1">
          <span className="text-xs text-muted block">Tarif moyen constaté</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-fg">{dept.prixMoyenStage} €</span>
            <span className="text-xs text-secondary font-medium">pour les 2 jours</span>
          </div>
          <p className="text-[11px] text-muted">
            Tarif tout compris (formation 14h + transmission du dossier à la préfecture).
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-line bg-surface space-y-1">
          <span className="text-xs text-muted block">Centres agréés actifs</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-fg">~{dept.nbCentresEstimes}</span>
            <span className="text-xs text-secondary font-medium">centres agréés</span>
          </div>
          <p className="text-[11px] text-muted">
            Sessions organisées en continu chaque semaine (vendredi-samedi et lundi-mardi).
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-line bg-surface space-y-1">
          <span className="text-xs text-muted block">Principales villes de formation</span>
          <div className="text-sm font-bold text-fg line-clamp-1">
            {dept.villesPrincipales.join(', ')}
          </div>
          <p className="text-[11px] text-muted">
            Sessions disponibles à proximité de votre domicile ou lieu de travail.
          </p>
        </div>
      </div>

      <AdSlot id={`stage-${slug}-middle`} label="Publicité" />

      {/* DÉROULEMENT DU STAGE DANS CE DÉPARTEMENT */}
      <div className="card space-y-4">
        <h2 className="text-xl font-extrabold text-fg">
          Comment se déroule le stage de récupération {getDepartementLocative(dept.code)} ?
        </h2>

        <div className="space-y-4 text-sm text-secondary leading-relaxed">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-accent/10 text-accent font-extrabold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div>
              <h3 className="font-bold text-fg">Inscription en ligne en 2 minutes</h3>
              <p className="text-xs sm:text-sm text-secondary mt-0.5">
                Choisissez votre session parmi les dates disponibles {getDepartementLocative(dept.code)}. Vous recevrez immédiatement votre convocation officielle par email.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-accent/10 text-accent font-extrabold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div>
              <h3 className="font-bold text-fg">2 jours de formation (14 heures)</h3>
              <p className="text-xs sm:text-sm text-secondary mt-0.5">
                Présence obligatoire de 9h à 17h pendant les deux journées. La formation est animée par un enseignant de la conduite BAFM et un psychologue spécialisé agréés par la Préfecture. Pas d'examen, de test éliminatoire ni de conduite.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-accent/10 text-accent font-extrabold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div>
              <h3 className="font-bold text-fg">Crédit immédiat de +4 points</h3>
              <p className="text-xs sm:text-sm text-secondary mt-0.5">
                Une attestation de fin de stage vous est remise en main propre. Le centre transmet automatiquement votre dossier à la Préfecture. Vos 4 points sont crédités avec effet dès le lendemain du stage !
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AUTRES DÉPARTEMENTS DANS LA RÉGION */}
      {sameRegion.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-line">
          <h2 className="text-xl font-extrabold text-fg">
            Autres départements dans la région {dept.region}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {sameRegion.map((r) => (
              <Link
                key={r.code}
                href={`/stage/${r.slug}`}
                className="p-3 rounded-xl border border-line bg-surface hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <span className="font-extrabold text-base text-accent block">
                  {r.code}
                </span>
                <span className="text-xs font-bold text-fg block line-clamp-1 mt-0.5">
                  {r.nom}
                </span>
                <span className="text-[10px] text-muted block mt-1">
                  Dès {r.prixMoyenStage} €
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
