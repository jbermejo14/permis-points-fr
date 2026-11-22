import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Clock, Euro, BookOpen, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { StageCtaCard } from '@/components/StageCtaCard';
import {
  getInfractions,
  getInfractionBySlug,
  CATEGORIES_LABELS
} from '@/lib/permis';
import { absoluteUrl } from '@/lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const infractions = getInfractions();
  return infractions.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const infraction = getInfractionBySlug(slug);
  if (!infraction) return {};

  const isZero = infraction.points === 0;
  const title = `${infraction.nom} : Amende et Retrait de Points 2026 | Ododex`;
  const description = `${infraction.nom} (${infraction.article}). Retrait de ${
    isZero ? '0 point' : `${infraction.points} point(s)`
  }, amende forfaitaire de ${infraction.amendeForfaitaire} € et délai de récupération légal.`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/infraction/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/infraction/${slug}`),
      siteName: 'Ododex',
      locale: 'fr_FR',
      type: 'article',
    },
  };
}

export default async function InfractionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const infraction = getInfractionBySlug(slug);
  if (!infraction) notFound();

  const isZero = infraction.points === 0;
  const categoryLabel = CATEGORIES_LABELS[infraction.categorie];

  const allInfractions = getInfractions();
  const related = allInfractions
    .filter((i) => i.categorie === infraction.categorie && i.id !== infraction.id)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: 'Barème des infractions', url: '/infractions' },
          { name: infraction.nom }
        ]}
      />

      {/* EN-TÊTE DE L'INFRACTION */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-elevated text-secondary border border-line">
            {categoryLabel}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-elevated text-secondary border border-line">
            {infraction.classe}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-accent/10 text-accent border border-accent/20">
            {infraction.article}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-fg">
          {infraction.nom}
        </h1>

        <p className="text-base text-secondary leading-relaxed max-w-3xl">
          {infraction.description}
        </p>
      </section>

      {/* CARTES RÉSUMÉES (POINTS & MONTANT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Retrait de points */}
        <div className="p-5 rounded-2xl border border-line bg-surface space-y-2">
          <span className="text-xs text-muted block">Retrait de points</span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-4xl font-black ${
                isZero
                  ? 'text-positive'
                  : infraction.points >= 4
                  ? 'text-negative'
                  : 'text-warning'
              }`}
            >
              {isZero ? '0' : `-${infraction.points}`}
            </span>
            <span className="text-sm font-bold text-fg">
              point{infraction.points > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {isZero
              ? "Conformément à la loi en vigueur en 2026, aucun point n'est débité sur votre permis."
              : `Débité sur votre dossier de permis après paiement ou émission du titre exécutoire.`}
          </p>
        </div>

        {/* Amende forfaitaire */}
        <div className="p-5 rounded-2xl border border-line bg-surface space-y-2">
          <span className="text-xs text-muted block">Montant de l'amende</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-fg">
              {infraction.amendeForfaitaire} €
            </span>
            <span className="text-xs font-semibold text-secondary">tarif forfaitaire</span>
          </div>

          <div className="space-y-1 text-xs pt-1 border-t border-line/60">
            <div className="flex justify-between text-positive font-semibold">
              <span>Minorée (15j) :</span>
              <span>{infraction.amendeMinoree} €</span>
            </div>
            <div className="flex justify-between text-negative font-medium">
              <span>Majorée (45j) :</span>
              <span>{infraction.amendeMajoree} €</span>
            </div>
          </div>
        </div>

        {/* Délai de récupération automatique */}
        <div className="p-5 rounded-2xl border border-line bg-surface space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>Reconstitution automatique</span>
          </div>
          <div className="text-2xl font-black text-fg">
            {infraction.delaiRecuperationMois === 0
              ? 'Aucune perte'
              : `${infraction.delaiRecuperationMois} mois`}
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            {infraction.delaiRecuperationMois === 6
              ? "Reconstitution automatique après 6 mois sans infraction (Article L223-6)."
              : infraction.delaiRecuperationMois === 24
              ? "Délai de 2 ans sans aucune nouvelle contravention."
              : "Délai légal de 3 ans sans nouvelle infraction pour récupérer vos 12 points."}
          </p>
        </div>
      </div>

      {/* SLOT ADSENSE */}
      <AdSlot id={`infraction-${slug}-top`} label="Publicité" />

      {/* DÉTAIL DES SANCTIONS ET RÈGLES */}
      <div className="card space-y-5">
        <h2 className="text-xl font-extrabold text-fg">
          Détail des peines, sanctions et recours légaux
        </h2>

        <div className="space-y-4 text-sm text-secondary leading-relaxed">
          <div className="p-4 rounded-xl border border-line bg-elevated/40 space-y-1">
            <h3 className="font-bold text-fg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span>Peines complémentaires encourues</span>
            </h3>
            <p className="text-xs sm:text-sm text-secondary">
              {infraction.peineComplementaire}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-fg mb-1">
              Quand les points sont-ils effectivement retirés ?
            </h3>
            <p className="text-xs sm:text-sm text-secondary">
              Contrairement à une idée reçue, le retrait de points n'a pas lieu le jour du flash ou du contrôle de police. En vertu de l'article L223-1 du Code de la route, la perte de points intervient juridiquement au moment du paiement de l'amende forfaitaire ou à l'expiration du délai de recours (titre exécutoire de l'amende majorée).
            </p>
          </div>

          <div>
            <h3 className="font-bold text-fg mb-1">
              Comment contester cette infraction ?
            </h3>
            <p className="text-xs sm:text-sm text-secondary">
              Si vous n'étiez pas au volant ou si vous contestez la régularité du constat, vous disposez d'un délai légal de 45 jours (porté à 30 jours pour l'amende majorée) pour déposer une requête en exonération directement en ligne sur le portail de l'ANTAI (antai.gouv.fr). Attention : ne payez pas l'amende si vous souhaitez contester, car le paiement vaut reconnaissance de l'infraction.
            </p>
          </div>
        </div>
      </div>

      {/* CALL TO ACTION STAGE RÉCUPÉRATION (+4 POINTS) */}
      <StageCtaCard urgencyLevel={infraction.points >= 4 ? 'critique' : 'normal'} />

      {/* INFRACTIONS SIMILAIRES */}
      {related.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-line">
          <h2 className="text-xl font-extrabold text-fg">
            Autres infractions dans la catégorie « {categoryLabel} »
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/infraction/${rel.slug}`}
                className="p-4 rounded-xl border border-line bg-surface hover:border-accent hover:bg-elevated/40 transition-all space-y-2 group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-accent block">
                    -{rel.points} point{rel.points > 1 ? 's' : ''} · {rel.amendeForfaitaire} €
                  </span>
                  <h3 className="font-bold text-sm text-fg group-hover:text-accent transition-colors mt-1">
                    {rel.nom}
                  </h3>
                </div>
                <span className="text-xs text-muted flex items-center gap-1 mt-2">
                  <span>Voir la fiche</span>
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
