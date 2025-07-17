import { Text, Card, makeStyles, shorthands, tokens, Input, Badge } from '@fluentui/react-components';
import { PeopleRegular, CalendarRegular, MailRegular, SearchRegular } from '@fluentui/react-icons';
import PageHeader from '../components/PageHeader';
import { mockUsers, mockCalendarEvents, mockEmails } from '../mockData/office365Data';
import { useState } from 'react';

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
    ...shorthands.gap('12px'),
    marginBottom: '16px',
  },
  sectionIcon: {
    fontSize: '20px',
    color: tokens.colorBrandForeground1,
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    ...shorthands.gap('16px'),
  },
  userCard: {
    ...shorthands.padding('16px'),
    height: 'fit-content',
  },
  userName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  userDetails: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
  },
  searchBox: {
    maxWidth: '400px',
    marginBottom: '16px',
  },
  eventCard: {
    ...shorthands.padding('16px'),
    marginBottom: '12px',
  },
  eventTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  eventDetails: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
  },
  emailCard: {
    ...shorthands.padding('16px'),
    marginBottom: '12px',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  emailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  emailSubject: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  emailPreview: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
  },
  mockDataBadge: {
    marginBottom: '16px',
  },
});

export default function Office365Page() {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = mockUsers.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show recent calendar events (next 5)
  const recentEvents = mockCalendarEvents.slice(0, 5);

  // Show recent emails (first 5)
  const recentEmails = mockEmails.slice(0, 5);

  return (
    <div className={styles.container}>
      <PageHeader
        title="Office 365 Connector Example"
        subtitle="This page demonstrates Office 365 connector patterns with user profiles, calendar events, and email integration using comprehensive mock data."
        icon={<PeopleRegular />}
      />

      <Badge className={styles.mockDataBadge} appearance="tint" color="brand">
        🎭 Using Mock Data - Replace with real Office 365 connectors
      </Badge>

      {/* Users Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <PeopleRegular className={styles.sectionIcon} />
          <h3 className={styles.sectionTitle}>Organization Directory</h3>
        </div>
        
        <Input
          className={styles.searchBox}
          placeholder="Search users by name, department, or role..."
          contentBefore={<SearchRegular />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className={styles.grid}>
          {filteredUsers.slice(0, 8).map((user) => (
            <Card key={user.id} className={styles.userCard}>
              <div className={styles.userName}>{user.displayName}</div>
              <div className={styles.userDetails}>
                <div>{user.jobTitle}</div>
                <div>{user.department}</div>
                <div>{user.mail}</div>
                <div>{user.officeLocation}</div>
              </div>
            </Card>
          ))}
        </div>
        
        {filteredUsers.length > 8 && (
          <Text style={{ marginTop: '16px', color: tokens.colorNeutralForeground2 }}>
            Showing 8 of {filteredUsers.length} users. Search to filter results.
          </Text>
        )}
      </section>

      {/* Calendar Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <CalendarRegular className={styles.sectionIcon} />
          <h3 className={styles.sectionTitle}>Upcoming Calendar Events</h3>
        </div>

        {recentEvents.map((event) => (
          <Card key={event.id} className={styles.eventCard}>
            <div className={styles.eventTitle}>{event.subject}</div>
            <div className={styles.eventDetails}>
              <div>📅 {new Date(event.start.dateTime).toLocaleDateString()} at {new Date(event.start.dateTime).toLocaleTimeString()}</div>
              <div>📍 {event.location.displayName}</div>
              <div>👤 Organizer: {event.organizer.emailAddress.name}</div>
              {event.attendees.length > 0 && (
                <div>👥 {event.attendees.length} attendees</div>
              )}
            </div>
          </Card>
        ))}
      </section>

      {/* Email Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <MailRegular className={styles.sectionIcon} />
          <h3 className={styles.sectionTitle}>Recent Emails</h3>
        </div>

        {recentEmails.map((email) => (
          <Card key={email.id} className={styles.emailCard}>
            <div className={styles.emailHeader}>
              <div className={styles.emailSubject}>{email.subject}</div>
              <Badge appearance={email.importance === 'high' ? 'filled' : 'tint'} color={email.importance === 'high' ? 'danger' : 'brand'}>
                {email.importance}
              </Badge>
            </div>
            <div className={styles.emailPreview}>
              <div>From: {email.from.emailAddress.name}</div>
              <div>Received: {new Date(email.receivedDateTime).toLocaleString()}</div>
              <div style={{ marginTop: '8px' }}>{email.bodyPreview}</div>
            </div>
          </Card>
        ))}
      </section>

      {/* Integration Note */}
      <Card style={{ padding: '24px', backgroundColor: tokens.colorNeutralBackground2, marginTop: '32px' }}>
        <Text weight="semibold" style={{ display: 'block', marginBottom: '12px', color: tokens.colorNeutralForeground1 }}>
          🔗 Integration Points
        </Text>
        <Text style={{ color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300 }}>
          To connect real Office 365 data, replace the mock data imports with actual Office 365 connector calls. 
          Key integration points: User Directory API, Calendar API, and Mail API. The UI components are ready 
          to receive real data with the same structure as the mock data.
        </Text>
      </Card>
    </div>
  );
}
