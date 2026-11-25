# Permis à Points & Stages France 2026 — Ododex (`/fr/permis-points`)

Simulateur de perte de points et barème des amendes du Code de la route 2026, calculateur de reconstitution automatique et annuaire des stages de récupération de points agréés (+4 points) dans les 101 départements français.

- **URL en production** : [https://ododex.com/fr/permis-points](https://ododex.com/fr/permis-points)
- **Worker Cloudflare** : `ododex-permis-points`
- **Portail parent** : [Ododex](https://ododex.com/fr/)

---

## 🎯 Fonctionnalités Clés

1. **Simulateur de Perte de Points & Amendes 2026** :
   - Prise en charge des permis classiques (12 points) et probatoires (6, 8, 10 points pour jeunes conducteurs).
   - Application de la réforme 2024-2026 : **0 point** pour les excès de vitesse de moins de 5 km/h.
   - Application stricte de la règle d'or légale : **plafond de 8 points maximum retirés** en un seul contrôle pour infractions simultanées (*Art. L223-2 du Code de la route*).
   - Décomposition financière immédiate de l'amende : minorée (15 jours), forfaitaire (45 jours) et majorée.
2. **Calculateur de Délais de Récupération Automatique** :
   - 6 mois pour 1 point unique sans récidive.
   - 2 ans pour contraventions de 2e et 3e classe.
   - 3 ans pour contraventions de 4e et 5e classe ou délits.
   - Règle de reconstitution décennale (10 ans).
3. **Alertes Administratives Clés** :
   - **Lettre 48N** : Alerte pour jeunes conducteurs avec perte $\ge 3$ points (obligation de stage sous 4 mois avec remboursement de l'amende).
   - **Lettre 48SI** : Alerte rouge invalidation (solde à 0 point) et méthode légale pour sauver son permis en réservant un stage avant l'enregistrement de l'amende.
4. **Monétisation de Haut Ticket** :
   - 101 fiches départementales (`/stage/[departement]`) orientées vers la réservation de stages de sensibilisation à la sécurité routière (+4 points en 48h sans examen).
   - Affiliation avec les plateformes de réservation (*LegiPermis, Permisapoints, ActiRoute*), offrant **20 € à 45 € de commission nette par vente**.

---

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router) en export statique.
- **Pages générées** : 142 pages statiques SSG pré-compilées (Home, /infractions, 28 fiches d'infraction, 101 départements, 4 guides et pages légales).
- **SEO** : Schema.org `FAQPage` et `BreadcrumbList`.

---

## 🚀 Développement Local & Tests

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Exécuter les 8 tests unitaires
npm test

# Compiler l'export statique
npm run build
```
