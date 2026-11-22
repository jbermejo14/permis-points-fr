'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, ShieldAlert } from 'lucide-react';
import {
  Infraction,
  CategorieInfraction,
  CATEGORIES_LABELS,
  getInfractions
} from '@/lib/permis';

interface InfractionsTableProps {
  initialInfractions?: Infraction[];
  categoryFilter?: CategorieInfraction;
}

export function InfractionsTable({
  initialInfractions,
  categoryFilter
}: InfractionsTableProps) {
  const infractions = initialInfractions || getInfractions();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryFilter || 'all'
  );

  const filtered = useMemo(() => {
    return infractions.filter((inf) => {
      const matchCat =
        selectedCategory === 'all' || inf.categorie === selectedCategory;
      const matchSearch =
        search === '' ||
        inf.nom.toLowerCase().includes(search.toLowerCase()) ||
        inf.description.toLowerCase().includes(search.toLowerCase()) ||
        inf.article.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [infractions, selectedCategory, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrer les infractions (ex: feu rouge, vitesse, alcool, téléphone)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-line bg-input text-xs sm:text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>

        {!categoryFilter && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-line bg-surface text-xs font-semibold text-fg focus:border-accent focus:outline-none"
          >
            <option value="all">Toutes les catégories ({infractions.length})</option>
            {Object.entries(CATEGORIES_LABELS).map(([cat, label]) => (
              <option key={cat} value={cat}>
                {label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="table-responsive rounded-xl border border-line bg-surface overflow-hidden shadow-sm">
        <table className="guide-table">
          <thead>
            <tr>
              <th className="w-1/2 sm:w-2/5">Infraction & Article</th>
              <th className="text-center">Points retirés</th>
              <th>Amende forfaitaire</th>
              <th>Classe</th>
              <th className="text-right">Détail</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inf) => {
              const isZero = inf.points === 0;
              return (
                <tr key={inf.id} className="hover:bg-elevated/40 transition-colors">
                  <td>
                    <Link
                      href={`/infraction/${inf.slug}`}
                      className="font-bold text-xs sm:text-sm text-fg hover:text-accent flex items-center gap-1.5"
                    >
                      <span>{inf.nom}</span>
                    </Link>
                    <span className="text-[11px] text-muted block mt-0.5">
                      {inf.article}
                    </span>
                  </td>
                  <td className="text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-xs font-extrabold ${
                        isZero
                          ? 'bg-positive/10 text-positive border border-positive/30'
                          : inf.points >= 4
                          ? 'bg-negative/10 text-negative border border-negative/30'
                          : 'bg-warning/10 text-warning border border-warning/30'
                      }`}
                    >
                      {isZero ? '0 point (2026)' : `-${inf.points} pt${inf.points > 1 ? 's' : ''}`}
                    </span>
                  </td>
                  <td>
                    <div className="text-xs font-bold text-fg">
                      {inf.amendeForfaitaire} €
                    </div>
                    <div className="text-[10px] text-muted">
                      Minorée : {inf.amendeMinoree} € · Maj. : {inf.amendeMajoree} €
                    </div>
                  </td>
                  <td>
                    <span className="text-xs text-secondary">{inf.classe}</span>
                  </td>
                  <td className="text-right">
                    <Link
                      href={`/infraction/${inf.slug}`}
                      className="p-1.5 rounded-lg text-secondary hover:text-accent hover:bg-elevated transition-colors inline-block"
                      title="Voir la fiche détaillée"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-secondary text-xs">
          Aucune infraction ne correspond à vos critères de recherche.
        </div>
      )}
    </div>
  );
}
