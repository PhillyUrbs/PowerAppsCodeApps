export type BatchStatus = 'Draft' | 'InReview' | 'Approved' | 'Released' | 'Rejected';

export interface BatchStep {
  stepNumber: number;
  name: string;
  description: string;
}

export interface BatchClassification {
  id: string;
  name: string;
  description: string;
  steps: BatchStep[];
}

export interface BatchRecord {
  id: string;
  batchNumber: string;
  productName: string;
  productCode: string;
  classificationId: string;
  status: BatchStatus;
  description: string;
  quantity: number;
  unit: string;
  manufacturingDate: string;
  expirationDate: string;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
}

export const BATCH_STATUS_ORDER: BatchStatus[] = [
  'Draft',
  'InReview',
  'Approved',
  'Released',
];

export const BATCH_STATUS_TRANSITIONS: Record<BatchStatus, BatchStatus[]> = {
  Draft: ['InReview'],
  InReview: ['Approved', 'Rejected'],
  Approved: ['Released', 'Rejected'],
  Released: [],
  Rejected: ['Draft'],
};
