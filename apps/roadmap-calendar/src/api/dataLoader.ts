/**
 * Loads roadmap features via the Power Platform custom connector
 * in production, or from the Vite dev proxy in dev mode.
 *
 * Production: MicrosoftRoadmapService calls the connector server-side
 *             (no CORS — Power Platform handles it).
 * Dev mode:   Vite proxy forwards /api/roadmap/* to microsoft.com.
 */

/// <reference types="vite/client" />

import type { RoadmapFeature } from '../types/index.ts';
import type { RoadmapFeature as ConnectorFeature } from '../generated/models/MicrosoftRoadmapModel.ts';
import { MicrosoftRoadmapService } from '../generated/services/MicrosoftRoadmapService.ts';

const PAGE_SIZE = 100;

/** Map a connector response feature to the app's RoadmapFeature type. */
function mapM365(raw: ConnectorFeature): RoadmapFeature {
  return {
    id: `m365-${raw.id ?? ''}`,
    title: raw.title ?? '',
    description: raw.description ?? '',
    source: 'M365',
    status: raw.status ?? 'Unknown',
    products: raw.products ?? [],
    platforms: raw.platforms ?? [],
    cloudInstances: raw.cloudInstances ?? [],
    productCategories: [],
    tags: [],
    releaseRings: raw.releaseRings ?? [],
    generalAvailabilityDate: raw.generalAvailabilityDate ?? null,
    previewAvailabilityDate: raw.previewAvailabilityDate ?? null,
    privatePreviewAvailabilityDate: null,
    availabilities: (raw.availabilities ?? []).map((a) => ({
      ring: a.ring ?? '',
      year: a.year ?? 0,
      month: a.month ?? '',
    })),
    created: raw.created ?? '',
    modified: raw.modified ?? '',
    moreInfoUrls: raw.moreInfoUrls ?? [],
  };
}

function mapAzure(raw: ConnectorFeature): RoadmapFeature {
  return {
    id: `azure-${raw.id ?? ''}`,
    title: raw.title ?? '',
    description: raw.description ?? '',
    source: 'Azure',
    status: raw.status ?? 'Unknown',
    products: raw.products ?? [],
    platforms: [],
    cloudInstances: [],
    productCategories: raw.productCategories ?? [],
    tags: raw.tags ?? [],
    releaseRings: [],
    generalAvailabilityDate: raw.generalAvailabilityDate ?? null,
    previewAvailabilityDate: raw.previewAvailabilityDate ?? null,
    privatePreviewAvailabilityDate: raw.privatePreviewAvailabilityDate ?? null,
    availabilities: (raw.availabilities ?? []).map((a) => ({
      ring: a.ring ?? '',
      year: a.year ?? 0,
      month: a.month ?? '',
    })),
    created: raw.created ?? '',
    modified: raw.modified ?? '',
    moreInfoUrls: [],
  };
}

/** Fetch all pages from a connector operation. */
async function fetchAllPages(
  fetcher: (skip: number) => Promise<{ data?: { value?: ConnectorFeature[]; '@odata.nextLink'?: string } }>,
): Promise<ConnectorFeature[]> {
  const all: ConnectorFeature[] = [];
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const result = await fetcher(skip);
    const items = result.data?.value ?? [];
    all.push(...items);

    if (result.data?.['@odata.nextLink'] && items.length === PAGE_SIZE) {
      skip += PAGE_SIZE;
    } else {
      hasMore = false;
    }
  }
  return all;
}

/**
 * In dev mode, fetch live from the Vite proxy.
 * In production, use the Power Platform custom connector.
 */
export async function loadFeatures(): Promise<RoadmapFeature[]> {
  if (import.meta.env.DEV) {
    // Live fetch through Vite dev proxy — keeps dev experience interactive
    const { fetchM365Features } = await import('./m365.ts');
    const { fetchAzureFeatures } = await import('./azure.ts');
    const [m365, azure] = await Promise.all([
      fetchM365Features(),
      fetchAzureFeatures(),
    ]);
    return [...m365, ...azure];
  }

  // Production: use the Power Platform custom connector (server-side, no CORS)
  const [m365Raw, azureRaw] = await Promise.all([
    fetchAllPages((skip) => MicrosoftRoadmapService.GetM365Features(skip)),
    fetchAllPages((skip) => MicrosoftRoadmapService.GetAzureFeatures(skip)),
  ]);

  return [
    ...m365Raw.map(mapM365),
    ...azureRaw.map(mapAzure),
  ];
}
