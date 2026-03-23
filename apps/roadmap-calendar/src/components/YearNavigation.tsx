import {
  Button,
  Title1,
  tokens,
} from '@fluentui/react-components';
import {
  ChevronLeftRegular,
  ChevronRightRegular,
} from '@fluentui/react-icons';

interface YearNavigationProps {
  year: number;
  onYearChange: (year: number) => void;
}

export function YearNavigation({ year, onYearChange }: YearNavigationProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacingHorizontalL,
      padding: tokens.spacingVerticalM,
    }}>
      <Button
        icon={<ChevronLeftRegular />}
        appearance="subtle"
        onClick={() => onYearChange(year - 1)}
        aria-label="Previous year"
      />
      <Title1>{year}</Title1>
      <Button
        icon={<ChevronRightRegular />}
        appearance="subtle"
        onClick={() => onYearChange(year + 1)}
        aria-label="Next year"
      />
    </div>
  );
}
