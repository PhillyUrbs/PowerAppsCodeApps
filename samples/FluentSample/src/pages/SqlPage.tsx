import { Text, Card, makeStyles, shorthands, tokens, Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Button, Input } from '@fluentui/react-components';
import { DatabaseRegular, SearchRegular, AddRegular, EditRegular, DeleteRegular } from '@fluentui/react-icons';
import PageHeader from '../components/PageHeader';
import PaginationComponent from '../components/PaginationComponent';
import { mockProjects, mockTasks, mockEmployees } from '../mockData/sqlData';
import { useState } from 'react';
import { usePagination } from '../hooks/usePagination';

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  section: {
    marginBottom: '32px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  sectionIcon: {
    fontSize: '20px',
    color: tokens.colorBrandForeground1,
  },
  titleText: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  searchAndActions: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    marginBottom: '16px',
  },
  searchBox: {
    minWidth: '300px',
  },
  tableContainer: {
    overflowX: 'auto',
    marginBottom: '16px',
  },
  statusBadge: {
    minWidth: '80px',
  },
  priorityBadge: {
    minWidth: '70px',
  },
  actionButtons: {
    display: 'flex',
    ...shorthands.gap('8px'),
  },
  actionButton: {
    minWidth: '32px',
    height: '32px',
  },
  mockDataBadge: {
    marginBottom: '16px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    ...shorthands.gap('16px'),
    marginBottom: '24px',
  },
  statCard: {
    ...shorthands.padding('16px'),
    textAlign: 'center',
  },
  statNumber: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
    display: 'block',
  },
  statLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
});

