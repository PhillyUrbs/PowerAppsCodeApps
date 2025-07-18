/**
 * SqlPage Component - Displays SQL Database connector example with sortable DataGrid
 */
import React, { useMemo, useState } from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridCell,
  DataGridBody,
  TableColumnDefinition,
  TableRowId,
  Badge,
  Card,
  Text,
  Input,
  makeStyles,
  shorthands,
  tokens,
  MessageBar,
} from '@fluentui/react-components';
import { DatabaseRegular, SearchRegular } from '@fluentui/react-icons';
import PageHeader from '../components/PageHeader';

// String formatting utility for localizable messages
const formatMessage = (template: string, params: Record<string, string | number> = {}): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = params[key];
    return value !== undefined ? String(value) : match;
  });
};

// Common UI messages
const MESSAGE_STRINGS = {
  NO_DATA: 'No data found.',
  PROJECT_COUNTER_SINGLE: 'Showing {count} project',
  PROJECT_COUNTER_PLURAL: 'Showing {count} projects',
  COLUMN_PROJECT_NAME: 'Project Name',
  COLUMN_DESCRIPTION: 'Description',
  COLUMN_START_DATE: 'Start Date',
  COLUMN_END_DATE: 'End Date',
  COLUMN_STATUS: 'Status',
  COLUMN_PRIORITY: 'Priority',
  COLUMN_BUDGET: 'Budget',
  ARIA_LABEL_DATA_GRID: 'Projects data grid',
  SEARCH_PLACEHOLDER: 'Search projects...',
} as const;

// Project data type matching the SQL schema
type ProjectItem = {
  ProjectId: number;
  Name: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  Status: string;
  Priority: string;
  Budget: number;
  TeamSize: number;
  OwnerId: number;
};

// Styles
const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  section: {
    marginBottom: '32px',
  },
  searchContainer: {
    marginBottom: '16px',
  },
  searchBox: {
    maxWidth: '400px',
    width: '100%',
  },
  projectCounter: {
    marginBottom: tokens.spacingVerticalM,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  dataGrid: {
    width: '100%',
  },
  badge: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    textTransform: 'capitalize',
  },
  infoCard: {
    ...shorthands.padding('20px'),
    backgroundColor: tokens.colorNeutralBackground2,
    marginTop: '32px',
  },
  messageBar: {
    marginBottom: tokens.spacingVerticalXL,
    textAlign: 'center',
  },
});

// Badge component for Priority
const PriorityBadge: React.FC<{ priority: string }> = React.memo(({ priority }) => {
  const styles = useStyles();
  const badgeProps = useMemo(() => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return { appearance: 'filled' as const, color: 'danger' as const };
      case 'high':
        return { appearance: 'filled' as const, color: 'important' as const };
      case 'medium':
        return { appearance: 'filled' as const, color: 'warning' as const };
      case 'low':
        return { appearance: 'filled' as const, color: 'success' as const };
      default:
        return { appearance: 'outline' as const, color: 'subtle' as const };
    }
  }, [priority]);

  return (
    <Badge {...badgeProps} className={styles.badge}>
      {priority || 'Unknown'}
    </Badge>
  );
});

PriorityBadge.displayName = 'PriorityBadge';

// Badge component for Status
const StatusBadge: React.FC<{ status: string }> = React.memo(({ status }) => {
  const styles = useStyles();
  const badgeProps = useMemo(() => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { appearance: 'filled' as const, color: 'success' as const };
      case 'active':
        return { appearance: 'filled' as const, color: 'brand' as const };
      case 'planning':
        return { appearance: 'filled' as const, color: 'informative' as const };
      case 'on hold':
        return { appearance: 'filled' as const, color: 'warning' as const };
      case 'cancelled':
        return { appearance: 'filled' as const, color: 'danger' as const };
      default:
        return { appearance: 'outline' as const, color: 'subtle' as const };
    }
  }, [status]);

  return (
    <Badge {...badgeProps} className={styles.badge}>
      {status || 'Unknown'}
    </Badge>
  );
});

StatusBadge.displayName = 'StatusBadge';

