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
│   │   ├── Layout.tsx              # Main layout with navigation
│   │   ├── PageHeader.tsx          # Page header component
│   │   ├── PaginationComponent.tsx # Data pagination
│   │   └── ThemedApp.tsx           # Theme wrapper component
│   ├── pages/
│   │   ├── HomePage.tsx            # Landing page with app overview
│   │   ├── Office365Page.tsx       # Office 365 connector demo
│   │   ├── SqlPage.tsx             # SQL database demo
│   │   └── CustomApiPage.tsx       # Custom API connector demo
│   ├── hooks/
│   │   ├── usePagination.ts        # Reusable pagination logic
│   │   └── useTheme.ts             # Theme management hooks
│   ├── contexts/
│   │   ├── ThemeContext.ts         # Theme context definition
│   │   └── ThemeContext.tsx        # Theme provider implementation
│   ├── mockData/                   # Mock data for development
│   │   ├── office365Data.ts        # Office 365 mock data
│   │   ├── sqlData.ts              # SQL mock data
│   │   └── customApiData.ts        # Custom API mock data
│   ├── assets/                     # Static assets and images
│   ├── App.tsx                     # Main app with routing
│   ├── main.tsx                    # Entry point with providers
│   ├── PowerProvider.tsx           # Power Apps SDK setup
│   ├── App.css                     # Global styles
│   └── index.css                   # Base styles
├── public/                         # Public assets
├── contentMedia/                   # Documentation media files
│   └── 1-clone_repo.gif           # Setup demonstration GIF
├── .github/                        # GitHub metadata
│   ├── copilot-instructions.md     # Copilot development guidance
│   └── requirements.md             # This requirements document
├── README.md                       # Setup and usage guide
├── package.json                    # Dependencies and scripts
└── power.config.json               # Power Apps configuration
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

## Implementation Status

### ✅ Completed
- **Project Structure**: Basic React + TypeScript + Vite setup
- **Navigation System**: Layout component with routing
- **Theme System**: Dark/light theme support with context
- **Page Components**: All four main pages (Home, Office365, SQL, CustomAPI)
- **Pagination**: Reusable pagination component and hook
- **Mock Data**: Sample data for all connector types
- **Documentation**: Comprehensive README with setup instructions
- **Development Setup**: Build system, linting, and development workflow

### 🔄 In Progress / Needs Update
- **Real Connector Integration**: Currently using mock data, needs actual Power Platform connectors
- **Error Handling**: Basic error states implemented, needs comprehensive error boundary
- **CRUD Operations**: SQL page has basic structure, needs full CRUD implementation
- **Office 365 Integration**: User profile display implemented, needs real connector
- **Custom API Integration**: Page structure ready, needs actual API calls

### 📋 Planned Enhancements
- **Accessibility**: WCAG 2.1 AA compliance audit and improvements
- **Performance**: Code splitting, lazy loading, and virtualization
- **Advanced Features**: Search, filtering, export functionality
- **Testing**: Unit tests and integration tests
- **Mobile Optimization**: Enhanced responsive design

## Future Enhancements
- **SharePoint connector** example
- **Dataverse integration** (when supported)
- **Multi-language support**
- **Theme customization** options
- **Advanced filtering** and search capabilities
- **Export functionality** for data views
- **Real-time updates** using SignalR or similar
