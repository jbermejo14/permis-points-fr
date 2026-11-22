'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  Euro,
  Award,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  TypePermis,
  CategorieInfraction,
  CATEGORIES_LABELS,
  getInfractions,
  getDepartements,
  calculateSimulation,
  getMaxPointsForPermis
} from '@/lib/permis';

export function PointsSimulator() {
  const allInfractions = useMemo(() => getInfractions(), []);
  const allDepartements = useMemo(() => getDepartements(), []);

  // State
  const [permisType, setPermisType] = useState<TypePermis>('classique');
  const [soldeActuel, setSoldeActuel] = useState<number>(12);
  const [selectedInfractionIds, setSelectedInfractionIds] = useState<string[]>([
    'telephone-tenu-en-main'
  ]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDeptCode, setSelectedDeptCode] = useState<string>('75');

  // Ajustement du solde actuel si on bascule sur un permis avec un plafond inférieur
  const handlePermisTypeChange = (newType: TypePermis) => {
    setPermisType(newType);
    const max = getMaxPointsForPermis(newType);
    if (soldeActuel > max) {
      setSoldeActuel(max);
    }
  };

  const toggleInfraction = (id: string) => {
    setSelectedInfractionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredInfractions = useMemo(() => {
    return allInfractions.filter((inf) => {
      const matchesCategory =
        activeCategory === 'all' || inf.categorie === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        inf.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inf.article.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allInfractions, activeCategory, searchQuery]);

  const simulation = useMemo(() => {
    return calculateSimulation({
      permisType,
      soldeActuel,
      infractionsIds: selectedInfractionIds
    });
  }, [permisType, soldeActuel, selectedInfractionIds]);

  const maxPointsPermis = getMaxPointsForPermis(permisType);

  const selectedDept = useMemo(() => {
    return allDepartements.find((d) => d.code === selectedDeptCode) || allDepartements[0];
  }, [allDepartements, selectedDeptCode]);

  // Détermination de la couleur du statut
  const alertStyles = useMemo(() => {
    switch (simulation.niveauAlerte) {
      case 'invalide':
        return {
          bg: 'bg-negative-soft',
          border: 'border-negative-line',
          badgeBg: 'bg-negative',
          text: 'text-negative',
          icon: XCircle
        };
      case 'critique':
        return {
          bg: 'bg-negative-soft',
          border: 'border-negative-line',
          badgeBg: 'bg-negative',
          text: 'text-negative',
          icon: AlertTriangle
        };
      case 'alerte':
        return {
          bg: 'bg-warning-soft',
          border: 'border-warning-line',
          badgeBg: 'bg-warning',
          text: 'text-warning',
          icon: AlertTriangle
        };
      case 'stable':
      default:
        return {
          bg: 'bg-positive-soft',
          border: 'border-positive-line',
          badgeBg: 'bg-positive',
          text: 'text-positive',
          icon: ShieldCheck
        };
    }
  }, [simulation.niveauAlerte]);

  const AlertIcon = alertStyles.icon;

  return (
    <div id="simulateur" className="space-y-8">
      {/* Sélecteur de Permis & Solde de départ */}
      <div className="card space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-fg">
            1. Choisissez votre type de permis et vos points actuels
          </h2>
          <p className="text-sm text-secondary mt-1">
            Indiquez votre capital officiel avant l’infraction pour calculer avec précision le risque d’invalidation.
          </p>
        </div>

        {/* Boutons de type de permis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => handlePermisTypeChange('classique')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              permisType === 'classique'
                ? 'border-accent bg-accent/5 ring-1 ring-accent'
                : 'border-line hover:border-line-hover bg-surface'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-fg">Permis Classique</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-elevated text-secondary">
                12 pts
              </span>
            </div>
            <p className="text-xs text-muted mt-1">Conducteur confirmé (plus de 3 ans de permis)</p>
          </button>

          <button
            type="button"
            onClick={() => handlePermisTypeChange('probatoire-1')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              permisType === 'probatoire-1'
                ? 'border-accent bg-accent/5 ring-1 ring-accent'
                : 'border-line hover:border-line-hover bg-surface'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-fg">Probatoire 1ère année</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-elevated text-secondary">
                6 pts
              </span>
            </div>
            <p className="text-xs text-muted mt-1">Jeune conducteur débutant (capital initial)</p>
          </button>

          <button
            type="button"
            onClick={() => handlePermisTypeChange('probatoire-2')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              permisType === 'probatoire-2'
                ? 'border-accent bg-accent/5 ring-1 ring-accent'
                : 'border-line hover:border-line-hover bg-surface'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-fg">Probatoire 2e année</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-elevated text-secondary">
                8 pts
              </span>
            </div>
            <p className="text-xs text-muted mt-1">Après 1 an sans infraction (+2 pts)</p>
          </button>

          <button
            type="button"
            onClick={() => handlePermisTypeChange('probatoire-3')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              permisType === 'probatoire-3'
                ? 'border-accent bg-accent/5 ring-1 ring-accent'
                : 'border-line hover:border-line-hover bg-surface'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-fg">Probatoire 3e année</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-elevated text-secondary">
                10 pts
              </span>
            </div>
            <p className="text-xs text-muted mt-1">Après 2 ans sans infraction (+4 pts)</p>
          </button>
        </div>

        {/* Curseur et boutons de solde actuel */}
        <div className="pt-4 border-t border-line space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="solde-range" className="text-sm font-semibold text-fg">
              Votre solde de points actuel avant infraction :
            </label>
            <span className="px-3 py-1 rounded-lg bg-elevated font-extrabold text-base text-accent border border-line">
              {soldeActuel} / {maxPointsPermis} points
            </span>
          </div>

          <input
            id="solde-range"
            type="range"
            min="0"
            max={maxPointsPermis}
            value={soldeActuel}
            onChange={(e) => setSoldeActuel(parseInt(e.target.value, 10))}
            className="w-full accent-accent cursor-pointer"
          />

          <div className="flex flex-wrap gap-1.5 justify-between">
            {Array.from({ length: maxPointsPermis + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSoldeActuel(i)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all ${
                  soldeActuel === i
                    ? 'bg-accent text-white shadow-sm scale-110'
                    : 'bg-elevated text-secondary hover:text-fg hover:bg-surface'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sélection des infractions */}
      <div className="card space-y-5">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-fg">
                2. Sélectionnez l’infraction ou les infractions commises
              </h2>
              <p className="text-sm text-secondary mt-1">
                Vous pouvez cocher plusieurs infractions. Le barème légal plafonne le retrait à{' '}
                <strong className="text-fg">8 points maximum</strong> en cas de cumul simultané.
              </p>
            </div>

            {selectedInfractionIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedInfractionIds([])}
                className="text-xs text-negative hover:underline font-semibold self-start sm:self-auto"
              >
                Tout désélectionner ({selectedInfractionIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Barre de recherche et filtres de catégorie */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une infraction (ex. feu rouge, téléphone, 20 km/h, stop, alcool)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-input text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-fg text-bg'
                  : 'bg-elevated text-secondary hover:text-fg'
              }`}
            >
              Toutes les infractions ({allInfractions.length})
            </button>
            {Object.entries(CATEGORIES_LABELS).map(([cat, label]) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-fg text-bg'
                    : 'bg-elevated text-secondary hover:text-fg'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des cartes d'infractions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
          {filteredInfractions.map((inf) => {
            const isSelected = selectedInfractionIds.includes(inf.id);
            const isZeroPoint = inf.points === 0;

            return (
              <div
                key={inf.id}
                onClick={() => toggleInfraction(inf.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                  isSelected
                    ? 'border-accent bg-accent/5 ring-1 ring-accent'
                    : 'border-line hover:border-line-hover bg-surface'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}} // géré par le parent onClick
                  className="mt-1 w-4 h-4 rounded text-accent accent-accent cursor-pointer shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-fg line-clamp-1">
                      {inf.nom}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-extrabold shrink-0 ${
                        isZeroPoint
                          ? 'bg-positive/10 text-positive border border-positive/30'
                          : inf.points >= 4
                          ? 'bg-negative/10 text-negative border border-negative/30'
                          : 'bg-warning/10 text-warning border border-warning/30'
                      }`}
                    >
                      {isZeroPoint ? '0 point (2026)' : `-${inf.points} pt${inf.points > 1 ? 's' : ''}`}
                    </span>
                  </div>

                  <p className="text-xs text-muted line-clamp-2 mt-1 leading-relaxed">
                    {inf.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
                    <span className="text-secondary font-medium">
                      Amende : <strong>{inf.amendeForfaitaire} €</strong>
                    </span>
                    <span className="text-line font-light">·</span>
                    <span className="text-muted">{inf.classe}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredInfractions.length === 0 && (
          <div className="text-center py-8 text-secondary text-sm">
            Aucune infraction trouvée pour cette recherche.
          </div>
        )}
      </div>

      {/* RÉSULTAT DU CALCULATEUR */}
      <div className="card space-y-6 border-accent/40 bg-surface shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider block">
              Diagnostic officiel personnalisé
            </span>
            <h2 className="text-2xl font-extrabold text-fg mt-0.5">
              Résultat de votre simulation 2026
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold text-white uppercase tracking-wider ${alertStyles.badgeBg}`}
            >
              {simulation.niveauAlerte}
            </span>
          </div>
        </div>

        {/* ALERTE PLAFOND LÉGAL DE 8 POINTS */}
        {simulation.plafondDepasse && (
          <div className="p-3.5 rounded-xl border border-warning-line bg-warning-soft flex items-start gap-3">
            <Info className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-xs text-secondary leading-relaxed">
              <strong className="text-fg">Plafond légal appliqué (Art. L223-2) :</strong> Le cumul
              théorique de vos infractions atteint {simulation.pointsBruts} points. Selon le Code de la
              route, le retrait maximal est strictement plafonné à <strong>8 points</strong> en un seul
              contrôle.
            </div>
          </div>
        )}

        {/* ALERTE LETTRE 48N EN PÉRIODE PROBATOIRE */}
        {simulation.stageObligatoire48N && (
          <div className="p-3.5 rounded-xl border border-negative-line bg-negative-soft flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-negative shrink-0 mt-0.5" />
            <div className="text-xs text-secondary leading-relaxed">
              <strong className="text-fg">Obligation légale de stage (Lettre 48N) :</strong> En tant que
              jeune conducteur en période probatoire, perdre 3 points ou plus vous impose de suivre un
              stage de sensibilisation sous 4 mois après réception du recommandé. Ce stage vous permet de
              récupérer 4 points et de demander le remboursement de l'amende au Trésor Public.
            </div>
          </div>
        )}

        {/* GRILLE DES 3 INDICATEURS CLÉS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nouveau solde */}
          <div className="p-4 rounded-xl border border-line bg-elevated/40 space-y-2">
            <span className="text-xs text-muted block">Points restant sur votre permis</span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-extrabold ${
                  simulation.nouveauSolde === 0
                    ? 'text-negative'
                    : simulation.nouveauSolde <= 3
                    ? 'text-negative'
                    : simulation.nouveauSolde <= 6
                    ? 'text-warning'
                    : 'text-positive'
                }`}
              >
                {simulation.nouveauSolde}
              </span>
              <span className="text-sm text-secondary font-medium">/ {maxPointsPermis} points</span>
            </div>

            {/* Représentation visuelle des points */}
            <div className="flex gap-1 pt-1">
              {Array.from({ length: maxPointsPermis }, (_, i) => {
                const isRetained = i < simulation.nouveauSolde;
                const isLost =
                  i >= simulation.nouveauSolde && i < simulation.soldeActuel;
                const isPotentialWithStage =
                  !isRetained && i < simulation.soldeApresStage;

                return (
                  <div
                    key={i}
                    title={
                      isRetained
                        ? 'Point conservé'
                        : isLost
                        ? 'Point retiré'
                        : 'Point manquant'
                    }
                    className={`h-3 flex-1 rounded-sm transition-all ${
                      isRetained
                        ? simulation.nouveauSolde <= 3
                          ? 'bg-negative'
                          : simulation.nouveauSolde <= 6
                          ? 'bg-warning'
                          : 'bg-positive'
                        : isLost
                        ? 'bg-negative/25 border border-dashed border-negative'
                        : 'bg-line'
                    }`}
                  />
                );
              })}
            </div>

            <p className="text-[11px] text-muted pt-1">
              {simulation.pointsRetires > 0
                ? `Perte de ${simulation.pointsRetires} point${
                    simulation.pointsRetires > 1 ? 's' : ''
                  } sur votre capital initial (${simulation.soldeActuel} pts).`
                : 'Aucun retrait de point pour ces infractions.'}
            </p>
          </div>

          {/* Montant total des amendes */}
          <div className="p-4 rounded-xl border border-line bg-elevated/40 space-y-2">
            <span className="text-xs text-muted block">Montant des amendes exigibles</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-fg">
                {simulation.totalAmendeForfaitaire} €
              </span>
              <span className="text-xs text-secondary font-medium">forfaitaire</span>
            </div>

            <div className="space-y-1 text-xs pt-1 border-t border-line/60">
              <div className="flex justify-between text-positive font-semibold">
                <span>Minorée (payée sous 15j) :</span>
                <span>{simulation.totalAmendeMinoree} €</span>
              </div>
              <div className="flex justify-between text-negative font-medium text-[11px]">
                <span>Majorée (après 45j) :</span>
                <span>{simulation.totalAmendeMajoree} €</span>
              </div>
            </div>
          </div>

          {/* Délai de récupération automatique */}
          <div className="p-4 rounded-xl border border-line bg-elevated/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>Reconstitution automatique</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-fg">
              {simulation.delaiRecuperationMois === 0
                ? 'Immédiat'
                : `${simulation.delaiRecuperationMois} mois`}
            </div>

            <p className="text-xs text-secondary leading-relaxed pt-1 border-t border-line/60">
              {simulation.delaiLibelle}
            </p>
          </div>
        </div>

        {/* DIAGNOSTIC DÉTAILLÉ */}
        <div className={`p-4 rounded-xl border ${alertStyles.bg} ${alertStyles.border} space-y-2`}>
          <div className="flex items-center gap-2">
            <AlertIcon className={`w-5 h-5 ${alertStyles.text} shrink-0`} />
            <h3 className="font-extrabold text-sm md:text-base text-fg">
              {simulation.titreDiagnostic}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-secondary leading-relaxed pl-7">
            {simulation.diagnostic}
          </p>
        </div>

        {/* SIMULATEUR DU STAGE DE RÉCUPÉRATION (+4 POINTS) */}
        <div className="p-5 rounded-2xl border border-accent/40 bg-accent/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  Simulation Stage de Récupération
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-fg">
                Votre capital remonterait à{' '}
                <span className="text-accent underline decoration-2">
                  {simulation.soldeApresStage} / {maxPointsPermis} points
                </span>{' '}
                grâce à un stage (+4 pts)
              </h3>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-muted block">Durée de formation</span>
              <span className="text-sm font-bold text-fg">2 jours sans examen</span>
            </div>
          </div>

          <p className="text-xs text-secondary leading-relaxed">
            Le stage de sensibilisation à la sécurité routière permet d'ajouter immédiatement 4 points à
            votre solde dans la limite de votre plafond ({maxPointsPermis} points). Il est possible d'en
            réaliser un tous les 1 an et 1 jour.
          </p>

          {/* Sélecteur de département pour réserver */}
          <div className="pt-3 border-t border-accent/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <label htmlFor="dept-select" className="text-xs font-bold text-fg block mb-1">
                Trouvez un stage agréé dans votre département :
              </label>
              <select
                id="dept-select"
                value={selectedDeptCode}
                onChange={(e) => setSelectedDeptCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-line bg-surface text-xs font-medium text-fg focus:outline-none focus:border-accent"
              >
                {allDepartements.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.code} - {d.nom} (dès {d.prixMoyenStage} €)
                  </option>
                ))}
              </select>
            </div>

            <Link
              href={`/stage/${selectedDept.slug}`}
              className="px-5 py-2.5 rounded-xl bg-accent text-white font-bold text-xs hover:bg-accent-hover transition-all text-center self-end sm:self-auto shrink-0 shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Voir les sessions en {selectedDept.code} ({selectedDept.nom})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
