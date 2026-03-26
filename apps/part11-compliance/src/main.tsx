import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter } from 'react-router-dom';
import { FluentProvider, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { UserProvider } from './hooks/useCurrentUser';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemedApp() {
  const { isDarkMode } = useTheme();
  return (
    <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </UserProvider>
      </QueryClientProvider>
    </FluentProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </StrictMode>
);
