# FluentSample Requirements

## Project Overview
Create a comprehensive Power Apps Code App that demonstrates various Power Platform connector integrations using modern Fluent UI React components. The app should serve as a showcase and learning resource for different connector types with practical examples.

## Core Features

### 1. Navigation System
- **Main Navigation Menu** with clear section descriptions
- **Responsive design** that works on desktop and mobile
- **Visual indicators** for active/current section
- **Sample descriptions** directly in the navigation to explain what each example demonstrates

### 2. Office 365 Connector Example
**Purpose**: Demonstrate user profile and photo integration
- **Features**:
  - Display current user profile information (name, email, job title)
  - Show user profile photo
  - Display user's manager information
  - List recent colleagues/contacts
- **Reference Documentation**: [How to Connect to Data](https://github.com/microsoft/PowerAppsCodeApps/blob/FluentSample/docs/how-to-connect-to-data.md)
- **Navigation Description**: "Office 365 Integration - User profiles, photos, and organizational data"

### 3. SQL Connector Example
**Purpose**: Demonstrate CRUD operations with Azure SQL Database
- **Features**:
  - **Data Grid** displaying records from SQL table
  - **Create** new records with form validation
  - **Read** detailed record views
  - **Update** existing records inline or in modal
  - **Delete** records with confirmation
  - **Search and filtering** capabilities
  - **Data pagination** (see pagination requirements below)
- **Reference Documentation**: [How to Connect to Azure SQL](https://github.com/microsoft/PowerAppsCodeApps/blob/FluentSample/docs/how-to-connect-to-azure-sql.md)
- **Navigation Description**: "SQL Database - CRUD operations, search, and data management"

### 4. Custom Connector Example
**Purpose**: Show how to integrate with custom APIs and services
- **Features**:
  - **API Data Display** from custom endpoint
  - **Custom API calls** with different HTTP methods
  - **Error handling** for API failures
  - **Loading states** during API calls
  - **Response formatting** and data transformation
- **Reference Documentation**: [How to Create API and Custom Connector](https://github.com/microsoft/PowerAppsCodeApps/blob/FluentSample/docs/how-to-create-api-and-custom-connector.md)
- **Navigation Description**: "Custom API - External service integration and custom connectors"

### 5. Data Pagination Support
**Purpose**: Efficiently handle large datasets across all examples
- **Implementation**: Follow patterns from [PowerAppsCodeApps Discussion #49](https://github.com/microsoft/PowerAppsCodeApps/discussions/49)
- **Features**:
  - **Page-based navigation** (Previous/Next buttons)
  - **Page size selection** (10, 25, 50, 100 items per page)
  - **Total record count** display
  - **Jump to page** functionality
  - **Loading states** during page transitions
  - **URL parameter support** for shareable paginated views
- **Apply to**: SQL connector example primarily, adaptable to other connectors as needed

## Technical Requirements

### UI Framework
- **Fluent UI React v9** for all components
- **Consistent design language** following Microsoft design principles
- **Responsive layout** using Fluent UI's responsive utilities
- **Accessibility compliance** (WCAG 2.1 AA)

### Navigation Implementation
- **React Router** for client-side routing
- **Breadcrumb navigation** for deep pages
- **Side navigation panel** with collapsible sections
- **Mobile-friendly** hamburger menu for smaller screens

### State Management
- **React Context** for global app state
- **React Query/TanStack Query** for server state and caching
- **Local state** using React hooks for component-specific data

### Error Handling
- **Global error boundary** for unhandled errors
- **Toast notifications** for user feedback
- **Retry mechanisms** for failed API calls
- **Graceful degradation** when connectors are unavailable

### Performance
- **Code splitting** by route/feature
- **Lazy loading** for heavy components
- **Memoization** for expensive computations
- **Virtualization** for large data lists

## Project Structure
```
FluentSample/
├── src/
│   ├── components/
│   │   ├── common/              # Shared UI components
│   │   ├── navigation/          # Navigation components
│   │   └── connectors/          # Connector-specific components
│   ├── pages/
│   │   ├── Home.tsx            # Landing page with app overview
│   │   ├── Office365Example.tsx
│   │   ├── SqlExample.tsx
│   │   └── CustomConnectorExample.tsx
│   ├── hooks/
│   │   ├── usePagination.tsx   # Reusable pagination logic
│   │   ├── useOffice365.tsx    # Office 365 connector hooks
│   │   ├── useSqlData.tsx      # SQL connector hooks
│   │   └── useCustomApi.tsx    # Custom API hooks
│   ├── services/               # Generated connector services
│   ├── models/                 # Generated data models
│   ├── utils/
│   │   ├── pagination.ts       # Pagination utilities
│   │   ├── validation.ts       # Form validation helpers
│   │   └── formatting.ts       # Data formatting utilities
│   ├── types/
│   │   ├── pagination.ts       # Pagination type definitions
│   │   └── connectors.ts       # Connector-specific types
│   ├── contexts/
│   │   └── AppContext.tsx      # Global app state
│   ├── App.tsx
│   ├── main.tsx
│   └── PowerProvider.tsx
├── public/
├── docs/
│   └── README.md               # Implementation guide
└── package.json
```

## User Experience Requirements

### Landing Page
- **Welcome message** explaining the app's purpose
- **Quick navigation cards** to each example
- **Getting started guide** for developers
- **Links to documentation** and resources

### Example Pages
- **Clear headings** describing the connector and its capabilities
- **Step-by-step demonstrations** of key features
- **Code snippets** showing implementation details
- **Live data interactions** where possible
- **Error simulation** buttons for testing error handling

### Documentation Integration
- **Inline help text** referencing the provided documentation links
- **"Learn More" buttons** linking to detailed guides
- **Tooltips** explaining Power Platform concepts
- **Code examples** with copy-to-clipboard functionality

## Data Requirements

### Sample Data
- **Mock data** for development when connectors aren't available
- **Test records** for SQL database examples
- **Realistic user scenarios** demonstrating practical use cases

### Security Considerations
- **No sensitive data** in sample implementations
- **Environment variable** usage for connection strings
- **Error messages** that don't expose internal details
- **Proper authentication** handling for all connectors

## Success Criteria
1. **Functional examples** of all three connector types
2. **Smooth navigation** between sections
3. **Responsive design** on all device sizes
4. **Proper error handling** and user feedback
5. **Performant pagination** with large datasets
6. **Clear documentation** and learning value
7. **Production-ready code** quality and patterns

## Future Enhancements
- **SharePoint connector** example
- **Dataverse integration** (when supported)
- **Multi-language support**
- **Theme customization** options
- **Advanced filtering** and search capabilities
- **Export functionality** for data views
- **Real-time updates** using SignalR or similar
