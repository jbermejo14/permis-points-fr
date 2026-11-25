import type { Metadata } from 'next';
import { getDepartements, getGuides, getInfractions } from './permis';
import type { Departement, GuideArticle, Infraction } from './permis';
import { SITE_NAME, absoluteUrl } from './site';

/** Longueur maximale admise pour la balise title complète (suffixe de marque inclus). */
export const TITLE_MAX_LENGTH = 65;
/** Longueur visée pour la balise title complète. */
export const TITLE_TARGET_LENGTH = 60;
export const DESCRIPTION_MIN_LENGTH = 120;
export const DESCRIPTION_MAX_LENGTH = 160;

export const TITLE_SUFFIX = ` | ${SITE_NAME}`;
export const OG_IMAGE_PATH = '/brand/ododex-og.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
const OG_IMAGE_ALT = 'Ododex : simulateur de permis à points et stages de récupération';
const OG_LOCALE = 'fr_FR';

export type PageKind = 'website' | 'article';

export interface PageSeo {
  path: string;
  title: string;
  description: string;
}

/** Titre complet : texte + suffixe de marque (jamais répété). */
export function fullTitle(text: string): string {
  return text.endsWith(TITLE_SUFFIX) ? text : `${text}${TITLE_SUFFIX}`;
}

/**
 * Renvoie le premier candidat dont le titre complet tient dans la longueur visée ;
 * à défaut, le premier qui tient dans la limite ; à défaut, le plus court.
 * On ne tronque jamais : on choisit une variante plus courte.
 */
export function pickTitle(candidates: string[]): string {
  const titles = candidates.map(fullTitle);
  const withinTarget = titles.find((t) => t.length <= TITLE_TARGET_LENGTH);
  if (withinTarget) return withinTarget;
  const withinMax = titles.find((t) => t.length <= TITLE_MAX_LENGTH);
  if (withinMax) return withinMax;
  return [...titles].sort((a, b) => a.length - b.length)[0];
}

/** Premier candidat dont la longueur est dans la fourchette de description ; sinon le premier. */
export function pickDescription(candidates: string[]): string {
  const fitting = candidates.find(
    (d) => d.length >= DESCRIPTION_MIN_LENGTH && d.length <= DESCRIPTION_MAX_LENGTH
  );
  return fitting ?? candidates[0];
}

export function ogImage() {
  return {
    url: absoluteUrl(OG_IMAGE_PATH),
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: OG_IMAGE_ALT
  };
}

/** Métadonnées complètes (canonical, Open Graph et Twitter avec image) pour une page. */
export function buildMetadata(seo: PageSeo, kind: PageKind = 'website'): Metadata {
  const image = ogImage();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: absoluteUrl(seo.path) },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrl(seo.path),
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      type: kind,
      images: [image]
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [image.url]
    }
  };
}

export function homeSeo(): PageSeo {
  return {
    path: '/',
    title: pickTitle([
      'Permis à points 2026 : simulateur de retrait et stages',
      'Permis à points 2026 : simulateur et stages'
    ]),
    description:
      'Simulez la perte de points de votre permis selon le barème 2026, calculez vos amendes et le délai de récupération, puis trouvez un stage agréé (+4 points).'
  };
}

export function infractionsSeo(): PageSeo {
  return {
    path: '/infractions',
    title: pickTitle(['Barème des infractions et retrait de points 2026']),
    description:
      'Liste des infractions au Code de la route : points retirés (de 0 à 6), amendes forfaitaire, minorée et majorée, classe de contravention et peines encourues.'
  };
}

function infractionPointsLabel(points: number): string {
  if (points === 0) return 'aucun retrait de point';
  return points === 1 ? 'retrait de 1 point' : `retrait de ${points} points`;
}

export function infractionSeo(infraction: Infraction): PageSeo {
  const name = infraction.titreSeo ?? infraction.nom;
  const summary = `${infractionPointsLabel(infraction.points)}, amende de ${infraction.amendeForfaitaire} € (${infraction.classe.toLowerCase()})`;
  const tail = 'Délai de reconstitution des points et peines encourues.';
  const shortTail = 'Délai de récupération et peines.';
  return {
    path: `/infraction/${infraction.slug}`,
    title: pickTitle([
      `${name} : amende et retrait de points`,
      `${name} : amende et points`,
      name
    ]),
    description: pickDescription([
      `${infraction.nom} : ${summary}. ${tail}`,
      `${name} : ${summary}. ${tail}`,
      `${name} : ${summary}. ${infraction.article}. ${tail}`,
      `${name} (${infraction.article}) : ${summary}. ${tail}`,
      `${infraction.nom} : ${summary}. ${shortTail}`,
      `${name} : ${summary}. ${shortTail}`
    ])
  };
}

export function stageSeo(dept: Departement): PageSeo {
  const place = `${dept.nom} (${dept.code})`;
  return {
    path: `/stage/${dept.slug}`,
    title: pickTitle([
      `Stage de récupération de points : ${place}`,
      `Stage de points de permis : ${place}`,
      `Stage de points : ${place}`
    ]),
    description: `Stage de récupération de points agréé, département ${place} : +4 points en 2 jours sans examen, dès ${dept.prixMoyenStage} € en moyenne. Réservez en ligne.`
  };
}

export function guideSeo(guide: GuideArticle): PageSeo {
  return {
    path: `/guide/${guide.slug}`,
    title: pickTitle([guide.titreSeo ?? guide.titre]),
    description: guide.description
  };
}

export const LEGAL_PAGES_SEO: Record<'mentionsLegales' | 'confidentialite' | 'cookies', PageSeo> = {
  mentionsLegales: {
    path: '/mentions-legales',
    title: pickTitle(['Mentions légales']),
    description: `Mentions légales du site ${SITE_NAME} : éditeur, hébergeur, sources des données du Code de la route, limites de responsabilité et absence d'affiliation à l'État.`
  },
  confidentialite: {
    path: '/confidentialite',
    title: pickTitle(['Politique de confidentialité']),
    description: `Politique de confidentialité du site ${SITE_NAME} : données personnelles traitées, finalités du traitement, droits RGPD et possibilité de saisir la CNIL.`
  },
  cookies: {
    path: '/cookies',
    title: pickTitle(['Politique relative aux cookies']),
    description: `Politique relative aux cookies du site ${SITE_NAME} : cookies et stockage local utilisés, publicité Google AdSense et informations pour gérer vos préférences.`
  }
};

/** Toutes les pages générées du site, avec leur titre et leur description. */
export function getAllPagesSeo(): PageSeo[] {
  return [
    homeSeo(),
    infractionsSeo(),
    ...Object.values(LEGAL_PAGES_SEO),
    ...getInfractions().map(infractionSeo),
    ...getDepartements().map(stageSeo),
    ...getGuides().map(guideSeo)
  ];
}
