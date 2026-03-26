import type { BatchRecord, BatchClassification } from '../types/batch-record';
import type { ElectronicSignature } from '../types/electronic-signature';
import type { AuditEntry } from '../types/audit-entry';
import type { AppUser } from '../types/user';
import type { ComplianceRequirement } from '../types/compliance';

// ── Users ──────────────────────────────────────────────

export const USERS: AppUser[] = [
  { id: 'u1', displayName: 'Sarah Chen', email: 'schen@pharma.example', role: 'Operator' },
  { id: 'u2', displayName: 'James Rivera', email: 'jrivera@pharma.example', role: 'Reviewer' },
  { id: 'u3', displayName: 'Dr. Emily Watson', email: 'ewatson@pharma.example', role: 'QA Approver' },
  { id: 'u4', displayName: 'Admin User', email: 'admin@pharma.example', role: 'Admin' },
];

// ── Batch Classifications ──────────────────────────────

export const BATCH_CLASSIFICATIONS: BatchClassification[] = [
  {
    id: 'cls-oral-solid',
    name: 'Oral Solid Dosage',
    description: 'Tablets and capsules manufactured via compression or encapsulation',
    steps: [
      { stepNumber: 1, name: 'Weighing & Dispensing', description: 'Verify raw material identity and weigh per batch formula' },
      { stepNumber: 2, name: 'Granulation / Blending', description: 'Mix active and excipient ingredients per process parameters' },
      { stepNumber: 3, name: 'Compression / Encapsulation', description: 'Tablet compression or capsule fill operation' },
      { stepNumber: 4, name: 'Coating (if applicable)', description: 'Film or enteric coating application' },
      { stepNumber: 5, name: 'Packaging & Labeling', description: 'Primary and secondary packaging with label verification' },
    ],
  },
  {
    id: 'cls-sterile-injectable',
    name: 'Sterile Injectable',
    description: 'Aseptically processed injectable products',
    steps: [
      { stepNumber: 1, name: 'Solution Preparation', description: 'Prepare and filter drug solution in clean room' },
      { stepNumber: 2, name: 'Aseptic Filling', description: 'Fill vials/syringes under Grade A conditions' },
      { stepNumber: 3, name: 'Lyophilization (if applicable)', description: 'Freeze-dry cycle per validated parameters' },
      { stepNumber: 4, name: 'Stoppering & Sealing', description: 'Stopper and crimp-seal containers' },
      { stepNumber: 5, name: 'Visual Inspection', description: '100% visual inspection for particulates and defects' },
      { stepNumber: 6, name: 'Sterility Testing', description: 'Environmental monitoring and sterility test sampling' },
      { stepNumber: 7, name: 'Packaging & Labeling', description: 'Final packaging with serialization' },
    ],
  },
  {
    id: 'cls-otc-simple',
    name: 'OTC Simple',
    description: 'Over-the-counter products with simplified manufacturing',
    steps: [
      { stepNumber: 1, name: 'Weighing & Dispensing', description: 'Verify and weigh raw materials' },
      { stepNumber: 2, name: 'Manufacturing', description: 'Blending, compression, or encapsulation' },
      { stepNumber: 3, name: 'Packaging & Labeling', description: 'Packaging with OTC labeling requirements' },
    ],
  },
];

// ── Batch Records ──────────────────────────────────────

