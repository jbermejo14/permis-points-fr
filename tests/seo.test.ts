import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  TITLE_MAX_LENGTH,
  TITLE_SUFFIX,
  buildMetadata,
  getAllPagesSeo,
  infractionSeo,
  pickTitle
} from '../lib/seo';
import { calculateSimulation, getInfractionById, getInfractions } from '../lib/permis';
import { absoluteUrl } from '../lib/site';
import sitemap from '../app/sitemap';

const ROOT = join(import.meta.dirname, '..');
const APP_DIR = join(ROOT, 'app');
const SOURCE_DIRS = ['app', 'components', 'lib'];
const SOURCE_FILE = /\.(ts|tsx)$/;
const FORBIDDEN_SOURCE_TEXTS = [
  'simulateur officiel',
  'barème officiel',
  'guide officiel',
  '1 500 €',
  '1500 €',
  '5e classe'
];
const SPEED_50_ID = 'exces-vitesse-50-kmh-ou-plus';
const STATIC_PAGES_COUNT = 5;
const DEPARTEMENTS_COUNT = 101;
const GUIDES_COUNT = 4;

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });
}

/** Détecta « Mot Majuscule » en milieu de titre : deux mots consécutifs à initiale capitale après le premier. */
function hasTitleCase(title: string): boolean {
  const withoutBrand = title.replace(TITLE_SUFFIX, '');
  const words = withoutBrand.split(' ').slice(1);
  return words.some((word, index) => {
    const next = words[index + 1];
    return next !== undefined && /^[A-ZÀ-Ý][a-zà-ÿ]{2,}$/.test(word) && /^[A-ZÀ-Ý][a-zà-ÿ]{2,}$/.test(next);
  });
}

describe('SEO : titres et descriptions de toutes les pages générées', () => {
  const pages = getAllPagesSeo();

  it('couvre toutes les pages du site', () => {
    const expected = STATIC_PAGES_COUNT + getInfractions().length + DEPARTEMENTS_COUNT + GUIDES_COUNT;
    assert.strictEqual(pages.length, expected);
    assert.strictEqual(new Set(pages.map((p) => p.path)).size, pages.length, 'chemins uniques');
  });

  it('coïncide avec les routes du sitemap', () => {
    const fromSitemap = sitemap().map((entry) => entry.url).sort();
    const fromSeo = pages.map((p) => absoluteUrl(p.path)).sort();
    assert.deepStrictEqual(fromSeo, fromSitemap);
  });

  it('chaque dossier de pages de app/ a ses entrées SEO', () => {
    const pageFiles = listFiles(APP_DIR).filter((f) => f.endsWith(`${sep}page.tsx`));
    const prefixes = pageFiles.map((f) => {
      const dir = relative(APP_DIR, join(f, '..')).split(sep).join('/');
      return dir === '' ? '/' : `/${dir.replace(/\/\[slug\]$/, '')}`;
    });
    for (const prefix of prefixes) {
      const covered = pages.some((p) => (prefix === '/' ? p.path === '/' : p.path.startsWith(prefix)));
      assert.ok(covered, `Aucune entrée SEO pour la route ${prefix}`);
    }
  });

  it('titre complet de 65 caractères maximum, avec la marque une seule fois', () => {
    for (const page of pages) {
      assert.ok(page.title.length <= TITLE_MAX_LENGTH, `${page.path} : ${page.title.length} car. « ${page.title} »`);
      assert.ok(page.title.endsWith(TITLE_SUFFIX), `${page.path} : suffixe de marque absent`);
      assert.strictEqual(page.title.split('Ododex').length - 1, 1, `${page.path} : marque répétée`);
      assert.ok(!page.title.includes('| Ododex | Ododex'));
    }
  });

  it('titres uniques et sans majuscules de type Title Case', () => {
    assert.strictEqual(new Set(pages.map((p) => p.title)).size, pages.length, 'titres uniques');
    for (const page of pages) {
      assert.ok(!hasTitleCase(page.title), `Title Case probable : « ${page.title} »`);
    }
  });

  it('description de 120 à 160 caractères, unique par page', () => {
    for (const page of pages) {
      assert.ok(
        page.description.length >= DESCRIPTION_MIN_LENGTH && page.description.length <= DESCRIPTION_MAX_LENGTH,
        `${page.path} : ${page.description.length} car. « ${page.description} »`
      );
    }
    assert.strictEqual(new Set(pages.map((p) => p.description)).size, pages.length, 'descriptions uniques');
  });

  it('pickTitle choisit une variante plus courte au lieu de tronquer', () => {
    const long = 'x'.repeat(70);
    assert.strictEqual(pickTitle([long, 'Court']), `Court${TITLE_SUFFIX}`);
  });
});

