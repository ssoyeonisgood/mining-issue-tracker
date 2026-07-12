import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">

            <div>
              <p className="header-meta">Mining Operations Platform</p>
              <h1 className="header-title">Issue Tracker</h1>
            </div>
          </div>
          <Navigation />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
