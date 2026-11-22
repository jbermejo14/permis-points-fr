import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSimulation,
  getInfractions,
  getInfractionBySlug,
  getDepartements,
  getDepartementByCode,
  getGuides
} from '../lib/permis';

describe('Permis à Points Logic & Legal Calculations 2026', () => {
  it('charges properly all official infractions and departments', () => {
    const infractions = getInfractions();
    assert.ok(infractions.length >= 20, 'Should have at least 20 infractions');

    const depts = getDepartements();
    assert.strictEqual(depts.length, 101, 'Should have 101 French departments');

    const guides = getGuides();
    assert.strictEqual(guides.length, 4, 'Should have 4 guide articles');
  });

  it('validates 2026 legal reform: speed excess < 5 km/h withdraws 0 points', () => {
    const res = calculateSimulation({
      permisType: 'classique',
      soldeActuel: 12,
      infractionsIds: ['exces-vitesse-moins-5-kmh']
    });

    assert.strictEqual(res.pointsRetires, 0);
    assert.strictEqual(res.nouveauSolde, 12);
    assert.strictEqual(res.totalAmendeForfaitaire, 68);
    assert.strictEqual(res.delaiRecuperationMois, 0);
  });

  it('calculates 6-month recovery for a single 1-point infraction', () => {
    const res = calculateSimulation({
      permisType: 'classique',
      soldeActuel: 12,
      infractionsIds: ['exces-vitesse-5-a-19-kmh-hors-agglo']
    });

    assert.strictEqual(res.pointsRetires, 1);
    assert.strictEqual(res.nouveauSolde, 11);
    assert.strictEqual(res.delaiRecuperationMois, 6);
  });

  it('enforces the legal maximum of 8 points for simultaneous infractions (Art. L223-2)', () => {
    // Alcool (6 pts) + Feu rouge (4 pts) = 10 pts bruts, but capped at 8 pts
    const res = calculateSimulation({
      permisType: 'classique',
      soldeActuel: 12,
      infractionsIds: ['alcool-contraventionnel-0-5-a-0-79', 'feu-rouge-grille']
    });

    assert.strictEqual(res.pointsBruts, 10);
    assert.strictEqual(res.pointsRetires, 8);
    assert.strictEqual(res.plafondDepasse, true);
    assert.strictEqual(res.nouveauSolde, 4);
    assert.strictEqual(res.totalAmendeForfaitaire, 135 + 135);
    assert.strictEqual(res.delaiRecuperationMois, 36);
  });

  it('triggers Lettre 48N obligation for young driver with >= 3 points loss', () => {
    const res = calculateSimulation({
      permisType: 'probatoire-1',
      soldeActuel: 6,
      infractionsIds: ['telephone-tenu-en-main'] // 3 points
    });

    assert.strictEqual(res.pointsRetires, 3);
    assert.strictEqual(res.nouveauSolde, 3);
    assert.strictEqual(res.stageObligatoire48N, true);
    assert.strictEqual(res.niveauAlerte, 'critique');
    assert.ok(res.motif48N?.includes('Lettre 48N'));
  });

  it('handles invalidation risk when balance reaches 0', () => {
    const res = calculateSimulation({
      permisType: 'classique',
      soldeActuel: 4,
      infractionsIds: ['feu-rouge-grille'] // 4 points
    });

    assert.strictEqual(res.nouveauSolde, 0);
    assert.strictEqual(res.niveauAlerte, 'invalide');
    assert.strictEqual(res.stageRecommande, true);
    assert.ok(res.titreDiagnostic.includes('invalidation'));
  });

  it('finds departments by code and slug', () => {
    const paris = getDepartementByCode('75');
    assert.ok(paris);
    assert.strictEqual(paris.nom, 'Paris');
    assert.strictEqual(paris.region, 'Île-de-France');

    const rhone = getDepartementByCode('69');
    assert.ok(rhone);
    assert.strictEqual(rhone.nom, 'Rhône');
  });

  it('finds infractions by slug', () => {
    const phone = getInfractionBySlug('telephone-au-volant-tenu-en-main');
    assert.ok(phone);
    assert.strictEqual(phone.points, 3);
    assert.strictEqual(phone.amendeForfaitaire, 135);
  });
});
