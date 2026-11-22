import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, ExternalLink } from 'lucide-react';
import { getAdSenseClient } from './AdSenseScript';

export function Footer() {
  const hasAdsense = !!getAdSenseClient();

  return (
    <footer className="border-t border-line bg-surface mt-16 py-10 text-xs text-secondary">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Bannière Stage Récupération Points Affiliation */}
        <div className="p-4 rounded-xl border border-accent/30 bg-accent/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent text-white">
                Stage Préfecture Agréé
              </span>
              <span className="text-xs font-semibold text-fg">Récupérez +4 points en 48 heures</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Stage de sensibilisation à la sécurité routière sans examen ni test. Valable dans toute la France dès 160 €, crédité sous 48h.
            </p>
          </div>
          <Link
            href="/stage/75-paris"
            className="px-4 py-2.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all text-center shrink-0 shadow-sm"
          >
            Trouver un stage près de chez moi →
          </Link>
        </div>

        {/* Accès rapide aux départements majeurs */}
        <div className="pt-2 border-t border-line/60">
          <p className="font-semibold text-fg mb-2">Stages de récupération de points par département :</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/stage/75-paris" className="px-2 py-1 rounded bg-elevated hover:text-fg border border-line">
              75 Paris
            </Link>
            <Link href="/stage/69-rhone" className="px-2 py-1 rounded bg-elevated hover:text-fg border border-line">
              69 Lyon / Rhône
            </Link>
            <Link href="/stage/13-bouches-du-rhone" className="px-2 py-1 rounded bg-elevated hover:text-fg border border-line">
              13 Marseille / BdR
            </Link>
            <Link href="/stage/33-gironde" className="px-2 py-1 rounded bg-elevated hover:text-fg border border-line">
              33 Bordeaux / Gironde
            </Link>
            <Link href="/stage/59-nord" className="px-2 py-1 rounded bg-elevated hover:text-fg border border-line">
              59 Lille / Nord
            </Link>
            <Link href="/stage/31-haute-garonne" className="px-2 py-1 rounded bg-elevated hover:text-fg border border-line">
              31 Toulouse
            </Link>
            <Link href="/stage/44-loire-atlantique" className="px-2 py-1 rounded bg-elevated hover:text-fg border border-line">
              44 Nantes
            </Link>
            <Link href="/stage/06-alpes-maritimes" className="px-2 py-1 rounded bg-elevated hover:text-fg border border-line">
              06 Nice
            </Link>
            <Link href="/stage/92-hauts-de-seine" className="px-2 py-1 rounded bg-elevated hover:text-fg border border-line">
              92 Hauts-de-Seine
            </Link>
            <Link href="/stage/93-seine-saint-denis" className="px-2 py-1 rounded bg-elevated hover:text-fg border border-line">
              93 Seine-Saint-Denis
            </Link>
            <Link href="/stage/94-val-de-marne" className="px-2 py-1 rounded bg-elevated hover:text-fg border border-line">
              94 Val-de-Marne
            </Link>
          </div>
        </div>

        {/* Liens transversaux des 7 services Ododex France */}
        <div className="pt-2 border-t border-line/60">
          <p className="font-semibold text-fg mb-2">Tous les services automobiles Ododex en France :</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <a href="/fr" className="hover:text-fg hover:underline">
              ⛽ Prix des carburants
            </a>
            <a href="/fr/zfe" className="hover:text-fg hover:underline">
              🌱 ZFE & Crit’Air
            </a>
            <a href="/fr/carte-grise" className="hover:text-fg hover:underline">
              📄 Carte grise (simulateur)
            </a>
            <a href="/fr/radars" className="hover:text-fg hover:underline font-semibold text-accent">
              📷 Radars & amendes (carte)
            </a>
            <a href="/fr/controle-technique" className="hover:text-fg hover:underline">
              🔍 Contrôle technique & centres
            </a>
            <a href="/fr/peages" className="hover:text-fg hover:underline">
              🛣️ Péages d’autoroutes
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-line/60">
          <div className="flex items-center gap-2">
            <span className="font-bold text-fg">Ododex</span>
            <span>·</span>
            <span>Simulateur officiel de permis à points et barème des infractions 2026</span>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            <a href="/fr" className="hover:text-fg hover:underline">
              Accueil Ododex
            </a>
            <Link href="/mentions-legales" className="hover:text-fg hover:underline">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-fg hover:underline">
              Confidentialité
            </Link>
            <Link href="/cookies" className="hover:text-fg hover:underline">
              Cookies
            </Link>
          </nav>
        </div>

        <p className="text-muted leading-relaxed">
          Informations conformes aux dispositions du Code de la route en vigueur en France (Articles L223-1 et suivants, R413-14 et suivants actualisés en 2026).
          Ododex est un portail citoyen d’information juridique indépendant, non affilié au Ministère de l’Intérieur ni à l’Agence Nationale de Traitement Automatisé des Infractions (ANTAI). Pour consulter votre solde officiel, rendez-vous sur le portail d’État MesPointsPermis.
        </p>

        {hasAdsense && (
          <p className="text-muted">
            Des annonces personnalisées peuvent être affichées conformément à notre politique de cookies et au cadre TCF v2.2.
          </p>
        )}
      </div>
    </footer>
  );
}
