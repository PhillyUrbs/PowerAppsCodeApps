import {
  Card,
  CardHeader,
  Text,
  Badge,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import type { ComplianceRequirement } from '../types/compliance';

const useStyles = makeStyles({
  card: {
    ...shorthands.padding('16px'),
  },
  description: {
    marginTop: '8px',
    color: tokens.colorNeutralForeground3,
  },
  implementation: {
    marginTop: '8px',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding('10px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
});

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'danger'> = {
  Met: 'success',
  Partial: 'warning',
  NotMet: 'danger',
};

export function ComplianceCard({ req }: { req: ComplianceRequirement }) {
  const styles = useStyles();
  return (
    <Card className={styles.card}>
      <CardHeader
        header={
          <Text weight="semibold" size={300}>
            {req.section} — {req.title}
          </Text>
        }
        action={
          <Badge appearance="filled" color={STATUS_COLOR[req.status]} shape="rounded">
            {req.status}
          </Badge>
        }
      />
      <Text size={200} className={styles.description}>{req.description}</Text>
      <div className={styles.implementation}>
        <Text size={200} weight="semibold" style={{ display: 'block', marginBottom: 4 }}>
          Implementation
        </Text>
        <Text size={200}>{req.implementation}</Text>
      </div>
    </Card>
  );
}
