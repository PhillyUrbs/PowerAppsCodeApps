import { useState } from 'react';
import {
  makeStyles,
  shorthands,
  Text,
  Card,
  Input,
  Select,
  Button,
  tokens,
  Spinner,
  Badge,
} from '@fluentui/react-components';
import { SearchRegular, ArrowDownloadRegular } from '@fluentui/react-icons';
import { useAuditTrail } from '../hooks/useAuditTrail';
import type { AuditAction } from '../types/audit-entry';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  toolbar: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    '& th, & td': {
      ...shorthands.padding('10px', '14px'),
      textAlign: 'left',
      ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    },
    '& th': {
      backgroundColor: tokens.colorNeutralBackground3,
      fontWeight: '600',
      fontSize: tokens.fontSizeBase200,
      color: tokens.colorNeutralForeground3,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
  infoBar: {
    ...shorthands.padding('12px', '16px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
});

const ACTION_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Actions' },
  { value: 'Created', label: 'Created' },
  { value: 'Updated', label: 'Updated' },
  { value: 'Signed', label: 'Signed' },
  { value: 'StatusChanged', label: 'Status Changed' },
];

const ACTION_BADGE_COLOR: Record<AuditAction, 'informative' | 'warning' | 'success' | 'brand' | 'danger'> = {
  Created: 'success',
  Updated: 'warning',
  Signed: 'brand',
  StatusChanged: 'informative',
  Viewed: 'informative',
  Exported: 'informative',
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function AuditTrailPage() {
  const styles = useStyles();
  const { entries, isLoading } = useAuditTrail();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = entries.filter((e) => {
    if (actionFilter !== 'all' && e.action !== actionFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.recordLabel.toLowerCase().includes(q) ||
        e.performedBy.toLowerCase().includes(q) ||
        (e.field?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner label="Loading audit trail..." /></div>;
  }

  return (
    <div className={styles.page}>
      <Text size={600} weight="bold">Audit Trail</Text>
      <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
        Computer-generated, time-stamped audit log per 21 CFR Part 11 § 11.10(e). All entries are immutable and independently recorded.
      </Text>

      <div className={styles.infoBar}>
        <Badge appearance="outline" color="informative" shape="rounded">§ 11.10(e)</Badge>
        <Text size={200}>
          This audit trail captures the date/time of all operator entries and actions that create, modify, or delete electronic records.
          Entries cannot be modified or deleted.
        </Text>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <Input
          contentBefore={<SearchRegular />}
          placeholder="Search by record, user, or field..."
          value={search}
          onChange={(_, data) => setSearch(data.value)}
          style={{ minWidth: 260 }}
        />
        <Select value={actionFilter} onChange={(_, data) => setActionFilter(data.value)}>
          {ACTION_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </Select>
        <Button icon={<ArrowDownloadRegular />} appearance="secondary">
          Export (PDF/CSV)
        </Button>
        <Text size={200} style={{ marginLeft: 'auto', color: tokens.colorNeutralForeground3 }}>
          {filtered.length} of {entries.length} entries
        </Text>
      </div>

      {/* Audit Table */}
      <Card style={{ padding: 0, overflow: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Record</th>
              <th>Field</th>
              <th>Old Value</th>
              <th>New Value</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id}>
                <td><Text size={200}>{formatDateTime(e.performedOn)}</Text></td>
                <td><Text size={300}>{e.performedBy}</Text></td>
                <td>
                  <Badge appearance="tint" color={ACTION_BADGE_COLOR[e.action]} shape="rounded" size="small">
                    {e.action}
                  </Badge>
                </td>
                <td><Text weight="semibold" size={300}>{e.recordLabel}</Text></td>
                <td><Text size={200}>{e.field ?? '—'}</Text></td>
                <td><Text size={200} style={{ color: tokens.colorPaletteRedForeground1 }}>{e.oldValue ?? '—'}</Text></td>
                <td><Text size={200} style={{ color: tokens.colorPaletteGreenForeground1 }}>{e.newValue ?? '—'}</Text></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 24 }}>
                  <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>No audit entries match your filters.</Text>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
