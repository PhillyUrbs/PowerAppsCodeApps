import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FluentProvider } from '@fluentui/react-components'
import PowerProvider from './PowerProvider.tsx'
import { ThemeProvider, useTheme } from './contexts/ThemeContext.tsx'
import './index.css'
import App from './App.tsx'

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Wrapper component to access theme context
const ThemedApp = () => {
  const { theme } = useTheme();
  
  return (
    <FluentProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </FluentProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PowerProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </PowerProvider>
  </StrictMode>,
)
