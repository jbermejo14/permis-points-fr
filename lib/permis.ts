import infractionsData from '../data/infractions.json';
import departementsData from '../data/departements.json';
import guidesData from '../data/guides.json';

export type CategorieInfraction =
  | 'vitesse'
  | 'telephone-distraction'
  | 'priorites-feux'
  | 'alcool-stupefiants'
  | 'ceinture-securite-equipement'
  | 'lignes-depassement-voies';

export interface Infraction {
  id: string;
  slug: string;
  nom: string;
  /** Variante courte du nom, utilisée dans les titres de page quand `nom` est trop long. */
  titreSeo?: string;
  categorie: CategorieInfraction;
  points: number;
  amendeForfaitaire: number;
  amendeMinoree: number;
  amendeMajoree: number;
  classe: string;
  delaiRecuperationMois: number;
  description: string;
  peineComplementaire: string;
  article: string;
}

export interface Departement {
  code: string;
  nom: string;
  region: string;
  slug: string;
  chefLieu: string;
  villesPrincipales: string[];
  prixMoyenStage: number;
  nbCentresEstimes: number;
  prefecture: string;
}

export interface GuideArticle {
  slug: string;
  titre: string;
  /** Variante courte du titre, utilisée dans la balise title. */
  titreSeo?: string;
  description: string;
  tempsLecture: string;
  chapitres: { titre: string; contenu: string }[];
}

export type TypePermis = 'classique' | 'probatoire-1' | 'probatoire-2' | 'probatoire-3';

export interface SimulationParams {
  permisType: TypePermis;
  soldeActuel: number;
  infractionsIds: string[];
}

export interface SimulationResult {
  soldeActuel: number;
  pointsBruts: number;
  pointsRetires: number;
  plafondDepasse: boolean;
  nouveauSolde: number;
  soldeApresStage: number;
  totalAmendeMinoree: number;
  totalAmendeForfaitaire: number;
  totalAmendeMajoree: number;
  delaiRecuperationMois: number;
  delaiLibelle: string;
  niveauAlerte: 'stable' | 'alerte' | 'critique' | 'invalide';
  titreDiagnostic: string;
  diagnostic: string;
  stageRecommande: boolean;
  stageObligatoire48N: boolean;
  motif48N?: string;
  infractionsSelectionnees: Infraction[];
}

export const CATEGORIES_LABELS: Record<CategorieInfraction, string> = {
  vitesse: 'Excès de vitesse',
  'telephone-distraction': 'Téléphone & Distractions',
  'priorites-feux': 'Feux, Stop & Priorités',
  'alcool-stupefiants': 'Alcool & Stupéfiants',
  'ceinture-securite-equipement': 'Ceinture, Casque & Sécurité',
  'lignes-depassement-voies': 'Lignes, Dépassement & Voies'
};

export function getInfractions(): Infraction[] {
  return infractionsData as Infraction[];
}

export function getInfractionBySlug(slug: string): Infraction | undefined {
  return getInfractions().find((i) => i.slug === slug);
}

export function getInfractionById(id: string): Infraction | undefined {
  return getInfractions().find((i) => i.id === id);
}

export function getDepartements(): Departement[] {
  return departementsData as Departement[];
}

export function getDepartementBySlug(slug: string): Departement | undefined {
  return getDepartements().find((d) => d.slug === slug);
}

export function getDepartementByCode(code: string): Departement | undefined {
  return getDepartements().find((d) => d.code === code.padStart(2, '0') || d.code === code);
}

export function getGuides(): GuideArticle[] {
  return guidesData as GuideArticle[];
}

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return getGuides().find((g) => g.slug === slug);
}

export function getMaxPointsForPermis(type: TypePermis): number {
  switch (type) {
    case 'probatoire-1':
      return 6;
    case 'probatoire-2':
      return 8;
    case 'probatoire-3':
      return 10;
    case 'classique':
    default:
      return 12;
  }
}

/**
 * Calcule la perte de points, le montant des amendes et le diagnostic
 * selon les règles du Code de la route 2026.
 */
