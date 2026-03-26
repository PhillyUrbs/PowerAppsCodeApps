import {
  makeStyles,
  shorthands,
  Text,
  tokens,
} from '@fluentui/react-components';
import {
  AddRegular,
  EditRegular,
  PersonRegular,
  ArrowSyncRegular,
} from '@fluentui/react-icons';
import type { AuditEntry } from '../types/audit-entry';

const useStyles = makeStyles({
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    position: 'relative',
  },
  entry: {
    display: 'flex',
    gap: '12px',
    position: 'relative',
    ...shorthands.padding('8px', '0'),
  },
  line: {
    position: 'absolute',
    left: '15px',
    top: '32px',
    bottom: 0,
    width: '2px',
    backgroundColor: tokens.colorNeutralStroke2,
  },
  dot: {
    width: '32px',
    height: '32px',
    ...shorthands.borderRadius('50%'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '16px',
    zIndex: 1,
  },
  dotCreated: { backgroundColor: tokens.colorPaletteGreenBackground2, color: tokens.colorPaletteGreenForeground2 },
  dotUpdated: { backgroundColor: tokens.colorPaletteYellowBackground2, color: tokens.colorPaletteYellowForeground2 },
  dotSigned: { backgroundColor: tokens.colorPaletteBerryBackground2, color: tokens.colorPaletteBerryForeground2 },
  dotStatus: { backgroundColor: tokens.colorPaletteBlueBackground2, color: tokens.colorPaletteBlueForeground2 },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
});

const ACTION_ICONS: Record<string, React.ReactElement> = {
  Created: <AddRegular />,
  Updated: <EditRegular />,
  Signed: <PersonRegular />,
  StatusChanged: <ArrowSyncRegular />,
  Viewed: <PersonRegular />,
  Exported: <PersonRegular />,
};

function dotStyle(action: string, styles: ReturnType<typeof useStyles>) {
  switch (action) {
    case 'Created': return styles.dotCreated;
    case 'Updated': return styles.dotUpdated;
    case 'Signed': return styles.dotSigned;
    default: return styles.dotStatus;
  }
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  const styles = useStyles();

  if (entries.length === 0) {
    return <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>No audit entries.</Text>;
  }

  return (
    <div className={styles.timeline}>
      {entries.map((entry, i) => (
        <div key={entry.id} className={styles.entry}>
          {/* Vertical connector line (skip last) */}
          {i < entries.length - 1 && <div className={styles.line} />}

          <div className={`${styles.dot} ${dotStyle(entry.action, styles)}`}>
            {ACTION_ICONS[entry.action] ?? <PersonRegular />}
          </div>

          <div className={styles.body}>
            <Text size={300} weight="semibold">
              {entry.action === 'StatusChanged'
                ? `Status: ${entry.oldValue} → ${entry.newValue}`
                : entry.action === 'Updated'
                  ? `Updated ${entry.field}: "${entry.oldValue}" → "${entry.newValue}"`
                  : entry.action === 'Signed'
                    ? entry.newValue
                    : entry.action}
            </Text>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              {entry.performedBy} · {formatTimestamp(entry.performedOn)}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}
