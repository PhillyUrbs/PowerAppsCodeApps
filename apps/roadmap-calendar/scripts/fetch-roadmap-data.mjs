#!/usr/bin/env node
/**
 * Fetches Microsoft M365 + Azure roadmap data and writes it to a static
 * JSON file that the app bundles at build time.
 *
 * Usage:
 *   node scripts/fetch-roadmap-data.mjs
 *
 * The output file is src/data/roadmap-data.json (gitignored).
 * Run this before `npm run build`, or use `npm run fetch-data && npm run build`.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'src', 'data');
const OUT_FILE = resolve(OUT_DIR, 'roadmap-data.json');

const M365_URL = 'https://www.microsoft.com/releasecommunications/api/v2/M365';
const AZURE_URL = 'https://www.microsoft.com/releasecommunications/api/v2/Azure';
const PAGE_SIZE = 100;

// ── helpers ──────────────────────────────────────────────────────────

async function fetchPaged(baseUrl) {
  const items = [];
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const url = `${baseUrl}?$skip=${skip}`;
    console.log(`  GET ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
    const json = await res.json();
    items.push(...json.value);

    if (json['@odata.nextLink'] && json.value.length === PAGE_SIZE) {
      skip += PAGE_SIZE;
    } else {
      hasMore = false;
    }
  }
  return items;
}

function mapM365(raw) {
  return {
    id: `m365-${raw.id}`,
    title: raw.title,
    description: raw.description,
    source: 'M365',
    status: raw.status ?? 'Unknown',
    products: raw.products ?? [],
    platforms: raw.platforms ?? [],
    cloudInstances: raw.cloudInstances ?? [],
    productCategories: [],
    tags: [],
    releaseRings: raw.releaseRings ?? [],
    generalAvailabilityDate: raw.generalAvailabilityDate,
    previewAvailabilityDate: raw.previewAvailabilityDate,
    privatePreviewAvailabilityDate: null,
    availabilities: raw.availabilities ?? [],
    created: raw.created,
    modified: raw.modified,
    moreInfoUrls: raw.moreInfoUrls ?? [],
  };
}

function mapAzure(raw) {
  return {
    id: `azure-${raw.id}`,
    title: raw.title,
    description: raw.description,
    source: 'Azure',
    status: raw.status ?? 'Unknown',
    products: raw.products ?? [],
    platforms: [],
    cloudInstances: [],
    productCategories: raw.productCategories ?? [],
    tags: raw.tags ?? [],
    releaseRings: [],
    generalAvailabilityDate: raw.generalAvailabilityDate,
    previewAvailabilityDate: raw.previewAvailabilityDate,
    privatePreviewAvailabilityDate: raw.privatePreviewAvailabilityDate,
    availabilities: raw.availabilities ?? [],
    created: raw.created,
    modified: raw.modified,
    moreInfoUrls: [],
  };
}

// ── main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching M365 roadmap data…');
  const m365Raw = await fetchPaged(M365_URL);
  console.log(`  → ${m365Raw.length} M365 features`);

  console.log('Fetching Azure roadmap data…');
  const azureRaw = await fetchPaged(AZURE_URL);
  console.log(`  → ${azureRaw.length} Azure features`);

  const features = [
    ...m365Raw.map(mapM365),
    ...azureRaw.map(mapAzure),
  ];

  const payload = {
    fetchedAt: new Date().toISOString(),
    featureCount: features.length,
    features,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(payload));

  const sizeMB = (Buffer.byteLength(JSON.stringify(payload)) / 1024 / 1024).toFixed(1);
  console.log(`\n✅ Wrote ${features.length} features to ${OUT_FILE} (${sizeMB} MB)`);
}

main().catch((err) => {
  console.error('❌ Failed to fetch roadmap data:', err);
  process.exit(1);
});
