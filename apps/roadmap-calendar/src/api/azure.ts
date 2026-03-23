import type { RoadmapFeature, Availability } from '../types/index.ts';

const AZURE_API = '/api/roadmap/Azure';
const PAGE_SIZE = 100;

interface AzureApiResponse {
  '@odata.nextLink'?: string;
  value: AzureApiFeature[];
}

interface AzureApiFeature {
  id: string;
  title: string;
  description: string;
  productCategories: string[];
  tags: string[];
  products: string[];
  generalAvailabilityDate: string | null;
  previewAvailabilityDate: string | null;
  privatePreviewAvailabilityDate: string | null;
  status: string | null;
  created: string;
  modified: string;
  locale: string | null;
  availabilities: Availability[];
}

function mapAzureFeature(raw: AzureApiFeature): RoadmapFeature {
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

export async function fetchAzureFeatures(signal?: AbortSignal): Promise<RoadmapFeature[]> {
  const allFeatures: RoadmapFeature[] = [];
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const url = `${AZURE_API}?$skip=${skip}`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.status} ${response.statusText}`);
    }

    const data: AzureApiResponse = await response.json();
    const mapped = data.value.map(mapAzureFeature);
    allFeatures.push(...mapped);

    if (data['@odata.nextLink'] && data.value.length === PAGE_SIZE) {
      skip += PAGE_SIZE;
    } else {
      hasMore = false;
    }
  }

  return allFeatures;
}