// DataGrid columns
const COLUMNS: TableColumnDefinition<ProjectItem>[] = [
  {
    columnId: 'name',
    compare: (a, b) => a.Name.localeCompare(b.Name),
    renderHeaderCell: () => MESSAGE_STRINGS.COLUMN_PROJECT_NAME,
    renderCell: (item) => item.Name,
  },
  {
    columnId: 'description',
    compare: (a, b) => a.Description.localeCompare(b.Description),
    renderHeaderCell: () => MESSAGE_STRINGS.COLUMN_DESCRIPTION,
    renderCell: (item) => (
      <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {item.Description}
      </div>
    ),
  },
  {
    columnId: 'startDate',
    compare: (a, b) => new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime(),
    renderHeaderCell: () => MESSAGE_STRINGS.COLUMN_START_DATE,
    renderCell: (item) => new Date(item.StartDate).toLocaleDateString(),
  },
  {
    columnId: 'endDate',
    compare: (a, b) => new Date(a.EndDate).getTime() - new Date(b.EndDate).getTime(),
    renderHeaderCell: () => MESSAGE_STRINGS.COLUMN_END_DATE,
    renderCell: (item) => new Date(item.EndDate).toLocaleDateString(),
  },
  {
    columnId: 'status',
    compare: (a, b) => a.Status.localeCompare(b.Status),
    renderHeaderCell: () => MESSAGE_STRINGS.COLUMN_STATUS,
    renderCell: (item) => <StatusBadge status={item.Status} />,
  },
  {
    columnId: 'priority',
    compare: (a, b) => a.Priority.localeCompare(b.Priority),
    renderHeaderCell: () => MESSAGE_STRINGS.COLUMN_PRIORITY,
    renderCell: (item) => <PriorityBadge priority={item.Priority} />,
  },
  {
    columnId: 'budget',
    compare: (a, b) => a.Budget - b.Budget,
    renderHeaderCell: () => MESSAGE_STRINGS.COLUMN_BUDGET,
    renderCell: (item) => `$${item.Budget.toLocaleString()}`,
  },
];

// Row ID generator
const getRowId = (item: ProjectItem): TableRowId => item.ProjectId.toString();

// Project counter component
const ProjectCounter: React.FC<{ count: number }> = ({ count }) => {
  const styles = useStyles();

  const counterMessage = useMemo(() => {
    return count === 1
      ? formatMessage(MESSAGE_STRINGS.PROJECT_COUNTER_SINGLE, { count })
      : formatMessage(MESSAGE_STRINGS.PROJECT_COUNTER_PLURAL, { count });
  }, [count]);

  return (
    <div className={styles.projectCounter}>
      {counterMessage}
    </div>
  );
};

// Empty state component
const EmptyState: React.FC = () => {
  const styles = useStyles();
  return (
    <MessageBar intent="info" className={styles.messageBar}>
      {MESSAGE_STRINGS.NO_DATA}
    </MessageBar>
  );
};