export default function SqlPage() {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks' | 'employees'>('projects');

  // Filter data based on search term
  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = mockTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmployees = mockEmployees.filter(employee =>
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination for projects
  const projectsPagination = usePagination({ totalItems: filteredProjects.length, initialPageSize: 10 });
  const tasksPagination = usePagination({ totalItems: filteredTasks.length, initialPageSize: 15 });
  const employeesPagination = usePagination({ totalItems: filteredEmployees.length, initialPageSize: 12 });

  // Get paged items
  const pagedProjects = projectsPagination.getPagedItems(filteredProjects);
  const pagedTasks = tasksPagination.getPagedItems(filteredTasks);
  const pagedEmployees = employeesPagination.getPagedItems(filteredEmployees);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': case 'In Progress': return 'success';
      case 'Completed': return 'brand';
      case 'Planning': case 'Not Started': return 'warning';
      case 'On Hold': case 'Blocked': return 'danger';
      default: return 'subtle';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      case 'Medium': return 'brand';
      case 'Low': return 'success';
      default: return 'subtle';
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="SQL Database Connector Example"
        subtitle="This page demonstrates SQL connector patterns with CRUD operations, data grids, pagination, and search functionality using comprehensive mock data."
        icon={<DatabaseRegular />}
      />

      <Badge className={styles.mockDataBadge} appearance="tint" color="brand">
        🎭 Using Mock Data - Replace with real SQL connectors
      </Badge>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <Text className={styles.statNumber}>{mockProjects.length}</Text>
          <Text className={styles.statLabel}>Total Projects</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text className={styles.statNumber}>{mockTasks.length}</Text>
          <Text className={styles.statLabel}>Total Tasks</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text className={styles.statNumber}>{mockEmployees.length}</Text>
          <Text className={styles.statLabel}>Team Members</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text className={styles.statNumber}>{mockProjects.filter(p => p.status === 'Active').length}</Text>
          <Text className={styles.statLabel}>Active Projects</Text>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '24px' }}>
        <Button 
          appearance={activeTab === 'projects' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('projects')}
          style={{ marginRight: '8px' }}
        >
          Projects
        </Button>
        <Button 
          appearance={activeTab === 'tasks' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('tasks')}
          style={{ marginRight: '8px' }}
        >
          Tasks
        </Button>
        <Button 
          appearance={activeTab === 'employees' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </Button>
      </div>

      {/* Search and Actions */}
      <div className={styles.searchAndActions}>
        <Input
          className={styles.searchBox}
          placeholder={`Search ${activeTab}...`}
          contentBefore={<SearchRegular />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button icon={<AddRegular />} appearance="primary">
          Add New
        </Button>
      </div>

      {/* Projects Table */}
      {activeTab === 'projects' && (
        <section className={styles.section}>
          <div className={styles.tableContainer}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Project Name</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Priority</TableHeaderCell>
                  <TableHeaderCell>Start Date</TableHeaderCell>
                  <TableHeaderCell>Budget</TableHeaderCell>
                  <TableHeaderCell>Team Size</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <Text weight="semibold">{project.name}</Text>
                        <div style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground2 }}>
                          {project.description.substring(0, 60)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={styles.statusBadge} appearance="filled" color={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={styles.priorityBadge} appearance="tint" color={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>${project.budget.toLocaleString()}</TableCell>
                    <TableCell>{project.teamSize}</TableCell>
                    <TableCell>
                      <div className={styles.actionButtons}>
                        <Button className={styles.actionButton} icon={<EditRegular />} size="small" />
                        <Button className={styles.actionButton} icon={<DeleteRegular />} size="small" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationComponent 
            paginationState={projectsPagination.paginationState}
            paginationControls={projectsPagination.paginationControls}
          />
        </section>
      )}

      {/* Tasks Table */}
      {activeTab === 'tasks' && (
        <section className={styles.section}>
          <div className={styles.tableContainer}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Task Title</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Priority</TableHeaderCell>
                  <TableHeaderCell>Due Date</TableHeaderCell>
                  <TableHeaderCell>Estimated Hours</TableHeaderCell>
                  <TableHeaderCell>Actual Hours</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <Text weight="semibold">{task.title}</Text>
                        <div style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground2 }}>
                          Project ID: {task.projectId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={styles.statusBadge} appearance="filled" color={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={styles.priorityBadge} appearance="tint" color={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{task.estimatedHours}h</TableCell>
                    <TableCell>{task.actualHours}h</TableCell>
                    <TableCell>
                      <div className={styles.actionButtons}>
                        <Button className={styles.actionButton} icon={<EditRegular />} size="small" />
                        <Button className={styles.actionButton} icon={<DeleteRegular />} size="small" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationComponent 
            paginationState={tasksPagination.paginationState}
            paginationControls={tasksPagination.paginationControls}
          />
        </section>
      )}

      {/* Employees Table */}
      {activeTab === 'employees' && (
        <section className={styles.section}>
          <div className={styles.tableContainer}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Department</TableHeaderCell>
                  <TableHeaderCell>Role</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Hire Date</TableHeaderCell>
                  <TableHeaderCell>Salary</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Text weight="semibold">{employee.firstName} {employee.lastName}</Text>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{new Date(employee.hireDate).toLocaleDateString()}</TableCell>
                    <TableCell>${employee.salary.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className={styles.actionButtons}>
                        <Button className={styles.actionButton} icon={<EditRegular />} size="small" />
                        <Button className={styles.actionButton} icon={<DeleteRegular />} size="small" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationComponent 
            paginationState={employeesPagination.paginationState}
            paginationControls={employeesPagination.paginationControls}
          />
        </section>
      )}

      {/* Integration Note */}
      <Card style={{ padding: '24px', backgroundColor: tokens.colorNeutralBackground2, marginTop: '32px' }}>
        <Text weight="semibold" style={{ display: 'block', marginBottom: '12px', color: tokens.colorNeutralForeground1 }}>
          🔗 Integration Points
        </Text>
        <Text style={{ color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300 }}>
          To connect real SQL data, replace the mock data imports with actual SQL connector calls. 
          Key integration points: Database connection, CRUD operations, stored procedures, and real-time updates. 
          The pagination, search, and table components are ready to work with live data.
        </Text>
      </Card>
    </div>
  );
}