export function calculateSimulation(params: SimulationParams): SimulationResult {
  const maxPointsPermis = getMaxPointsForPermis(params.permisType);
  const soldeActuel = Math.max(0, Math.min(maxPointsPermis, params.soldeActuel));

  const infractions = params.infractionsIds
    .map((id) => getInfractionById(id))
    .filter((i): i is Infraction => i !== undefined);

  // Somme brute des points
  const pointsBruts = infractions.reduce((acc, curr) => acc + curr.points, 0);

  // Règle d'or légale : Article L223-2 du Code de la route
  // "Dans le cas où plusieurs infractions sont commises simultanément, il ne peut être retiré plus de 8 points"
  const plafondDepasse = pointsBruts > 8;
  const pointsRetires = Math.min(8, pointsBruts);

  const nouveauSolde = Math.max(0, soldeActuel - pointsRetires);

  // Calcul du solde potentiel après réalisation d'un stage de sensibilisation (+4 points)
  const soldeApresStage = Math.min(maxPointsPermis, nouveauSolde + 4);

  // Sommes financières des amendes
  const totalAmendeMinoree = infractions.reduce((acc, curr) => acc + curr.amendeMinoree, 0);
  const totalAmendeForfaitaire = infractions.reduce((acc, curr) => acc + curr.amendeForfaitaire, 0);
  const totalAmendeMajoree = infractions.reduce((acc, curr) => acc + curr.amendeMajoree, 0);

  // Délai de reconstitution automatique sans infraction
  let delaiRecuperationMois = 0;
  let delaiLibelle = 'Aucune perte de point';

  if (pointsRetires > 0) {
    if (pointsRetires === 1 && infractions.length === 1) {
      delaiRecuperationMois = 6;
      delaiLibelle = '6 mois sans aucune infraction (Article L223-6 al. 1)';
    } else {
      // Le délai dépend de la classe des seules infractions qui retirent des points
      const hasSevere = infractions.some(
        (inf) =>
          inf.points > 0 &&
          (inf.classe.includes('4e') || inf.classe.includes('5e') || inf.classe.toLowerCase().includes('délit'))
      );
      if (hasSevere) {
        delaiRecuperationMois = 36;
        delaiLibelle = '3 ans sans aucune infraction (infraction de 4e classe ou plus grave, ou délit)';
      } else {
        delaiRecuperationMois = 24;
        delaiLibelle = '2 ans sans aucune infraction (infr. 2e ou 3e classe)';
      }
    }
  }

  // Vérification obligation Lettre 48N pour permis probatoire
  const isProbatoire = params.permisType.startsWith('probatoire');
  const hasInfraction3PointsOuPlus = infractions.some((inf) => inf.points >= 3);
  const stageObligatoire48N = isProbatoire && hasInfraction3PointsOuPlus;
  const motif48N = stageObligatoire48N
    ? "En période probatoire, toute infraction entraînant la perte d'au moins 3 points rend le stage obligatoire (Lettre 48N reçue par recommandé sous 4 mois). Le stage permet de vous faire rembourser l'amende par le Trésor Public."
    : undefined;

  // Diagnostic et niveau d'alerte
  let niveauAlerte: 'stable' | 'alerte' | 'critique' | 'invalide' = 'stable';
  let titreDiagnostic = 'Situation normale';
  let diagnostic =
    'Votre solde de points reste confortable. Respectez le Code de la route pour permettre la réattribution automatique de vos points.';
  let stageRecommande = false;

  if (nouveauSolde === 0) {
    niveauAlerte = 'invalide';
    titreDiagnostic = 'Alerte maximale : Risque immédiat d\'invalidation (0 point)';
    diagnostic =
      'Votre solde tombe à 0 point. Dès réception de la lettre 48SI, votre permis sera invalidé avec interdiction de conduire pendant 6 mois. ASTUCE LÉGALE : Si vous n\'avez pas encore payé l\'amende, le retrait de points n\'est pas encore enregistré. Vous pouvez immédiatement vous inscrire à un stage de récupération (+4 points) avant que le débit ne prenne effet !';
    stageRecommande = true;
  } else if (nouveauSolde <= 3) {
    niveauAlerte = 'critique';
    titreDiagnostic = 'Zone rouge : Danger immédiat d\'annulation de permis';
    diagnostic = `Il ne vous reste que ${nouveauSolde} point${
      nouveauSolde > 1 ? 's' : ''
    }. La moindre infraction mineure peut vous faire perdre votre droit de conduire. Effectuer un stage de récupération (+4 points) est urgent pour sécuriser votre permis.`;
    stageRecommande = true;
  } else if (nouveauSolde <= 6) {
    niveauAlerte = 'alerte';
    titreDiagnostic = 'Zone orange : Solde vulnérable (lettre 48M)';
    diagnostic = `Votre solde descend à ${nouveauSolde} points. Le Ministère de l'Intérieur vous adressera une lettre 48M recommandée d'avertissement. Un stage est fortement recommandé si vous utilisez votre véhicule au quotidien.`;
    stageRecommande = true;
  } else if (stageObligatoire48N) {
    niveauAlerte = 'alerte';
    titreDiagnostic = 'Stage obligatoire en période probatoire (Lettre 48N)';
    diagnostic = motif48N!;
    stageRecommande = true;
  }

  return {
    soldeActuel,
    pointsBruts,
    pointsRetires,
    plafondDepasse,
    nouveauSolde,
    soldeApresStage,
    totalAmendeMinoree,
    totalAmendeForfaitaire,
    totalAmendeMajoree,
    delaiRecuperationMois,
    delaiLibelle,
    niveauAlerte,
    titreDiagnostic,
    diagnostic,
    stageRecommande,
    stageObligatoire48N,
    motif48N,
    infractionsSelectionnees: infractions
  };
}