// Main component
const SqlPage: React.FC = () => {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: Replace with actual SQL data from Power Apps SDK
  const allProjects = useMemo(() => [
    {
      ProjectId: 1,
      Name: "Website Redesign",
      Description: "Complete overhaul of company website with modern design and improved user experience",
      StartDate: "2024-01-15",
      EndDate: "2024-06-30",
      Status: "Active",
      Priority: "High",
      Budget: 75000,
      TeamSize: 5,
      OwnerId: 101
    },
    {
      ProjectId: 2,
      Name: "Mobile App Development",
      Description: "Native mobile application for iOS and Android platforms",
      StartDate: "2024-03-01",
      EndDate: "2024-09-15",
      Status: "Planning",
      Priority: "Critical",
      Budget: 120000,
      TeamSize: 8,
      OwnerId: 102
    },
    {
      ProjectId: 3,
      Name: "Database Migration",
      Description: "Migrate legacy database to cloud infrastructure",
      StartDate: "2024-02-01",
      EndDate: "2024-05-30",
      Status: "Completed",
      Priority: "Medium",
      Budget: 45000,
      TeamSize: 3,
      OwnerId: 103
    },
    {
      ProjectId: 4,
      Name: "Security Audit",
      Description: "Comprehensive security assessment and vulnerability testing",
      StartDate: "2024-04-01",
      EndDate: "2024-07-15",
      Status: "On Hold",
      Priority: "High",
      Budget: 30000,
      TeamSize: 2,
      OwnerId: 104
    },
    {
      ProjectId: 5,
      Name: "AI Integration",
      Description: "Integrate machine learning capabilities into existing systems",
      StartDate: "2024-05-01",
      EndDate: "2024-12-31",
      Status: "Planning",
      Priority: "Low",
      Budget: 95000,
      TeamSize: 6,
      OwnerId: 105
    }
  ], []);

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return allProjects;
    
    return allProjects.filter((project: ProjectItem) =>
      project.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.Status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.Priority.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allProjects]);

  const projectCount = useMemo(() => filteredProjects.length, [filteredProjects.length]);

  const dataGridProps = useMemo(() => ({
    items: filteredProjects,
    columns: COLUMNS,
    sortable: true,
    getRowId,
    focusMode: "cell" as const,
    className: styles.dataGrid,
    "aria-label": MESSAGE_STRINGS.ARIA_LABEL_DATA_GRID,
  }), [filteredProjects, styles.dataGrid]);

  return (
    <div className={styles.container}>
      <PageHeader
        title="SQL Database Connector Example"
        subtitle="This page demonstrates SQL connector integration with sortable data grids and search functionality. Currently using mock data - use GitHub Copilot to help convert to live SQL database connections."
        icon={<DatabaseRegular />}
      />

      {/* Information Note */}
      <Card style={{ padding: '16px', backgroundColor: tokens.colorNeutralBackground2, marginBottom: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300, display: 'block', marginBottom: '8px', fontSize: tokens.fontSizeBase200 }}>
            💡 Ask Copilot to convert to live SQL Database Connector
          </Text>
          <Text style={{ color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300, fontSize: tokens.fontSizeBase100 }}>
            📚 For more information, check out our{' '}
            <a 
              href="https://github.com/microsoft/PowerAppsCodeApps/blob/FluentSample/docs/how-to-connect-to-azure-sql.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                color: tokens.colorBrandForeground1, 
                textDecoration: 'none',
                fontWeight: tokens.fontWeightSemibold
              }}
            >
              Azure SQL setup guide
            </a> 🔗
          </Text>
        </div>
      </Card>

      {/* Search and DataGrid */}
      <section className={styles.section}>
        <div className={styles.searchContainer}>
          <Input
            className={styles.searchBox}
            placeholder={MESSAGE_STRINGS.SEARCH_PLACEHOLDER}
            contentBefore={<SearchRegular />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ProjectCounter count={projectCount} />

        {/* DataGrid */}
        {projectCount > 0 ? (
          <DataGrid {...dataGridProps}>
            <DataGridHeader>
              <DataGridRow>
                {({ renderHeaderCell }) => (
                  <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                )}
              </DataGridRow>
            </DataGridHeader>
            <DataGridBody<ProjectItem>>
              {({ item, rowId }) => (
                <DataGridRow<ProjectItem> key={rowId}>
                  {({ renderCell }) => (
                    <DataGridCell>{renderCell(item)}</DataGridCell>
                  )}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* Integration Note */}
      <Card className={styles.infoCard}>
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300, display: 'block', marginBottom: '12px' }}>
            💡 <strong>Ready for production data</strong> - This DataGrid structure matches the SQL schema from our Azure SQL guide
          </Text>
          <Text style={{ color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300, fontSize: tokens.fontSizeBase200 }}>
            🚀 Use our{' '}
            <a 
              href="https://github.com/microsoft/PowerAppsCodeApps/blob/FluentSample/SAMPLE-DATA-GENERATOR.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                color: tokens.colorBrandForeground1, 
                textDecoration: 'none',
                fontWeight: tokens.fontWeightSemibold
              }}
            >
              sample data generator
            </a>{' '}
            to create 5,000 test records for realistic performance testing 📊
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default SqlPage;