export const BATCH_RECORDS: BatchRecord[] = [
  {
    id: 'br-001',
    batchNumber: 'RX-2026-0042',
    productName: 'Amoxicillin 500mg Capsules',
    productCode: 'AMX-500',
    classificationId: 'cls-oral-solid',
    status: 'Released',
    description: 'Standard production batch of Amoxicillin 500mg capsules. 60-count bottles.',
    quantity: 50000,
    unit: 'capsules',
    manufacturingDate: '2026-01-15T08:00:00Z',
    expirationDate: '2028-01-15T00:00:00Z',
    createdBy: 'Sarah Chen',
    createdOn: '2026-01-15T08:12:00Z',
    modifiedBy: 'Dr. Emily Watson',
    modifiedOn: '2026-01-18T14:30:00Z',
  },
  {
    id: 'br-002',
    batchNumber: 'RX-2026-0043',
    productName: 'Lisinopril 10mg Tablets',
    productCode: 'LIS-010',
    classificationId: 'cls-oral-solid',
    status: 'Approved',
    description: 'Lisinopril 10mg tablets for cardiovascular treatment. 90-count bottles.',
    quantity: 75000,
    unit: 'tablets',
    manufacturingDate: '2026-02-01T07:30:00Z',
    expirationDate: '2028-02-01T00:00:00Z',
    createdBy: 'Sarah Chen',
    createdOn: '2026-02-01T07:45:00Z',
    modifiedBy: 'Dr. Emily Watson',
    modifiedOn: '2026-02-05T11:20:00Z',
  },
  {
    id: 'br-003',
    batchNumber: 'RX-2026-0044',
    productName: 'Metformin 850mg Tablets',
    productCode: 'MET-850',
    classificationId: 'cls-oral-solid',
    status: 'InReview',
    description: 'Extended-release metformin tablets. 100-count bottles.',
    quantity: 100000,
    unit: 'tablets',
    manufacturingDate: '2026-03-10T06:00:00Z',
    expirationDate: '2028-03-10T00:00:00Z',
    createdBy: 'Sarah Chen',
    createdOn: '2026-03-10T06:15:00Z',
    modifiedBy: 'James Rivera',
    modifiedOn: '2026-03-12T09:00:00Z',
  },
  {
    id: 'br-004',
    batchNumber: 'RX-2026-0045',
    productName: 'Omeprazole 20mg Capsules',
    productCode: 'OMP-020',
    classificationId: 'cls-oral-solid',
    status: 'Draft',
    description: 'Delayed-release omeprazole capsules. 30-count bottles.',
    quantity: 40000,
    unit: 'capsules',
    manufacturingDate: '2026-03-20T08:00:00Z',
    expirationDate: '2028-03-20T00:00:00Z',
    createdBy: 'Sarah Chen',
    createdOn: '2026-03-20T08:30:00Z',
    modifiedBy: 'Sarah Chen',
    modifiedOn: '2026-03-20T10:15:00Z',
  },
  {
    id: 'br-005',
    batchNumber: 'RX-2026-0046',
    productName: 'Atorvastatin 40mg Tablets',
    productCode: 'ATV-040',
    classificationId: 'cls-oral-solid',
    status: 'Rejected',
    description: 'Atorvastatin calcium tablets. Rejected due to dissolution test failure.',
    quantity: 60000,
    unit: 'tablets',
    manufacturingDate: '2026-02-15T07:00:00Z',
    expirationDate: '2028-02-15T00:00:00Z',
    createdBy: 'Sarah Chen',
    createdOn: '2026-02-15T07:20:00Z',
    modifiedBy: 'Dr. Emily Watson',
    modifiedOn: '2026-02-20T16:45:00Z',
  },
  {
    id: 'br-006',
    batchNumber: 'RX-2026-0047',
    productName: 'Ibuprofen 200mg Tablets',
    productCode: 'IBU-200',
    classificationId: 'cls-otc-simple',
    status: 'Draft',
    description: 'Over-the-counter ibuprofen tablets. 200-count bottles.',
    quantity: 200000,
    unit: 'tablets',
    manufacturingDate: '2026-03-22T06:00:00Z',
    expirationDate: '2028-03-22T00:00:00Z',
    createdBy: 'Sarah Chen',
    createdOn: '2026-03-22T06:10:00Z',
    modifiedBy: 'Sarah Chen',
    modifiedOn: '2026-03-22T06:10:00Z',
  },
  {
    id: 'br-007',
    batchNumber: 'RX-2026-0048',
    productName: 'Cetirizine 10mg Tablets',
    productCode: 'CET-010',
    classificationId: 'cls-otc-simple',
    status: 'InReview',
    description: 'Antihistamine cetirizine tablets. 30-count blister packs.',
    quantity: 80000,
    unit: 'tablets',
    manufacturingDate: '2026-03-05T08:00:00Z',
    expirationDate: '2028-03-05T00:00:00Z',
    createdBy: 'Sarah Chen',
    createdOn: '2026-03-05T08:20:00Z',
    modifiedBy: 'James Rivera',
    modifiedOn: '2026-03-08T10:30:00Z',
  },
  {
    id: 'br-008',
    batchNumber: 'RX-2026-0049',
    productName: 'Azithromycin 250mg Tablets',
    productCode: 'AZT-250',
    classificationId: 'cls-oral-solid',
    status: 'Released',
    description: 'Azithromycin film-coated tablets. 6-count Z-pack.',
    quantity: 30000,
    unit: 'tablets',
    manufacturingDate: '2026-01-25T07:00:00Z',
    expirationDate: '2028-01-25T00:00:00Z',
    createdBy: 'Sarah Chen',
    createdOn: '2026-01-25T07:15:00Z',
    modifiedBy: 'Dr. Emily Watson',
    modifiedOn: '2026-01-30T15:00:00Z',
  },
];

