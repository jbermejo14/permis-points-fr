import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Calendar, Clock, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { Departement } from '@/lib/permis';

interface StageCtaCardProps {
  departement?: Departement;
  urgencyLevel?: 'normal' | 'critique' | 'invalide';
}

export function StageCtaCard({ departement, urgencyLevel = 'normal' }: StageCtaCardProps) {
  const deptNom = departement ? `${departement.code} - ${departement.nom}` : 'dans votre département';
  const prix = departement ? departement.prixMoyenStage : 185;
  const centres = departement ? departement.nbCentresEstimes : 24;

  const isUrgent = urgencyLevel === 'critique' || urgencyLevel === 'invalide';

  return (
    <div
      className={`rounded-2xl p-6 border transition-all ${
        isUrgent
          ? 'bg-negative-soft border-negative-line shadow-lg'
          : 'bg-gradient-to-br from-accent/5 via-surface to-accent/10 border-accent-line/40 shadow-sm'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                isUrgent ? 'bg-negative text-white' : 'bg-accent text-white'
              }`}
            >
              {isUrgent ? 'Urgence Permis en Danger' : 'Agrément Préfecture'}
            </span>
            <span className="text-xs font-semibold text-secondary flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-positive" />
              +4 points dès le lendemain
            </span>
            <span className="text-xs font-semibold text-secondary flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-positive" />
              Sans examen ni contrôle
            </span>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-extrabold text-fg">
              Stage de récupération de points {deptNom}
            </h3>
            <p className="text-sm text-secondary mt-1 max-w-2xl leading-relaxed">
              Session agréée de 2 jours (14h) animée par un enseignant BAFM et un psychologue agréé. Récupérez 4 points sur votre permis immédiatement après la formation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-secondary" />
              <span>2 jours consécutifs (14 heures)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>Sessions chaque semaine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-secondary" />
              <span>Dès {prix} € · ~{centres} centres agréés</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-end justify-center shrink-0 space-y-2">
          <a
            href={
              departement
                ? `https://ododex.com/fr/permis-points/stage/${departement.slug}`
                : '#stages'
            }
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isUrgent
                ? 'bg-negative hover:bg-negative/90 hover:scale-[1.02]'
                : 'bg-accent hover:bg-accent-hover hover:scale-[1.02]'
            }`}
          >
            <span>Réserver une session {departement ? `(${departement.code})` : ''}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <span className="text-[11px] text-muted text-center sm:text-right">
            Paiement 100% sécurisé · Attestation remise en fin de stage
          </span>
        </div>
      </div>
    </div>
  );
}
