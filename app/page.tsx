import React from 'react';
import Link from 'next/link';
import { Award, ShieldAlert, BookOpen, MapPin, ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { PointsSimulator } from '@/components/PointsSimulator';
import { InfractionsTable } from '@/components/InfractionsTable';
import { StageCtaCard } from '@/components/StageCtaCard';
import { AdSlot } from '@/components/AdSlot';
import { getInfractions, getDepartements, getGuides } from '@/lib/permis';

export default function HomePage() {
  const infractions = getInfractions();
  const departements = getDepartements();
  const guides = getGuides();

  const topDepartements = departements.slice(0, 18);

  const faqItems = [
    {
      q: "Combien de points peut-on perdre au maximum en une seule fois ?",
      a: "Selon l'article L223-2 du Code de la route français, lorsqu'un conducteur commet plusieurs infractions simultanées constatées lors d'un même contrôle, le retrait total est strictement plafonné à 8 points maximum. Même si le cumul des infractions dépasse ce chiffre (ex. alcool 6 pts + feu rouge 4 pts = 10 pts), seuls 8 points sont retirés."
    },
    {
      q: "Est-ce que les excès de vitesse de moins de 5 km/h font perdre des points en 2026 ?",
      a: "Non. Depuis la réforme entrée en vigueur le 1er janvier 2024 et pérennisée en 2026, les excès de vitesse de moins de 5 km/h n'entraînent plus aucun retrait de point (0 point retiré). Seule l'amende forfaitaire (68 € hors agglomération ou 135 € en agglomération) reste exigible."
    },
    {
      q: "Comment fonctionne la récupération automatique de points sans stage ?",
      a: "Pour un point unique perdu, il est restitué au bout de 6 mois sans aucune nouvelle infraction. Pour les infractions de 2e et 3e classe, le solde remonte à 12 points au bout de 2 ans sans infraction. Pour les infractions de 4e classe ou plus graves et pour les délits, le délai est de 3 ans. Enfin, la règle décennale réattribue automatiquement chaque point individuel 10 ans jour pour jour après son retrait."
    },
    {
      q: "Combien de points récupère-t-on avec un stage de sensibilisation ?",
      a: "Un stage agréé par la Préfecture permet de récupérer jusqu'à 4 points de permis de conduire, dans la limite de votre plafond légal (12 points pour un permis classique ou 6 à 10 points en période probatoire). La formation dure 14 heures réparties sur 2 jours consécutifs, sans aucun examen."
    },
    {
      q: "Quelle est la règle de la Lettre 48N pour les jeunes conducteurs ?",
      a: "En période probatoire, si vous commettez une infraction entraînant la perte d'au moins 3 points (ex. téléphone au volant, feu rouge, excès de vitesse ≥ 30 km/h), le Ministère vous envoie la lettre recommandée 48N. Vous devez obligatoirement suivre un stage de récupération sous 4 mois. Vous récupérez 4 points et l'amende payée vous est remboursée par le Trésor Public."
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>Barème du Code de la route 2026</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-fg">
          Simulateur de Permis à Points, Amendes & Stages
        </h1>

        <p className="text-base sm:text-lg text-secondary leading-relaxed">
          Calculez instantanément votre nouveau solde de points, le montant des amendes (minorée, forfaitaire, majorée) et trouvez un stage agréé en préfecture (+4 points) pour sauver votre permis de conduire.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2 text-xs text-muted">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-positive" />
            Réforme 2024-2026 : 0 pt si &lt; 5 km/h
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-positive" />
            Plafond légal 8 points (Art. L223-2)
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-positive" />
            Permis probatoire & Lettre 48N
          </span>
        </div>
      </section>

      {/* SLOT ADSENSE 1 */}
      <AdSlot id="permis-home-top" label="Publicité" />

      {/* CALCULATEUR INTERACTIF */}
      <section>
        <PointsSimulator />
      </section>

      {/* BANNIÈRE STAGE AFFILIATION */}
      <section id="stages">
        <StageCtaCard urgencyLevel="normal" />
      </section>

      {/* CATALOGUE DES INFRACTIONS */}
      <section className="space-y-4 pt-4 border-t border-line">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-fg">
              Barème complet des infractions du Code de la route 2026
            </h2>
            <p className="text-xs sm:text-sm text-secondary">
              Consultez le retrait de points, le montant de l'amende et les peines complémentaires pour chaque infraction.
            </p>
          </div>
          <Link
            href="/infractions"
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Voir toutes les infractions ({infractions.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <InfractionsTable />
      </section>

      {/* SLOT ADSENSE 2 */}
      <AdSlot id="permis-home-middle" label="Publicité" />

      {/* ANNUAIRE PAR DÉPARTEMENT */}
      <section className="space-y-4 pt-4 border-t border-line">
        <div>
          <h2 className="text-2xl font-extrabold text-fg">
            Stages de récupération de points par département
          </h2>
          <p className="text-xs sm:text-sm text-secondary">
            Trouvez les dates et centres agréés par la Préfecture dans les 101 départements de France métropolitaine et d'outre-mer.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {topDepartements.map((d) => (
            <Link
              key={d.code}
              href={`/stage/${d.slug}`}
              className="p-3 rounded-xl border border-line bg-surface hover:border-accent hover:bg-accent/5 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="font-extrabold text-base text-accent block group-hover:scale-105 transition-transform">
                  {d.code}
                </span>
                <span className="text-xs font-bold text-fg block line-clamp-1 mt-0.5">
                  {d.nom}
                </span>
              </div>
              <span className="text-[10px] text-muted block mt-2">
                Dès {d.prixMoyenStage} € · ~{d.nbCentresEstimes} centres
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/stage/75-paris"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
          >
            <span>Consulter les 101 départements français</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* GUIDES PRATIQUES */}
      <section id="guides" className="space-y-4 pt-4 border-t border-line">
        <div>
          <h2 className="text-2xl font-extrabold text-fg">
            Guides pratiques et démarches permis de conduire
          </h2>
          <p className="text-xs sm:text-sm text-secondary">
            Tout ce qu'il faut savoir sur MesPointsPermis, le délai de restitution et les recours administratifs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guide/${g.slug}`}
              className="p-5 rounded-xl border border-line bg-surface hover:border-accent hover:bg-elevated/40 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1 text-accent font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  Guide pratique
                </span>
                <span>{g.tempsLecture} de lecture</span>
              </div>
              <h3 className="font-bold text-base text-fg group-hover:text-accent transition-colors">
                {g.titre}
              </h3>
              <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                {g.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FOIRE AUX QUESTIONS (FAQ Schema.org) */}
      <section className="space-y-4 pt-4 border-t border-line">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-accent" />
          <h2 className="text-2xl font-extrabold text-fg">
            Questions fréquentes sur le permis à points en France
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <details
              key={idx}
              className="group p-4 rounded-xl border border-line bg-surface [&_summary::-webkit-details-marker]:none"
            >
              <summary className="font-bold text-sm text-fg cursor-pointer flex items-center justify-between gap-4 select-none">
                <span>{item.q}</span>
                <span className="text-secondary group-open:rotate-180 transition-transform shrink-0">
                  ▾
                </span>
              </summary>
              <p className="text-xs sm:text-sm text-secondary mt-3 leading-relaxed border-t border-line/60 pt-3">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