// ── Electronic Signatures ──────────────────────────────

export const SIGNATURES: ElectronicSignature[] = [
  // br-001 (Released, Oral Solid — 5 steps, steps 1-3 fully signed for demo)
  { id: 's-001', recordId: 'br-001', stepNumber: 1, signatureType: 'Doer', signerName: 'Sarah Chen', signerRole: 'Operator', meaning: 'Verified', reason: 'Weighing complete. All materials verified against COA.', signedOn: '2026-01-15T09:00:00Z' },
  { id: 's-002', recordId: 'br-001', stepNumber: 1, signatureType: 'Witness', signerName: 'James Rivera', signerRole: 'Reviewer', meaning: 'Reviewed', reason: 'Witnessed weighing. Tare and gross weights confirmed.', signedOn: '2026-01-15T09:15:00Z' },
  { id: 's-003', recordId: 'br-001', stepNumber: 2, signatureType: 'Doer', signerName: 'Sarah Chen', signerRole: 'Operator', meaning: 'Verified', reason: 'Granulation and blending completed per SOP-MFG-101.', signedOn: '2026-01-15T14:00:00Z' },
  { id: 's-004', recordId: 'br-001', stepNumber: 2, signatureType: 'Witness', signerName: 'James Rivera', signerRole: 'Reviewer', meaning: 'Reviewed', reason: 'Process parameters within specification.', signedOn: '2026-01-15T14:20:00Z' },
  { id: 's-005', recordId: 'br-001', stepNumber: 3, signatureType: 'Doer', signerName: 'Sarah Chen', signerRole: 'Operator', meaning: 'Verified', reason: 'Encapsulation complete. In-process weight checks passed.', signedOn: '2026-01-16T10:00:00Z' },
  { id: 's-006', recordId: 'br-001', stepNumber: 3, signatureType: 'Witness', signerName: 'Dr. Emily Watson', signerRole: 'QA Approver', meaning: 'Approved', reason: 'QA spot check confirmed. Capsule fill weights acceptable.', signedOn: '2026-01-16T10:30:00Z' },
  { id: 's-007', recordId: 'br-001', stepNumber: 4, signatureType: 'Doer', signerName: 'Sarah Chen', signerRole: 'Operator', meaning: 'Verified', reason: 'No coating required for this product. Step marked N/A.', signedOn: '2026-01-16T11:00:00Z' },
  { id: 's-008', recordId: 'br-001', stepNumber: 4, signatureType: 'Witness', signerName: 'James Rivera', signerRole: 'Reviewer', meaning: 'Reviewed', reason: 'Confirmed N/A for coating step.', signedOn: '2026-01-16T11:05:00Z' },
  { id: 's-009', recordId: 'br-001', stepNumber: 5, signatureType: 'Doer', signerName: 'Sarah Chen', signerRole: 'Operator', meaning: 'Verified', reason: 'Packaging and labeling complete. Labels verified.', signedOn: '2026-01-17T08:00:00Z' },
  { id: 's-010', recordId: 'br-001', stepNumber: 5, signatureType: 'Witness', signerName: 'Dr. Emily Watson', signerRole: 'QA Approver', meaning: 'Approved', reason: 'Final QA release. All steps complete and verified.', signedOn: '2026-01-17T14:00:00Z' },

  // br-003 (InReview, Oral Solid — step 1 signed)
  { id: 's-011', recordId: 'br-003', stepNumber: 1, signatureType: 'Doer', signerName: 'Sarah Chen', signerRole: 'Operator', meaning: 'Verified', reason: 'Weighing and dispensing complete.', signedOn: '2026-03-10T08:00:00Z' },
  { id: 's-012', recordId: 'br-003', stepNumber: 1, signatureType: 'Witness', signerName: 'James Rivera', signerRole: 'Reviewer', meaning: 'Reviewed', reason: 'Weights verified against batch formula.', signedOn: '2026-03-10T08:30:00Z' },

  // br-007 (InReview, OTC Simple — step 1 signed)
  { id: 's-013', recordId: 'br-007', stepNumber: 1, signatureType: 'Doer', signerName: 'Sarah Chen', signerRole: 'Operator', meaning: 'Verified', reason: 'Raw materials weighed and dispensed.', signedOn: '2026-03-06T09:00:00Z' },
  { id: 's-014', recordId: 'br-007', stepNumber: 1, signatureType: 'Witness', signerName: 'James Rivera', signerRole: 'Reviewer', meaning: 'Reviewed', reason: 'Witnessed dispensing. Quantities confirmed.', signedOn: '2026-03-06T09:20:00Z' },

  // br-008 (Released, Oral Solid — all 5 steps signed)
  { id: 's-015', recordId: 'br-008', stepNumber: 1, signatureType: 'Doer', signerName: 'Sarah Chen', signerRole: 'Operator', meaning: 'Verified', reason: 'Materials weighed per batch record.', signedOn: '2026-01-25T08:00:00Z' },
  { id: 's-016', recordId: 'br-008', stepNumber: 1, signatureType: 'Witness', signerName: 'James Rivera', signerRole: 'Reviewer', meaning: 'Reviewed', reason: 'Confirmed weights and material identity.', signedOn: '2026-01-25T08:20:00Z' },
  { id: 's-017', recordId: 'br-008', stepNumber: 2, signatureType: 'Doer', signerName: 'Sarah Chen', signerRole: 'Operator', meaning: 'Verified', reason: 'Blending complete.', signedOn: '2026-01-25T12:00:00Z' },
  { id: 's-018', recordId: 'br-008', stepNumber: 2, signatureType: 'Witness', signerName: 'James Rivera', signerRole: 'Reviewer', meaning: 'Reviewed', reason: 'Blend uniformity acceptable.', signedOn: '2026-01-25T12:30:00Z' },
  { id: 's-019', recordId: 'br-008', stepNumber: 3, signatureType: 'Doer', signerName: 'Sarah Chen', signerRole: 'Operator', meaning: 'Verified', reason: 'Compression complete. Hardness and friability in spec.', signedOn: '2026-01-26T10:00:00Z' },
  { id: 's-020', recordId: 'br-008', stepNumber: 3, signatureType: 'Witness', signerName: 'Dr. Emily Watson', signerRole: 'QA Approver', meaning: 'Approved', reason: 'IPC results reviewed and acceptable.', signedOn: '2026-01-26T10:30:00Z' },
  { id: 's-021', recordId: 'br-008', stepNumber: 4, signatureType: 'Doer', signerName: 'Sarah Chen', signerRole: 'Operator', meaning: 'Verified', reason: 'Film coating applied successfully.', signedOn: '2026-01-27T09:00:00Z' },
  { id: 's-022', recordId: 'br-008', stepNumber: 4, signatureType: 'Witness', signerName: 'James Rivera', signerRole: 'Reviewer', meaning: 'Reviewed', reason: 'Coating weight gain within specification.', signedOn: '2026-01-27T09:30:00Z' },
  { id: 's-023', recordId: 'br-008', stepNumber: 5, signatureType: 'Doer', signerName: 'Sarah Chen', signerRole: 'Operator', meaning: 'Verified', reason: 'Packaging and serialization complete.', signedOn: '2026-01-29T08:00:00Z' },
  { id: 's-024', recordId: 'br-008', stepNumber: 5, signatureType: 'Witness', signerName: 'Dr. Emily Watson', signerRole: 'QA Approver', meaning: 'Approved', reason: 'Final release approved. Batch complete.', signedOn: '2026-01-29T14:00:00Z' },
];

