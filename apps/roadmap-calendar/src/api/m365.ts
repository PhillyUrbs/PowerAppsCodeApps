import type { RoadmapFeature, Availability } from '../types/index.ts';

const M365_API = '/api/roadmap/M365';
const PAGE_SIZE = 100;

interface M365ApiResponse {
  '@odata.nextLink'?: string;
  value: M365ApiFeature[];
}

interface M365ApiFeature {
  id: number;
  title: string;
  description: string;
  cloudInstances: string[];
  platforms: string[];
  releaseRings: string[];
  moreInfoUrls: string[];
  products: string[];
  generalAvailabilityDate: string | null;
  previewAvailabilityDate: string | null;
  created: string;
  status: string;
  modified: string;
  locale: string | null;
  availabilities: Availability[];
}

function mapM365Feature(raw: M365ApiFeature): RoadmapFeature {
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

export async function fetchM365Features(signal?: AbortSignal): Promise<RoadmapFeature[]> {
  const allFeatures: RoadmapFeature[] = [];
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const url = `${M365_API}?$skip=${skip}`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`M365 API error: ${response.status} ${response.statusText}`);
    }

    const data: M365ApiResponse = await response.json();
    const mapped = data.value.map(mapM365Feature);
    allFeatures.push(...mapped);

    if (data['@odata.nextLink'] && data.value.length === PAGE_SIZE) {
      skip += PAGE_SIZE;
    } else {
      hasMore = false;
    }
  }

  return allFeatures;
}
