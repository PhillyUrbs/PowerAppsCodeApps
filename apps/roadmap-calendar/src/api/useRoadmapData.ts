import { useQuery } from '@tanstack/react-query';
import { fetchM365Features } from './m365.ts';
import { fetchAzureFeatures } from './azure.ts';
import type { RoadmapFeature, MonthFeature, FilterState } from '../types/index.ts';
import { MONTH_NAMES } from '../types/index.ts';

async function fetchAllFeatures(): Promise<RoadmapFeature[]> {
  const [m365, azure] = await Promise.all([
    fetchM365Features(),
    fetchAzureFeatures(),
  ]);
  return [...m365, ...azure];
}

export function useRoadmapFeatures() {
  return useQuery({
    queryKey: ['roadmap-features'],
    queryFn: fetchAllFeatures,
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

const MONTH_MAP: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4,
  May: 5, June: 6, July: 7, August: 8,
  September: 9, October: 10, November: 11, December: 12,
};

export function groupFeaturesByMonth(
  features: RoadmapFeature[],
  year: number,
  filters: FilterState,
): Map<number, MonthFeature[]> {
  const monthMap = new Map<number, MonthFeature[]>();

  for (let m = 1; m <= 12; m++) {
    monthMap.set(m, []);
  }

  const filtered = applyFilters(features, filters);

  for (const feature of filtered) {
    for (const avail of feature.availabilities) {
      if (avail.year !== year) continue;

      const monthNum = MONTH_MAP[avail.month];
      if (!monthNum) continue;

      const bucket = monthMap.get(monthNum);
      if (bucket) {
        bucket.push({ feature, ring: avail.ring });
      }
    }
  }

  return monthMap;
}

function applyFilters(features: RoadmapFeature[], filters: FilterState): RoadmapFeature[] {
  return features.filter((f) => {
    if (!filters.sources.includes(f.source)) return false;

    if (filters.rings.length > 0) {
      const featureRings = f.availabilities.map((a) => a.ring);
      if (!filters.rings.some((r) => featureRings.includes(r))) return false;
    }

    if (filters.products.length > 0) {
      if (!filters.products.some((p) => f.products.includes(p))) return false;
    }

    if (filters.cloudInstances.length > 0) {
      if (!filters.cloudInstances.some((c) => f.cloudInstances.includes(c))) return false;
    }

    if (filters.productCategories.length > 0) {
      if (!filters.productCategories.some((c) => f.productCategories.includes(c))) return false;
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !f.title.toLowerCase().includes(q) &&
        !f.description.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    return true;
  });
}

export function getUniqueValues(features: RoadmapFeature[], filters: FilterState) {
  // Pre-filter by source so downstream options only show relevant values
  const sourceFiltered = features.filter((f) => filters.sources.includes(f.source));

  // For each filter dimension, apply all OTHER active filters so the options
  // reflect what's actually reachable. This prevents showing products that
  // would return zero results given current ring/cloud/category selections.
  const products = new Set<string>();
  const cloudInstances = new Set<string>();
  const productCategories = new Set<string>();
  const rings = new Set<string>();

  for (const f of sourceFiltered) {
    // Check non-product filters to decide if this feature's products are reachable
    if (matchesFiltersExcept(f, filters, 'products')) {
      f.products.forEach((p) => products.add(p));
    }
    if (matchesFiltersExcept(f, filters, 'cloudInstances')) {
      f.cloudInstances.forEach((c) => cloudInstances.add(c));
    }
    if (matchesFiltersExcept(f, filters, 'productCategories')) {
      f.productCategories.forEach((c) => productCategories.add(c));
    }
    if (matchesFiltersExcept(f, filters, 'rings')) {
      f.availabilities.forEach((a) => rings.add(a.ring));
    }
  }

  return {
    products: [...products].sort(),
    cloudInstances: [...cloudInstances].sort(),
    productCategories: [...productCategories].sort(),
    rings: [...rings].sort(),
  };
}

function matchesFiltersExcept(
  f: RoadmapFeature,
  filters: FilterState,
  exclude: 'products' | 'cloudInstances' | 'productCategories' | 'rings',
): boolean {
  if (exclude !== 'rings' && filters.rings.length > 0) {
    const featureRings = f.availabilities.map((a) => a.ring);
    if (!filters.rings.some((r) => featureRings.includes(r))) return false;
  }
  if (exclude !== 'products' && filters.products.length > 0) {
    if (!filters.products.some((p) => f.products.includes(p))) return false;
  }
  if (exclude !== 'cloudInstances' && filters.cloudInstances.length > 0) {
    if (!filters.cloudInstances.some((c) => f.cloudInstances.includes(c))) return false;
  }
  if (exclude !== 'productCategories' && filters.productCategories.length > 0) {
    if (!filters.productCategories.some((c) => f.productCategories.includes(c))) return false;
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    if (!f.title.toLowerCase().includes(q) && !f.description.toLowerCase().includes(q)) return false;
  }
  return true;
}

export function getMonthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? '';
}