// ── Audit Trail ────────────────────────────────────────

export const AUDIT_ENTRIES: AuditEntry[] = [
  // br-001 lifecycle
  { id: 'a-001', recordId: 'br-001', recordLabel: 'RX-2026-0042', action: 'Created', performedBy: 'Sarah Chen', performedOn: '2026-01-15T08:12:00Z' },
  { id: 'a-002', recordId: 'br-001', recordLabel: 'RX-2026-0042', action: 'Updated', field: 'description', oldValue: '', newValue: 'Standard production batch of Amoxicillin 500mg capsules. 60-count bottles.', performedBy: 'Sarah Chen', performedOn: '2026-01-15T08:30:00Z' },
  { id: 'a-003', recordId: 'br-001', recordLabel: 'RX-2026-0042', action: 'Signed', field: 'signature', newValue: 'Reviewed by James Rivera', performedBy: 'James Rivera', performedOn: '2026-01-16T10:00:00Z' },
  { id: 'a-004', recordId: 'br-001', recordLabel: 'RX-2026-0042', action: 'StatusChanged', field: 'status', oldValue: 'Draft', newValue: 'InReview', performedBy: 'James Rivera', performedOn: '2026-01-16T10:00:00Z' },
  { id: 'a-005', recordId: 'br-001', recordLabel: 'RX-2026-0042', action: 'Signed', field: 'signature', newValue: 'Approved by Dr. Emily Watson', performedBy: 'Dr. Emily Watson', performedOn: '2026-01-17T14:00:00Z' },
  { id: 'a-006', recordId: 'br-001', recordLabel: 'RX-2026-0042', action: 'StatusChanged', field: 'status', oldValue: 'InReview', newValue: 'Approved', performedBy: 'Dr. Emily Watson', performedOn: '2026-01-17T14:00:00Z' },
  { id: 'a-007', recordId: 'br-001', recordLabel: 'RX-2026-0042', action: 'Signed', field: 'signature', newValue: 'Verified by Sarah Chen', performedBy: 'Sarah Chen', performedOn: '2026-01-18T09:00:00Z' },
  { id: 'a-008', recordId: 'br-001', recordLabel: 'RX-2026-0042', action: 'StatusChanged', field: 'status', oldValue: 'Approved', newValue: 'Released', performedBy: 'Sarah Chen', performedOn: '2026-01-18T14:30:00Z' },

  // br-002
  { id: 'a-009', recordId: 'br-002', recordLabel: 'RX-2026-0043', action: 'Created', performedBy: 'Sarah Chen', performedOn: '2026-02-01T07:45:00Z' },
  { id: 'a-010', recordId: 'br-002', recordLabel: 'RX-2026-0043', action: 'Signed', field: 'signature', newValue: 'Reviewed by James Rivera', performedBy: 'James Rivera', performedOn: '2026-02-03T11:00:00Z' },
  { id: 'a-011', recordId: 'br-002', recordLabel: 'RX-2026-0043', action: 'StatusChanged', field: 'status', oldValue: 'Draft', newValue: 'InReview', performedBy: 'James Rivera', performedOn: '2026-02-03T11:00:00Z' },
  { id: 'a-012', recordId: 'br-002', recordLabel: 'RX-2026-0043', action: 'Signed', field: 'signature', newValue: 'Approved by Dr. Emily Watson', performedBy: 'Dr. Emily Watson', performedOn: '2026-02-05T11:20:00Z' },
  { id: 'a-013', recordId: 'br-002', recordLabel: 'RX-2026-0043', action: 'StatusChanged', field: 'status', oldValue: 'InReview', newValue: 'Approved', performedBy: 'Dr. Emily Watson', performedOn: '2026-02-05T11:20:00Z' },

  // br-003
  { id: 'a-014', recordId: 'br-003', recordLabel: 'RX-2026-0044', action: 'Created', performedBy: 'Sarah Chen', performedOn: '2026-03-10T06:15:00Z' },
  { id: 'a-015', recordId: 'br-003', recordLabel: 'RX-2026-0044', action: 'Updated', field: 'quantity', oldValue: '90000', newValue: '100000', performedBy: 'Sarah Chen', performedOn: '2026-03-10T07:00:00Z' },
  { id: 'a-016', recordId: 'br-003', recordLabel: 'RX-2026-0044', action: 'Signed', field: 'signature', newValue: 'Reviewed by James Rivera', performedBy: 'James Rivera', performedOn: '2026-03-12T09:00:00Z' },
  { id: 'a-017', recordId: 'br-003', recordLabel: 'RX-2026-0044', action: 'StatusChanged', field: 'status', oldValue: 'Draft', newValue: 'InReview', performedBy: 'James Rivera', performedOn: '2026-03-12T09:00:00Z' },

  // br-004
  { id: 'a-018', recordId: 'br-004', recordLabel: 'RX-2026-0045', action: 'Created', performedBy: 'Sarah Chen', performedOn: '2026-03-20T08:30:00Z' },
  { id: 'a-019', recordId: 'br-004', recordLabel: 'RX-2026-0045', action: 'Updated', field: 'description', oldValue: 'Omeprazole capsules', newValue: 'Delayed-release omeprazole capsules. 30-count bottles.', performedBy: 'Sarah Chen', performedOn: '2026-03-20T10:15:00Z' },

  // br-005 (Rejected)
  { id: 'a-020', recordId: 'br-005', recordLabel: 'RX-2026-0046', action: 'Created', performedBy: 'Sarah Chen', performedOn: '2026-02-15T07:20:00Z' },
  { id: 'a-021', recordId: 'br-005', recordLabel: 'RX-2026-0046', action: 'Signed', field: 'signature', newValue: 'Reviewed by James Rivera', performedBy: 'James Rivera', performedOn: '2026-02-18T10:00:00Z' },
  { id: 'a-022', recordId: 'br-005', recordLabel: 'RX-2026-0046', action: 'StatusChanged', field: 'status', oldValue: 'Draft', newValue: 'InReview', performedBy: 'James Rivera', performedOn: '2026-02-18T10:00:00Z' },
  { id: 'a-023', recordId: 'br-005', recordLabel: 'RX-2026-0046', action: 'Signed', field: 'signature', newValue: 'Rejected by Dr. Emily Watson', performedBy: 'Dr. Emily Watson', performedOn: '2026-02-20T16:45:00Z' },
  { id: 'a-024', recordId: 'br-005', recordLabel: 'RX-2026-0046', action: 'StatusChanged', field: 'status', oldValue: 'InReview', newValue: 'Rejected', performedBy: 'Dr. Emily Watson', performedOn: '2026-02-20T16:45:00Z' },

  // br-006
  { id: 'a-025', recordId: 'br-006', recordLabel: 'RX-2026-0047', action: 'Created', performedBy: 'Sarah Chen', performedOn: '2026-03-22T06:10:00Z' },

  // br-007
  { id: 'a-026', recordId: 'br-007', recordLabel: 'RX-2026-0048', action: 'Created', performedBy: 'Sarah Chen', performedOn: '2026-03-05T08:20:00Z' },
  { id: 'a-027', recordId: 'br-007', recordLabel: 'RX-2026-0048', action: 'Signed', field: 'signature', newValue: 'Reviewed by James Rivera', performedBy: 'James Rivera', performedOn: '2026-03-08T10:30:00Z' },
  { id: 'a-028', recordId: 'br-007', recordLabel: 'RX-2026-0048', action: 'StatusChanged', field: 'status', oldValue: 'Draft', newValue: 'InReview', performedBy: 'James Rivera', performedOn: '2026-03-08T10:30:00Z' },

  // br-008 (Released)
  { id: 'a-029', recordId: 'br-008', recordLabel: 'RX-2026-0049', action: 'Created', performedBy: 'Sarah Chen', performedOn: '2026-01-25T07:15:00Z' },
  { id: 'a-030', recordId: 'br-008', recordLabel: 'RX-2026-0049', action: 'Signed', field: 'signature', newValue: 'Reviewed by James Rivera', performedBy: 'James Rivera', performedOn: '2026-01-27T11:00:00Z' },
  { id: 'a-031', recordId: 'br-008', recordLabel: 'RX-2026-0049', action: 'StatusChanged', field: 'status', oldValue: 'Draft', newValue: 'InReview', performedBy: 'James Rivera', performedOn: '2026-01-27T11:00:00Z' },
  { id: 'a-032', recordId: 'br-008', recordLabel: 'RX-2026-0049', action: 'Signed', field: 'signature', newValue: 'Approved by Dr. Emily Watson', performedBy: 'Dr. Emily Watson', performedOn: '2026-01-29T14:00:00Z' },
  { id: 'a-033', recordId: 'br-008', recordLabel: 'RX-2026-0049', action: 'StatusChanged', field: 'status', oldValue: 'InReview', newValue: 'Approved', performedBy: 'Dr. Emily Watson', performedOn: '2026-01-29T14:00:00Z' },
  { id: 'a-034', recordId: 'br-008', recordLabel: 'RX-2026-0049', action: 'Signed', field: 'signature', newValue: 'Verified by Sarah Chen', performedBy: 'Sarah Chen', performedOn: '2026-01-30T09:00:00Z' },
  { id: 'a-035', recordId: 'br-008', recordLabel: 'RX-2026-0049', action: 'StatusChanged', field: 'status', oldValue: 'Approved', newValue: 'Released', performedBy: 'Sarah Chen', performedOn: '2026-01-30T15:00:00Z' },
];

