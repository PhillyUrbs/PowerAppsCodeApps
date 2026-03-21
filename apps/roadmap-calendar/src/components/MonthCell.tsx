import {
  Card,
  CardHeader,
  Badge,
  Text,
  tokens,
} from '@fluentui/react-components';
import type { MonthFeature } from '../types/index.ts';
import { RING_COLORS } from '../types/index.ts';
import { FeatureCard } from './FeatureCard.tsx';

interface MonthCellProps {
  month: number;
  monthName: string;
  features: MonthFeature[];
  onFeatureClick: (feature: MonthFeature) => void;
  onMonthClick: (month: number) => void;
}

const MAX_VISIBLE = 8;

export function MonthCell({ month, monthName, features, onFeatureClick, onMonthClick }: MonthCellProps) {
  const ringCounts = new Map<string, number>();
  for (const f of features) {
    ringCounts.set(f.ring, (ringCounts.get(f.ring) ?? 0) + 1);
  }

  const visibleFeatures = features.slice(0, MAX_VISIBLE);
  const hiddenCount = features.length - MAX_VISIBLE;

  return (
    <Card
      style={{
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        header={
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
            <Text
              weight="semibold"
              size={400}
              style={{ cursor: 'pointer' }}
              onClick={() => onMonthClick(month)}
            >
              {monthName}
            </Text>
            <div style={{ display: 'flex', gap: tokens.spacingHorizontalXS }}>
              {[...ringCounts.entries()].map(([ring, count]) => (
                <Badge
                  key={ring}
                  size="small"
                  appearance="filled"
                  color="informative"
                  style={{
                    backgroundColor: RING_COLORS[ring] ?? tokens.colorBrandBackground,
                  }}
                >
                  {count}
                </Badge>
              ))}
            </div>
          </div>
        }
      />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalXS,
        padding: `0 ${tokens.spacingHorizontalM}`,
        paddingBottom: tokens.spacingVerticalS,
        overflow: 'hidden',
        flex: 1,
      }}>
        {features.length === 0 && (
          <Text size={200} style={{ color: tokens.colorNeutralForeground4, fontStyle: 'italic' }}>
            No features this month
          </Text>
        )}
        {visibleFeatures.map((mf) => (
          <FeatureCard
            key={`${mf.feature.id}-${mf.ring}`}
            monthFeature={mf}
            onClick={() => onFeatureClick(mf)}
          />
        ))}
        {hiddenCount > 0 && (
          <Text
            size={200}
            style={{ color: tokens.colorNeutralForeground3, cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onClick={() => onMonthClick(month)}
            onKeyDown={(e) => { if (e.key === 'Enter') onMonthClick(month); }}
          >
            +{hiddenCount} more
          </Text>
        )}
      </div>
    </Card>
  );
}
