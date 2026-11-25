import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  calculateSimulation,
  getDepartements,
  getInfractionById,
  getInfractions
} from '../lib/permis';
import { infractionSeo } from '../lib/seo';
import { DEPARTEMENT_LOCATIVES, getDepartementLocative } from '../lib/departement-articles';

const RECOVERY_ONE_POINT_MONTHS = 6;
const RECOVERY_LIGHT_CLASS_MONTHS = 24;
const RECOVERY_HEAVY_CLASS_MONTHS = 36;
const HEAVY_CLASS = /4e|5e|délit/i;

describe('Plazos de recuperación según la clase', () => {
  it('cada fila de la tabla respeta la regla clase ↔ plazo', () => {
    for (const inf of getInfractions()) {
      if (inf.points === 0) {
        assert.strictEqual(inf.delaiRecuperationMois, 0, inf.id);
      } else if (inf.points === 1) {
        assert.strictEqual(inf.delaiRecuperationMois, RECOVERY_ONE_POINT_MONTHS, inf.id);
      } else if (HEAVY_CLASS.test(inf.classe)) {
        assert.strictEqual(inf.delaiRecuperationMois, RECOVERY_HEAVY_CLASS_MONTHS, inf.id);
      } else {
        assert.strictEqual(inf.delaiRecuperationMois, RECOVERY_LIGHT_CLASS_MONTHS, inf.id);
      }
    }
  });

  it('20-29, 30-39 y 40-49 km/h dan 36 meses en tabla y en simulador', () => {
    for (const id of ['exces-vitesse-20-a-29-kmh', 'exces-vitesse-30-a-39-kmh', 'exces-vitesse-40-a-49-kmh']) {
      assert.strictEqual(getInfractionById(id)?.delaiRecuperationMois, RECOVERY_HEAVY_CLASS_MONTHS, id);
      const res = calculateSimulation({ permisType: 'classique', soldeActuel: 12, infractionsIds: [id] });
      assert.strictEqual(res.delaiRecuperationMois, RECOVERY_HEAVY_CLASS_MONTHS, id);
    }
  });

  it('una infracción de 2e clase con 3 puntos da 24 meses en el simulador', () => {
    const res = calculateSimulation({
      permisType: 'classique',
      soldeActuel: 12,
      infractionsIds: ['non-utilisation-clignotant']
    });
    assert.strictEqual(res.delaiRecuperationMois, RECOVERY_LIGHT_CLASS_MONTHS);
  });
});

describe('Excesos de velocidad según el límite, no el tipo de vía', () => {
  it('ya no queda formulación agglomération / hors agglomération en textos ni clases', () => {
    const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
    assert.ok(!/hors agglomération|en agglomération/.test(page));
    for (const inf of getInfractions()) {
      assert.ok(!/agglo/.test(inf.classe), inf.id);
    }
  });

  it('la fila < 5 km/h indica la clase según la limitación', () => {
    const inf = getInfractionById('exces-vitesse-moins-5-kmh');
    assert.ok(inf);
    assert.match(inf.classe, /selon la limitation/);
    assert.match(inf.description, /limitation est supérieure à 50 km\/h/);
    assert.strictEqual(inf.points, 0);
  });
});

describe('Locuciones de los departamentos', () => {
  it('hay una locución para cada uno de los 101 departamentos', () => {
    const codes = getDepartements().map((d) => d.code).sort();
    assert.strictEqual(codes.length, 101);
    assert.deepStrictEqual(Object.keys(DEPARTEMENT_LOCATIVES).sort(), codes);
  });

  it('usa el artículo correcto', () => {
    assert.strictEqual(getDepartementLocative('01'), "dans l'Ain");
    assert.strictEqual(getDepartementLocative('75'), 'à Paris');
    assert.strictEqual(getDepartementLocative('2A'), 'en Corse-du-Sud');
  });

  it('lanza un error claro si falta el código', () => {
    assert.throws(() => getDepartementLocative('00'), /00/);
  });

  it('las páginas ya no usan « en {dept.nom} »', () => {
    for (const file of ['../app/stage/[slug]/page.tsx', '../components/PointsSimulator.tsx']) {
      const source = readFileSync(new URL(file, import.meta.url), 'utf8');
      assert.ok(!/ en \{(dept|selectedDept)\.nom\}/.test(source), file);
    }
  });

  it('el h1 de la página de stage solo lleva mayúscula inicial', () => {
    const source = readFileSync(new URL('../app/stage/[slug]/page.tsx', import.meta.url), 'utf8');
    assert.ok(source.includes('Stage de récupération de points {'));
    assert.ok(!source.includes('Récupération de Points'));
  });
});

describe('SEO de las infracciones', () => {
  it('la clase va en minúscula dentro de la frase', () => {
    const infraction = getInfractionById('exces-vitesse-50-kmh-ou-plus');
    assert.ok(infraction);
    const { description } = infractionSeo(infraction);
    assert.ok(description.includes('(délit)'), description);
    assert.ok(!description.includes('(Délit)'), description);
  });
});
