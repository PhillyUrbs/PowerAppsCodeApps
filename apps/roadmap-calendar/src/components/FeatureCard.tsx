import {
  Badge,
  Text,
  tokens,
} from '@fluentui/react-components';
import type { MonthFeature } from '../types/index.ts';
import { RING_COLORS } from '../types/index.ts';

interface FeatureCardProps {
  monthFeature: MonthFeature;
  onClick: () => void;
}

export function FeatureCard({ monthFeature, onClick }: FeatureCardProps) {
  const { feature, ring } = monthFeature;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalXS,
        padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalXS}`,
        borderRadius: tokens.borderRadiusMedium,
        cursor: 'pointer',
        minHeight: '24px',
      }}
    >
      <Badge
        size="tiny"
        appearance="filled"
        color="informative"
        style={{
          backgroundColor: RING_COLORS[ring] ?? tokens.colorBrandBackground,
          flexShrink: 0,
        }}
      />
      <Text
        size={200}
        truncate
        wrap={false}
        style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {feature.title}
      </Text>
      <Badge
        size="tiny"
        appearance="outline"
        color={feature.source === 'M365' ? 'brand' : 'informative'}
        style={{ flexShrink: 0 }}
      >
        {feature.source}
      </Badge>
    </div>
  );
}
