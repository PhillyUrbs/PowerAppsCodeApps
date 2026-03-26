export type ComplianceStatus = 'Met' | 'Partial' | 'NotMet';

export interface ComplianceRequirement {
  id: string;
  section: string;
  title: string;
  description: string;
  status: ComplianceStatus;
  implementation: string;
}
