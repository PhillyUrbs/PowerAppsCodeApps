import { Routes, Route } from 'react-router-dom'
import { makeStyles, shorthands } from '@fluentui/react-components'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import Office365Page from './pages/Office365Page'
import SqlPage from './pages/SqlPage'
import CustomApiPage from './pages/CustomApiPage'

const useStyles = makeStyles({
  root: {
    ...shorthands.margin(0),
    ...shorthands.padding(0),
    minHeight: '100vh',
    backgroundColor: '#fafafa',
  },
});

function App() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/office365" element={<Office365Page />} />
          <Route path="/sql" element={<SqlPage />} />
          <Route path="/custom-api" element={<CustomApiPage />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App
