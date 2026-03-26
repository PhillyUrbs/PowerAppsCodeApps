export type AuditAction =
  | 'Created'
  | 'Updated'
  | 'Signed'
  | 'StatusChanged'
  | 'Viewed'
  | 'Exported';

export interface AuditEntry {
  id: string;
  recordId: string;
  recordLabel: string;
  action: AuditAction;
  field?: string;
  oldValue?: string;
  newValue?: string;
  performedBy: string;
  performedOn: string;
}