// ── Compliance Requirements ────────────────────────────

export const COMPLIANCE_REQUIREMENTS: ComplianceRequirement[] = [
  {
    id: 'c-01',
    section: '§ 11.10(a)',
    title: 'System Validation',
    description: 'Systems shall be validated to ensure accuracy, reliability, consistent intended performance, and the ability to discern invalid or altered records.',
    status: 'Met',
    implementation: 'Dataverse provides a validated cloud platform with SOC 2 Type II compliance. Application-level validation is enforced through form validation rules and business logic.',
  },
  {
    id: 'c-02',
    section: '§ 11.10(b)',
    title: 'Record Copies',
    description: 'The ability to generate accurate and complete copies of records in both human readable and electronic form.',
    status: 'Met',
    implementation: 'Records can be exported to PDF or CSV format. Dataverse provides native data export capabilities including audit history.',
  },
  {
    id: 'c-03',
    section: '§ 11.10(c)',
    title: 'Record Retention',
    description: 'Protection of records to enable their accurate and ready retrieval throughout the records retention period.',
    status: 'Met',
    implementation: 'Dataverse provides enterprise-grade data storage with automatic backups, geo-redundancy, and configurable retention policies.',
  },
  {
    id: 'c-04',
    section: '§ 11.10(d)',
    title: 'System Access Control',
    description: 'Limiting system access to authorized individuals.',
    status: 'Met',
    implementation: 'Microsoft Entra ID provides authentication. Dataverse security roles and field-level security restrict access to authorized personnel only.',
  },
  {
    id: 'c-05',
    section: '§ 11.10(e)',
    title: 'Audit Trail',
    description: 'Computer-generated, time-stamped audit trails to independently record the date and time of operator entries and actions.',
    status: 'Met',
    implementation: 'Dataverse provides built-in audit logging that captures all record changes with timestamps, user identity, old/new values, and is immutable.',
  },
  {
    id: 'c-06',
    section: '§ 11.10(g)',
    title: 'Authority Checks',
    description: 'Use of authority checks to ensure that only authorized individuals can use the system, electronically sign, access operations, or device input/output.',
    status: 'Met',
    implementation: 'Role-based access control (Operator, Reviewer, QA Approver) enforces authority checks. Signature authority is mapped to user roles.',
  },
  {
    id: 'c-07',
    section: '§ 11.10(k)',
    title: 'Documentation Controls',
    description: 'Adequate controls over the distribution of, access to, and use of documentation for system operation and maintenance.',
    status: 'Met',
    implementation: 'SOPs and system documentation are maintained as Dataverse records with version control and access restrictions.',
  },
  {
    id: 'c-08',
    section: '§ 11.50',
    title: 'Signature Manifestation',
    description: 'Signed electronic records shall contain the printed name, date/time of signing, and meaning of the signature (review, approval, etc.).',
    status: 'Met',
    implementation: 'Electronic signatures capture signer name, role, timestamp, and meaning (Reviewed, Approved, Verified, Rejected) with a required reason field.',
  },
  {
    id: 'c-09',
    section: '§ 11.100',
    title: 'General E-Signature Requirements',
    description: 'Each electronic signature shall be unique to one individual and shall not be reused or reassigned.',
    status: 'Met',
    implementation: 'Signatures are linked to Microsoft Entra ID identities. Re-authentication is required at signing time to prevent unauthorized use.',
  },
  {
    id: 'c-10',
    section: '§ 11.200',
    title: 'Electronic Signature Components',
    description: 'Electronic signatures not based on biometrics shall employ at least two distinct identification components (e.g., user ID and password).',
    status: 'Met',
    implementation: 'Microsoft Entra ID provides multi-factor authentication. Signing requires re-entry of credentials to confirm identity.',
  },
];
