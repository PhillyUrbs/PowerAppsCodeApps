export type SignatureMeaning = 'Reviewed' | 'Approved' | 'Verified' | 'Rejected';
export type SignatureType = 'Doer' | 'Witness';

export interface ElectronicSignature {
  id: string;
  recordId: string;
  stepNumber: number;
  signatureType: SignatureType;
  signerName: string;
  signerRole: string;
  meaning: SignatureMeaning;
  reason: string;
  signedOn: string;
}

/** Which roles can apply which signature meanings */
export const SIGNATURE_AUTHORITY: Record<string, SignatureMeaning[]> = {
  Operator: ['Verified'],
  Reviewer: ['Reviewed', 'Rejected'],
  'QA Approver': ['Approved', 'Rejected'],
  Admin: ['Reviewed', 'Approved', 'Verified', 'Rejected'],
};