describe('SEO : image Open Graph et Twitter', () => {
  it('buildMetadata déclare l’image 1200x630 en URL absolue et la carte Twitter', () => {
    const metadata = buildMetadata({ path: '/infractions', title: `T${TITLE_SUFFIX}`, description: 'd' });
    const images = metadata.openGraph?.images as { url: string; width: number; height: number }[];
    assert.strictEqual(images[0].url, absoluteUrl(OG_IMAGE_PATH));
    assert.ok(images[0].url.startsWith('https://'));
    assert.strictEqual(images[0].width, OG_IMAGE_WIDTH);
    assert.strictEqual(images[0].height, OG_IMAGE_HEIGHT);
    const twitter = metadata.twitter as { card: string; images: string[] };
    assert.strictEqual(twitter.card, 'summary_large_image');
    assert.deepStrictEqual(twitter.images, [images[0].url]);
  });

  it('le fichier de l’image existe dans public/brand', () => {
    assert.ok(existsSync(join(ROOT, 'public', 'brand', 'ododex-og.png')));
  });

  it('aucune page ne redéfinit openGraph à la main (sans image)', () => {
    for (const file of listFiles(APP_DIR).filter((f) => SOURCE_FILE.test(f))) {
      assert.ok(!/openGraph\s*:/.test(readFileSync(file, 'utf8')), `${file} redéfinit openGraph à la main`);
    }
  });
});

describe('Textes interdits dans app/, components/ et lib/', () => {
  it('aucune mention « officiel » pour la web, ni 1 500 € ni 5e classe', () => {
    for (const dir of SOURCE_DIRS) {
      for (const file of listFiles(join(ROOT, dir)).filter((f) => SOURCE_FILE.test(f))) {
        const content = readFileSync(file, 'utf8').toLowerCase();
        for (const forbidden of FORBIDDEN_SOURCE_TEXTS) {
          assert.ok(!content.includes(forbidden.toLowerCase()), `« ${forbidden} » trouvé dans ${file}`);
        }
      }
    }
  });
});

describe('Excès de vitesse de 50 km/h ou plus (délit depuis le 29/12/2025)', () => {
  it('porte les montants et peines du délit', () => {
    const infraction = getInfractionById(SPEED_50_ID);
    assert.ok(infraction);
    assert.strictEqual(infraction.points, 6);
    assert.strictEqual(infraction.amendeForfaitaire, 300);
    assert.strictEqual(infraction.amendeMinoree, 250);
    assert.strictEqual(infraction.amendeMajoree, 600);
    assert.strictEqual(infraction.classe, 'Délit');
    for (const text of ['29 décembre 2025', '3 750 €', '3 mois', '2025-622', '2025-1269']) {
      assert.ok(infraction.description.includes(text), `description sans « ${text} »`);
    }
    assert.match(infraction.peineComplementaire, /jusqu'à 3 ans/);
    assert.match(infraction.peineComplementaire, /immobilisation/);
    assert.match(infraction.peineComplementaire, /confiscation/);
    assert.ok(!infraction.description.includes('5e classe'));
  });

  it('le simulateur retire 6 points et additionne 300, 250 et 600 €', () => {
    const result = calculateSimulation({ permisType: 'classique', soldeActuel: 12, infractionsIds: [SPEED_50_ID] });
    assert.strictEqual(result.pointsRetires, 6);
    assert.strictEqual(result.nouveauSolde, 6);
    assert.strictEqual(result.totalAmendeForfaitaire, 300);
    assert.strictEqual(result.totalAmendeMinoree, 250);
    assert.strictEqual(result.totalAmendeMajoree, 600);
    assert.strictEqual(result.delaiRecuperationMois, 36);
  });

  it('les fiches 5-19 km/h distinguent limitation de 50 km/h ou moins et supérieure à 50 km/h', () => {
    const slow = getInfractionById('exces-vitesse-5-a-19-kmh-agglo');
    const fast = getInfractionById('exces-vitesse-5-a-19-kmh-hors-agglo');
    assert.ok(slow?.nom.includes('limitation de 50 km/h ou moins'));
    assert.ok(fast?.nom.includes('limitation supérieure à 50 km/h'));
    assert.strictEqual(slow?.amendeForfaitaire, 135);
    assert.strictEqual(fast?.amendeForfaitaire, 68);
  });

  it('le titre de la fiche tient dans la limite', () => {
    const infraction = getInfractionById(SPEED_50_ID);
    assert.ok(infraction);
    assert.ok(infractionSeo(infraction).title.length <= TITLE_MAX_LENGTH);
  });
});
