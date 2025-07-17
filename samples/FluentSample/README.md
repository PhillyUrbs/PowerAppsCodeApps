# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# FluentSample - Power Apps Code Apps Template

A comprehensive template demonstrating Power Apps Code Apps patterns with Fluent UI, navigation, and connector examples using realistic mock data.

## 🎯 Purpose

This template is designed to help developers:
- Learn Power Apps Code Apps best practices
- Understand Fluent UI v9 integration patterns  
- See examples of navigation and data management
- Have a starting point for their own Power Apps projects
- Replace mock data with real connectors using clear integration points

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Explore the examples**
   - Navigate through the sidebar to see different connector patterns
   - Review the source code to understand implementation details
   - Examine mock data structures in `src/mockData/`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main app layout with navigation
├── pages/              # Route components
│   ├── HomePage.tsx    # Landing page with overview
│   ├── Office365Page.tsx    # Office 365 connector example
│   ├── SqlPage.tsx          # SQL database connector example
│   └── CustomApiPage.tsx    # Custom API connector example
├── mockData/           # Mock data for all examples
│   ├── office365Data.ts     # Office 365 user, calendar, email data
│   ├── sqlData.ts           # SQL projects, tasks, employee data
│   └── customApiData.ts     # REST API asset management data
├── hooks/              # Custom React hooks (to be added)
├── App.tsx             # Main app component with routing
├── main.tsx            # App entry point with providers
└── PowerProvider.tsx   # Power Apps SDK initialization
```

## 🔌 Connector Examples

### Office 365 Connector
- **Mock Data**: User profiles, calendar events, email messages
- **Features**: Search, filtering, user management
- **Location**: `/office365` route
- **Mock File**: `src/mockData/office365Data.ts`

### SQL Database Connector  
- **Mock Data**: Projects, tasks, employees with relationships
- **Features**: CRUD operations, data grid, pagination
- **Location**: `/sql` route
- **Mock File**: `src/mockData/sqlData.ts`

### Custom API Connector
- **Mock Data**: Asset management with REST API responses
- **Features**: HTTP methods, error handling, response parsing
- **Location**: `/custom-api` route  
- **Mock File**: `src/mockData/customApiData.ts`

## 🛠 Technology Stack

- **Framework**: React 18.2.0 + TypeScript
- **Build Tool**: Vite  
- **UI Library**: Fluent UI v9
- **Routing**: React Router v6
- **State Management**: TanStack Query v5
- **Power Platform**: Power Apps Code SDK

## 📝 Adding Real Connectors

This template is designed with clear separation between UI and data layers. To add real connectors:

1. **Identify Integration Points**: Look for comments like `// TODO: Replace with real connector`
2. **Replace Mock Data**: Swap mock data imports with real connector calls
3. **Update Service Layer**: Modify service functions to use Power Apps connectors
4. **Handle Authentication**: Add authentication flows as needed
5. **Error Handling**: Extend error handling for real connector scenarios

### Example: Replacing Office 365 Mock Data

```typescript
// Before (mock data)
import { mockUsers } from '../mockData/office365Data';

// After (real connector)  
import { getUsers } from '@microsoft/graph-connector';
```

## 🎨 Customization

### Theme
- Fluent UI theme is configured in `src/main.tsx`
- Customize colors, typography, and spacing as needed

### Navigation
- Add new routes in `src/App.tsx`
- Update navigation items in `src/components/Layout.tsx`
- Create new page components in `src/pages/`

### Components
- All components use Fluent UI v9 patterns
- Responsive design with mobile-first approach
- Accessible by default (WCAG 2.1 AA compliant)

## 📚 Learning Resources

- [Power Apps Code Apps Documentation](https://docs.microsoft.com/power-apps/code-apps)
- [Fluent UI React v9](https://react.fluentui.dev/)
- [React Router v6](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/)

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with Power Apps CLI
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Project Requirements

- Node.js 18+ 
- npm 8+
- Power Apps CLI (`pac` command)

## 📄 License

This project is licensed under the MIT License - see the Microsoft PowerAppsCodeApps repository for details.

## 🤝 Contributing

This is a template project within the Microsoft PowerAppsCodeApps repository. Contributions should follow the main repository guidelines.

---

**Note**: This template uses mock data for all examples. Replace with real Power Apps connectors for production use.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
