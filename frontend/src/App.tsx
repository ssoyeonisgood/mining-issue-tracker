import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import IssueDetailPage from './pages/IssueDetailPage'
import IssuesPage from './pages/IssuesPage'
import NewIssuePage from './pages/NewIssuePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="issues" element={<IssuesPage />} />
          <Route path="issues/new" element={<NewIssuePage />} />
          <Route path="issues/:id" element={<IssueDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
