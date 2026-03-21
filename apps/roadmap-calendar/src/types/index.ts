export type DataSource = 'M365' | 'Azure';

export type RingType =
  | 'Private Preview'
  | 'Preview'
  | 'Targeted Release'
  | 'Current Channel'
  | 'General Availability'
  | 'Retirement';

export type FeatureStatus =
  | 'Launched'
  | 'Rolling out'
  | 'In development'
  | 'In preview'
  | 'Cancelled';

export interface Availability {
  ring: string;
  year: number;
  month: string;
}

export interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  source: DataSource;
  status: string;
  products: string[];
  platforms: string[];
  cloudInstances: string[];
  productCategories: string[];
  tags: string[];
  releaseRings: string[];
  generalAvailabilityDate: string | null;
  previewAvailabilityDate: string | null;
  privatePreviewAvailabilityDate: string | null;
  availabilities: Availability[];
  created: string;
  modified: string;
  moreInfoUrls: string[];
}

export interface MonthGroup {
  year: number;
  month: number;
  monthName: string;
  features: MonthFeature[];
}

export interface MonthFeature {
  feature: RoadmapFeature;
  ring: string;
}

export interface FilterState {
  sources: DataSource[];
  rings: string[];
  products: string[];
  cloudInstances: string[];
  productCategories: string[];
  search: string;
}

export const DEFAULT_FILTERS: FilterState = {
  sources: ['M365', 'Azure'],
  rings: [],
  products: [],
  cloudInstances: [],
  productCategories: [],
  search: '',
};

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const RING_COLORS: Record<string, string> = {
  'Private Preview': '#9333ea',
  'Preview': '#2563eb',
  'Targeted Release': '#0891b2',
  'Current Channel': '#0d9488',
  'General Availability': '#16a34a',
  'Retirement': '#dc2626',
};
