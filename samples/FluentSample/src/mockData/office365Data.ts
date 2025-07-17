// Mock data for Office 365 connector examples
// This file demonstrates the data structure expected from Office 365 connectors
// Replace this mock data with real Office 365 connector calls in your implementation

export interface MockUser {
  id: string;
  displayName: string;
  mail: string;
  jobTitle: string;
  department: string;
  officeLocation: string;
  mobilePhone: string;
  businessPhones: string[];
}

export interface MockCalendarEvent {
  id: string;
  subject: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  location: { displayName: string };
  organizer: { emailAddress: { name: string; address: string } };
  attendees: Array<{ emailAddress: { name: string; address: string } }>;
}

export interface MockEmail {
  id: string;
  subject: string;
  from: { emailAddress: { name: string; address: string } };
  receivedDateTime: string;
  bodyPreview: string;
  isRead: boolean;
  importance: 'low' | 'normal' | 'high';
}

// Mock user profiles (50+ entries for realistic pagination)
export const mockUsers: MockUser[] = [
  {
    id: "1",
    displayName: "Alex Johnson",
    mail: "alex.johnson@contoso.com",
    jobTitle: "Software Engineer",
    department: "Engineering",
    officeLocation: "Seattle, WA",
    mobilePhone: "+1 555-0101",
    businessPhones: ["+1 555-0201"]
  },
  {
    id: "2",
    displayName: "Sarah Chen",
    mail: "sarah.chen@contoso.com",
    jobTitle: "Product Manager",
    department: "Product",
    officeLocation: "San Francisco, CA",
    mobilePhone: "+1 555-0102",
    businessPhones: ["+1 555-0202"]
  },
  {
    id: "3",
    displayName: "Michael Rodriguez",
    mail: "michael.rodriguez@contoso.com",
    jobTitle: "UX Designer",
    department: "Design",
    officeLocation: "Austin, TX",
    mobilePhone: "+1 555-0103",
    businessPhones: ["+1 555-0203"]
  },
  // Add more users for pagination testing...
  ...Array.from({ length: 47 }, (_, i) => ({
    id: `${i + 4}`,
    displayName: `User ${i + 4}`,
    mail: `user${i + 4}@contoso.com`,
    jobTitle: ['Engineer', 'Manager', 'Designer', 'Analyst'][i % 4],
    department: ['Engineering', 'Sales', 'Marketing', 'HR'][i % 4],
    officeLocation: ['Seattle, WA', 'New York, NY', 'Los Angeles, CA'][i % 3],
    mobilePhone: `+1 555-0${(i + 4).toString().padStart(3, '0')}`,
    businessPhones: [`+1 555-0${(i + 4 + 100).toString().padStart(3, '0')}`]
  }))
];

// Mock calendar events
export const mockCalendarEvents: MockCalendarEvent[] = [
  {
    id: "evt1",
    subject: "Team Standup",
    start: { dateTime: "2025-07-18T09:00:00", timeZone: "Pacific Standard Time" },
    end: { dateTime: "2025-07-18T09:30:00", timeZone: "Pacific Standard Time" },
    location: { displayName: "Conference Room A" },
    organizer: { emailAddress: { name: "Alex Johnson", address: "alex.johnson@contoso.com" } },
    attendees: [
      { emailAddress: { name: "Sarah Chen", address: "sarah.chen@contoso.com" } },
      { emailAddress: { name: "Michael Rodriguez", address: "michael.rodriguez@contoso.com" } }
    ]
  },
  {
    id: "evt2",
    subject: "Product Review",
    start: { dateTime: "2025-07-18T14:00:00", timeZone: "Pacific Standard Time" },
    end: { dateTime: "2025-07-18T15:00:00", timeZone: "Pacific Standard Time" },
    location: { displayName: "Meeting Room B" },
    organizer: { emailAddress: { name: "Sarah Chen", address: "sarah.chen@contoso.com" } },
    attendees: [
      { emailAddress: { name: "Alex Johnson", address: "alex.johnson@contoso.com" } }
    ]
  }
];

// Mock emails
export const mockEmails: MockEmail[] = [
  {
    id: "mail1",
    subject: "Project Update Required",
    from: { emailAddress: { name: "Sarah Chen", address: "sarah.chen@contoso.com" } },
    receivedDateTime: "2025-07-17T10:30:00Z",
    bodyPreview: "Hi team, please provide updates on your current projects by EOD...",
    isRead: false,
    importance: "high"
  },
  {
    id: "mail2",
    subject: "Welcome to the team!",
    from: { emailAddress: { name: "HR Team", address: "hr@contoso.com" } },
    receivedDateTime: "2025-07-17T08:00:00Z",
    bodyPreview: "Welcome to Contoso! We're excited to have you join our team...",
    isRead: true,
    importance: "normal"
  }
];

// Helper functions for mock data manipulation
export const getUserById = (id: string): MockUser | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const searchUsers = (query: string): MockUser[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockUsers.filter(user => 
    user.displayName.toLowerCase().includes(lowercaseQuery) ||
    user.mail.toLowerCase().includes(lowercaseQuery) ||
    user.department.toLowerCase().includes(lowercaseQuery)
  );
};

export const getUsersByDepartment = (department: string): MockUser[] => {
  return mockUsers.filter(user => user.department === department);
};
