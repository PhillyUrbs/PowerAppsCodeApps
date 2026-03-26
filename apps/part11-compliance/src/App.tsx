import { Routes, Route } from 'react-router-dom';
import { makeStyles, tokens, Spinner } from '@fluentui/react-components';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';

const BatchRecordsPage = lazy(() => import('./pages/BatchRecordsPage'));
const AuditTrailPage = lazy(() => import('./pages/AuditTrailPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
});

export default function App() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Layout>
        <Suspense fallback={<div className={styles.loading}><Spinner size="medium" label="Loading..." /></div>}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/batch-records" element={<BatchRecordsPage />} />
            <Route path="/audit-trail" element={<AuditTrailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </div>
  );
}
