import { useRef, useEffect, useCallback } from 'react';
import {
  Badge,
  Text,
  Button,
  tokens,
  Divider,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
import type { MonthFeature } from '../types/index.ts';
import { RING_COLORS } from '../types/index.ts';

interface MonthDetailDialogProps {
  open: boolean;
  onClose: () => void;
  monthName: string;
  year: number;
  features: MonthFeature[];
  onFeatureClick: (feature: MonthFeature) => void;
  detailDrawerOpen: boolean;
}

export function MonthDetailDialog({
  open,
  onClose,
  monthName,
  year,
  features,
  onFeatureClick,
  detailDrawerOpen,
}: MonthDetailDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const stableOnClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;

    function handleMouseDown(e: MouseEvent) {
      // Don't close if the feature detail drawer is open
      if (detailDrawerOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        stableOnClose();
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') stableOnClose();
    }

    // requestAnimationFrame so the listener is added after the click that opened the panel
    const rafId = requestAnimationFrame(() => {
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('keydown', handleEscape);
    });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, stableOnClose, detailDrawerOpen]);

  if (!open) return null;

  // Sort by first product name, then by title
  const sorted = [...features].sort((a, b) => {
    const aProd = a.feature.products[0] ?? '';
    const bProd = b.feature.products[0] ?? '';
    const prodCmp = aProd.localeCompare(bProd);
    if (prodCmp !== 0) return prodCmp;
    return a.feature.title.localeCompare(b.feature.title);
  });

  // Group by primary product
  const byProduct = new Map<string, MonthFeature[]>();
  for (const mf of sorted) {
    const prod = mf.feature.products[0] ?? 'Other';
    const bucket = byProduct.get(prod) ?? [];
    bucket.push(mf);
    byProduct.set(prod, bucket);
  }

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        top: '5vh',
        bottom: '5vh',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '720px',
        maxWidth: 'calc(100vw - 300px)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: tokens.colorNeutralBackground1,
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        borderRadius: tokens.borderRadiusXLarge,
        boxShadow: tokens.shadow64,
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        flexShrink: 0,
      }}>
        <Text weight="semibold" size={500}>
          {monthName} {year} — {features.length} features
        </Text>
        <Button
          appearance="subtle"
          icon={<DismissRegular />}
          onClick={onClose}
          aria-label="Close"
        />
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
      }}>
        {features.length === 0 && (
          <Text style={{ color: tokens.colorNeutralForeground4, fontStyle: 'italic' }}>
            No features this month
          </Text>
        )}
        {[...byProduct.entries()].map(([product, items]) => (
          <div key={product} style={{ marginBottom: tokens.spacingVerticalM }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, marginBottom: tokens.spacingVerticalXS }}>
              <Text weight="semibold" size={300}>{product}</Text>
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                {items.length}
              </Text>
            </div>
            <Divider style={{ marginBottom: tokens.spacingVerticalXS }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS }}>
              {items.map((mf) => (
                <MonthDetailRow
                  key={`${mf.feature.id}-${mf.ring}`}
                  monthFeature={mf}
                  onClick={() => onFeatureClick(mf)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthDetailRow({ monthFeature, onClick }: { monthFeature: MonthFeature; onClick: () => void }) {
  const { feature, ring } = monthFeature;
  const productLabel = feature.products.length > 0
    ? feature.products.slice(0, 3).join(', ') + (feature.products.length > 3 ? ` +${feature.products.length - 3}` : '')
    : '';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
        padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
        borderRadius: tokens.borderRadiusMedium,
        cursor: 'pointer',
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
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text size={300} block>
          {feature.title}
        </Text>
        {productLabel && (
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }} block>
            {productLabel}
          </Text>
        )}
      </div>
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
