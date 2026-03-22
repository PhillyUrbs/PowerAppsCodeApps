import { tokens } from '@fluentui/react-components';
import type { MonthFeature } from '../types/index.ts';
import { MonthCell } from './MonthCell.tsx';
import { getMonthName } from '../api/useRoadmapData.ts';

interface CalendarGridProps {
  year: number;
  monthData: Map<number, MonthFeature[]>;
  onFeatureClick: (feature: MonthFeature) => void;
  onMonthClick: (month: number) => void;
}

export function CalendarGrid({ year, monthData, onFeatureClick, onMonthClick }: CalendarGridProps) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: tokens.spacingHorizontalM,
      padding: tokens.spacingHorizontalM,
    }}>
      {months.map((month) => (
        <MonthCell
          key={`${year}-${month}`}
          month={month}
          monthName={getMonthName(month)}
          features={monthData.get(month) ?? []}
          onFeatureClick={onFeatureClick}
          onMonthClick={onMonthClick}
        />
      ))}
    </div>
  );
}
