import { Badge } from '@fluentui/react-components';
import type { BatchStatus } from '../types/batch-record';

const STATUS_CONFIG: Record<BatchStatus, { color: 'informative' | 'warning' | 'success' | 'brand' | 'danger'; label: string }> = {
  Draft: { color: 'informative', label: 'Draft' },
  InReview: { color: 'warning', label: 'In Review' },
  Approved: { color: 'success', label: 'Approved' },
  Released: { color: 'brand', label: 'Released' },
  Rejected: { color: 'danger', label: 'Rejected' },
};

export function StatusBadge({ status }: { status: BatchStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge appearance="filled" color={config.color} shape="rounded">
      {config.label}
    </Badge>
  );
}
