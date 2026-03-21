import {
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  OverlayDrawer,
  Badge,
  Text,
  Divider,
  tokens,
  Button,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
import type { MonthFeature } from '../types/index.ts';
import { RING_COLORS } from '../types/index.ts';

interface FeatureDetailPanelProps {
  monthFeature: MonthFeature | null;
  open: boolean;
  onClose: () => void;
}

export function FeatureDetailPanel({ monthFeature, open, onClose }: FeatureDetailPanelProps) {
  if (!monthFeature) return null;
  const { feature, ring } = monthFeature;

  return (
    <OverlayDrawer
      open={open}
      onOpenChange={(_e, data) => { if (!data.open) onClose(); }}
      position="end"
      size="medium"
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              icon={<DismissRegular />}
              onClick={onClose}
              aria-label="Close"
            />
          }
        >
          {feature.title}
        </DrawerHeaderTitle>
      </DrawerHeader>

      <DrawerBody>
        <div style={{ display: 'flex', gap: tokens.spacingHorizontalS, marginBottom: tokens.spacingVerticalM }}>
          <Badge
            appearance="filled"
            color="informative"
            style={{ backgroundColor: RING_COLORS[ring] ?? tokens.colorBrandBackground }}
          >
            {ring}
          </Badge>
          <Badge
            appearance="outline"
            color={feature.source === 'M365' ? 'brand' : 'informative'}
          >
            {feature.source}
          </Badge>
          <Badge appearance="outline" color="subtle">
            {feature.status}
          </Badge>
        </div>

        <Divider style={{ marginBottom: tokens.spacingVerticalM }} />

        <Text block style={{ marginBottom: tokens.spacingVerticalM, lineHeight: '1.6' }}>
          {stripHtml(feature.description)}
        </Text>

        {feature.products.length > 0 && (
          <Section title="Products">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS }}>
              {feature.products.map((p) => (
                <Badge key={p} appearance="outline" size="small">{p}</Badge>
              ))}
            </div>
          </Section>
        )}

        {feature.availabilities.length > 0 && (
          <Section title="Timeline">
            {feature.availabilities.map((a, i) => (
              <Text key={i} block size={300}>
                {a.ring}: {a.month} {a.year}
              </Text>
            ))}
          </Section>
        )}

        {feature.cloudInstances.length > 0 && (
          <Section title="Cloud Instances">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS }}>
              {feature.cloudInstances.map((c) => (
                <Badge key={c} appearance="outline" size="small">{c}</Badge>
              ))}
            </div>
          </Section>
        )}

        {feature.platforms.length > 0 && (
          <Section title="Platforms">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS }}>
              {feature.platforms.map((p) => (
                <Badge key={p} appearance="outline" size="small">{p}</Badge>
              ))}
            </div>
          </Section>
        )}

        {feature.productCategories.length > 0 && (
          <Section title="Categories">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS }}>
              {feature.productCategories.map((c) => (
                <Badge key={c} appearance="outline" size="small">{c}</Badge>
              ))}
            </div>
          </Section>
        )}
      </DrawerBody>
    </OverlayDrawer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: tokens.spacingVerticalM }}>
      <Text weight="semibold" size={300} block style={{ marginBottom: tokens.spacingVerticalXS }}>
        {title}
      </Text>
      {children}
    </div>
  );
}

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent ?? '';
}
