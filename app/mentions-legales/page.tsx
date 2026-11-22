import React from 'react';
import { LegalPage } from '@/components/LegalPage';
import { getTitular, type Titular } from '@/lib/legal';
import { legalHolderValue, legalMetadata } from '@/lib/legal-text';
import { SITE_NAME } from '@/lib/site';

const PATH = '/mentions-legales';
const URL_CLOUDFLARE = 'https://www.cloudflare.com';
const URL_LEGIFRANCE = 'https://www.legifrance.gouv.fr';

export const metadata = legalMetadata(
  PATH,
  'Mentions légales',
  `Mentions légales de ${SITE_NAME} : éditeur, hébergeur, sources des données du Code de la route et limites de responsabilité.`
);

export default function MentionsLegalesPage() {
  const holder = getTitular();
  const field = (name: keyof Titular) => legalHolderValue(holder, name);

  return (
    <LegalPage title="Mentions légales" path={PATH}>
      <h2 className="text-base font-bold text-fg">Éditeur du site</h2>
      <p>
        Conformément à l&apos;article 6 III de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN), ce site est édité par :
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Nom : {field('nombre')}</li>
        <li>Numéro d&apos;identification fiscale (NIF, Espagne) : {field('nif')}</li>
        <li>Adresse : {field('domicilio')}</li>
        <li>Adresse e-mail de contact : {field('email')}</li>
        {holder.tipo === 'empresa' && <li>Immatriculation au registre du commerce : {field('registroMercantil')}</li>}
      </ul>

      <h2 className="text-base font-bold text-fg">Directeur de la publication</h2>
      <p>Le directeur de la publication est l&apos;éditeur du site : {field('nombre')}.</p>

      <h2 className="text-base font-bold text-fg">Hébergeur</h2>
      <p>
        Le site est hébergé par Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis (<a href={URL_CLOUDFLARE} target="_blank" rel="noopener noreferrer" className="text-accent underline">cloudflare.com</a>).
      </p>

      <h2 className="text-base font-bold text-fg">Objet du site et indépendance</h2>
      <p>
        Ce site propose à titre informatif et gratuit un simulateur de perte de points, un guide des amendes et un annuaire indicatif des stages de sensibilisation à la sécurité routière en France.
      </p>
      <p>
        Le site est un service citoyen indépendant et n&apos;est rattaché ni au Ministère de l&apos;Intérieur, ni à la Délégation à la Sécurité Routière (DSR), ni à l&apos;Agence Nationale de Traitement Automatisé des Infractions (ANTAI). Pour toute consultation de solde officiel ou contestation, les usagers doivent s&apos;adresser aux téléservices officiels de l&apos;État (MesPointsPermis ou ANTAI).
      </p>

      <h2 className="text-base font-bold text-fg">Origine des données</h2>
      <p>
        Les règles relatives aux infractions, aux classes de contravention et aux barèmes de points sont issues des textes législatifs et réglementaires du Code de la route publiés au Journal Officiel de la République Française et accessibles sur Légifrance (<a href={URL_LEGIFRANCE} target="_blank" rel="noopener noreferrer" className="text-accent underline">legifrance.gouv.fr</a>).
      </p>

      <h2 className="text-base font-bold text-fg">Propriété intellectuelle</h2>
      <p>
        Les marques, logos, graphismes, logiciels, interfaces et contenus éditoriaux figurant sur le site sont protégés par le droit de la propriété intellectuelle. Toute reproduction sans autorisation préalable est prohibée.
      </p>
    </LegalPage>
  );
}
