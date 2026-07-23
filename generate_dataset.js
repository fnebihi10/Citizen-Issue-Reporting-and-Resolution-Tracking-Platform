const fs = require('node:fs');
const path = require('node:path');

const reportCount = 120;
const generationSeed = 20260723;
const referenceDate = Date.UTC(2026, 6, 1);

// This is an explicitly synthetic demo grid, not an address, municipality, or real incident location.
const syntheticMapCenter = { latitude: 42.0, longitude: 20.0 };

const categories = [
  { slug: 'rruge-gropa', name: 'Rrugë dhe gropa', slaHours: 48, subjects: ['Gropë në segment rrugor', 'Trotuar i dëmtuar', 'Asfalt i dëmtuar'] },
  { slug: 'ndricim-publik', name: 'Ndriçim publik', slaHours: 24, subjects: ['Ndriçim publik i fikur', 'Shtyllë ndriçimi e dëmtuar', 'Zonë publike pa ndriçim'] },
  { slug: 'mbeturina', name: 'Mbeturina', slaHours: 24, subjects: ['Kontejner i mbushur', 'Mbeturina në hapësirë publike', 'Nevojë për pastrim'] },
  { slug: 'sinjalistike', name: 'Sinjalistikë', slaHours: 72, subjects: ['Shenjë trafiku e dëmtuar', 'Vijëzim i zbehur', 'Sinjalistikë që mungon'] },
];

const statuses = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'rejected', 'reopened'];

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const random = seededRandom(generationSeed);
const choose = (items) => items[Math.floor(random() * items.length)];
const between = (minimum, maximum) => minimum + random() * (maximum - minimum);
const round = (value, decimals) => Number(value.toFixed(decimals));

const dataset = Array.from({ length: reportCount }, (_, index) => {
  const category = choose(categories);
  const status = choose(statuses);
  const createdAt = new Date(Date.UTC(2026, 0, 1) + Math.floor(random() * 155 * 24 * 60 * 60 * 1000));
  const updatedAt = new Date(createdAt.getTime() + Math.floor(random() * 72 * 60 * 60 * 1000));
  const slaDueAt = new Date(createdAt.getTime() + category.slaHours * 60 * 60 * 1000);
  const isTerminal = status === 'resolved' || status === 'rejected';

  return {
    id: `SYN-${String(index + 1).padStart(4, '0')}`,
    report_number: 1001 + index,
    title: `${choose(category.subjects)} — rast sintetik ${index + 1}`,
    description: `Përshkrim sintetik për kategorinë ${category.name.toLowerCase()}. Nuk përfaqëson problem, person ose adresë reale.`,
    category_slug: category.slug,
    category_name: category.name,
    status,
    latitude: round(between(syntheticMapCenter.latitude - 0.025, syntheticMapCenter.latitude + 0.025), 4),
    longitude: round(between(syntheticMapCenter.longitude - 0.025, syntheticMapCenter.longitude + 0.025), 4),
    public_location_precision_m: 500,
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
    sla_due_at: slaDueAt.toISOString(),
    is_sla_overdue: !isTerminal && slaDueAt.getTime() < referenceDate,
    is_public: status !== 'submitted',
  };
});

const datasetPath = path.join(__dirname, 'dataset', 'synthetic_dataset.json');
fs.writeFileSync(datasetPath, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8');
console.log(`Generated ${reportCount} deterministic synthetic reports.`);
