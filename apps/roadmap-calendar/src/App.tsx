import { useState, useMemo } from 'react';
import {
  Spinner,
  Text,
  tokens,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import { YearNavigation } from './components/YearNavigation.tsx';
import { CalendarGrid } from './components/CalendarGrid.tsx';
import { FilterPanel } from './components/FilterPanel.tsx';
import { FeatureDetailPanel } from './components/FeatureDetailPanel.tsx';
import { MonthDetailDialog } from './components/MonthDetailDialog.tsx';
import { useRoadmapFeatures, groupFeaturesByMonth, getUniqueValues, getMonthName } from './api/useRoadmapData.ts';
import type { FilterState, MonthFeature } from './types/index.ts';
import { DEFAULT_FILTERS } from './types/index.ts';

const APP_VERSION = 'v1.0.0';

function App() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedFeature, setSelectedFeature] = useState<MonthFeature | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  const { data: features, isLoading, error } = useRoadmapFeatures();

  const uniqueValues = useMemo(
    () => features ? getUniqueValues(features, filters) : { products: [], cloudInstances: [], productCategories: [], rings: [] },
    [features, filters],
  );

  const monthData = useMemo(
    () => features ? groupFeaturesByMonth(features, year, filters) : new Map(),
    [features, year, filters],
  );

  const totalFiltered = useMemo(() => {
    let count = 0;
    for (const bucket of monthData.values()) {
      count += bucket.length;
    }
    return count;
  }, [monthData]);

  const handleFeatureClick = (mf: MonthFeature) => {
    setSelectedFeature(mf);
    setDetailOpen(true);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: tokens.colorNeutralBackground1,
      color: tokens.colorNeutralForeground1,
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
      }}>
        <Text weight="semibold" size={500}>Microsoft Roadmap Calendar</Text>
        <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>{APP_VERSION}</Text>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Filter sidebar */}
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          availableRings={uniqueValues.rings}
          availableProducts={uniqueValues.products}
          availableCloudInstances={uniqueValues.cloudInstances}
          availableProductCategories={uniqueValues.productCategories}
        />

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <YearNavigation year={year} onYearChange={setYear} />

          {/* Stats bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: tokens.spacingHorizontalL,
            padding: `0 ${tokens.spacingHorizontalM} ${tokens.spacingVerticalS}`,
          }}>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              {isLoading ? 'Loading...' : `${features?.length ?? 0} total features`}
            </Text>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              {totalFiltered} shown in {year}
            </Text>
          </div>

          {error && (
            <MessageBar intent="error" style={{ margin: tokens.spacingHorizontalM }}>
              <MessageBarBody>
                Failed to load roadmap data: {error instanceof Error ? error.message : 'Unknown error'}
              </MessageBarBody>
            </MessageBar>
          )}

          {isLoading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
              <Spinner size="large" label="Loading roadmap features..." />
            </div>
          ) : (
            <CalendarGrid
              year={year}
              monthData={monthData}
              onFeatureClick={handleFeatureClick}
              onMonthClick={(month) => setExpandedMonth(month)}
            />
          )}
        </div>
      </div>

      <FeatureDetailPanel
        monthFeature={selectedFeature}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />

      <MonthDetailDialog
        open={expandedMonth !== null}
        onClose={() => setExpandedMonth(null)}
        monthName={expandedMonth !== null ? getMonthName(expandedMonth) : ''}
        year={year}
        features={expandedMonth !== null ? (monthData.get(expandedMonth) ?? []) : []}
        onFeatureClick={(mf) => { handleFeatureClick(mf); }}
        detailDrawerOpen={detailOpen}
      />
    </div>
  );
}

export default App;
