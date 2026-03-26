import {
  makeStyles,
  shorthands,
  Text,
  Card,
  tokens,
  Badge,
} from '@fluentui/react-components';
import {
  DocumentBulletListRegular,
  ClockRegular,
  CheckmarkCircleRegular,
  PersonRegular,
  ShieldCheckmarkRegular,
} from '@fluentui/react-icons';
import { useBatchRecords } from '../hooks/useBatchRecords';
import { useAuditTrail } from '../hooks/useAuditTrail';
import { ComplianceCard } from '../components/ComplianceCard';
import { COMPLIANCE_REQUIREMENTS } from '../data/mock-data';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px',
  },
  heroIcon: {
    fontSize: '32px',
    color: tokens.colorBrandForeground1,
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  kpiCard: {
    ...shorthands.padding('20px'),
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  kpiValue: {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '1',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  complianceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '12px',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  activityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('10px', '12px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  statusBar: {
    display: 'flex',
    gap: '4px',
    height: '24px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    overflow: 'hidden',
  },
  statusSegment: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  statusLegend: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    ...shorthands.borderRadius('50%'),
  },
});

const STATUS_COLORS: Record<string, string> = {
  Draft: tokens.colorNeutralForeground3,
  InReview: tokens.colorPaletteYellowForeground1,
  Approved: tokens.colorPaletteGreenForeground1,
  Released: tokens.colorBrandForeground1,
  Rejected: tokens.colorPaletteRedForeground1,
};

const STATUS_LABELS: Record<string, string> = {
  Draft: 'Draft',
  InReview: 'In Review',
  Approved: 'Approved',
  Released: 'Released',
  Rejected: 'Rejected',
};

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function DashboardPage() {
  const styles = useStyles();
  const { records } = useBatchRecords();
  const { entries } = useAuditTrail();

  const counts = {
    total: records.length,
    pending: records.filter((r) => r.status === 'InReview').length,
    approved: records.filter((r) => r.status === 'Approved' || r.status === 'Released').length,
    draft: records.filter((r) => r.status === 'Draft').length,
  };

  // Status distribution
  const statusCounts: Record<string, number> = {};
  for (const r of records) {
    statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
  }

  const complianceMet = COMPLIANCE_REQUIREMENTS.filter((r) => r.status === 'Met').length;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <ShieldCheckmarkRegular className={styles.heroIcon} />
        <div>
          <Text size={600} weight="bold" block>FDA 21 CFR Part 11 Compliance</Text>
          <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
            Pharmaceutical Batch Record Management — Electronic Records & Signatures
          </Text>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <DocumentBulletListRegular style={{ fontSize: 24, color: tokens.colorBrandForeground1 }} />
          <Text className={styles.kpiValue}>{counts.total}</Text>
          <Text size={200}>Total Batch Records</Text>
        </Card>
        <Card className={styles.kpiCard}>
          <ClockRegular style={{ fontSize: 24, color: tokens.colorPaletteYellowForeground1 }} />
          <Text className={styles.kpiValue} style={{ color: tokens.colorPaletteYellowForeground1 }}>
            {counts.pending}
          </Text>
          <Text size={200}>Pending Review</Text>
        </Card>
        <Card className={styles.kpiCard}>
          <CheckmarkCircleRegular style={{ fontSize: 24, color: tokens.colorPaletteGreenForeground1 }} />
          <Text className={styles.kpiValue} style={{ color: tokens.colorPaletteGreenForeground1 }}>
            {counts.approved}
          </Text>
          <Text size={200}>Approved / Released</Text>
        </Card>
        <Card className={styles.kpiCard}>
          <PersonRegular style={{ fontSize: 24, color: tokens.colorBrandForeground1 }} />
          <Text className={styles.kpiValue}>{complianceMet}/{COMPLIANCE_REQUIREMENTS.length}</Text>
          <Text size={200}>Compliance Requirements Met</Text>
        </Card>
      </div>

      {/* Status Distribution Bar */}
      <Card style={{ padding: 20 }}>
        <Text weight="semibold" size={400} block style={{ marginBottom: 12 }}>Record Status Distribution</Text>
        <div className={styles.statusBar}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className={styles.statusSegment}
              style={{
                width: `${(count / records.length) * 100}%`,
                backgroundColor: STATUS_COLORS[status],
              }}
              title={`${STATUS_LABELS[status]}: ${count}`}
            />
          ))}
        </div>
        <div className={styles.statusLegend}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: STATUS_COLORS[status] }} />
              <Text size={200}>{STATUS_LABELS[status]}: {count}</Text>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <div className={styles.section}>
        <Text weight="semibold" size={400}>Recent Activity</Text>
        <div className={styles.activityList}>
          {entries.slice(0, 10).map((entry) => (
            <div key={entry.id} className={styles.activityItem}>
              <div>
                <Text size={300} weight="semibold" block>
                  {entry.action === 'StatusChanged'
                    ? `${entry.recordLabel}: ${entry.oldValue} → ${entry.newValue}`
                    : `${entry.recordLabel}: ${entry.action}`}
                  {entry.action === 'Signed' && entry.newValue ? ` — ${entry.newValue}` : ''}
                </Text>
                <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                  {entry.performedBy}
                </Text>
              </div>
              <Badge appearance="outline" shape="rounded" size="small">
                {formatTimestamp(entry.performedOn)}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className={styles.section}>
        <Text weight="semibold" size={400}>Part 11 Compliance Checklist</Text>
        <div className={styles.complianceGrid}>
          {COMPLIANCE_REQUIREMENTS.map((req) => (
            <ComplianceCard key={req.id} req={req} />
          ))}
        </div>
      </div>
    </div>
  );
}
