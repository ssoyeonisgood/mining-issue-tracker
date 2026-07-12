import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-amber-500 text-white'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`

export default function Navigation() {
  return (
    <nav className="flex flex-wrap items-center gap-2">
      <NavLink to="/" end className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/issues" className={linkClass}>
        Issues
      </NavLink>
      <NavLink to="/issues/new" className={linkClass}>
        New Issue
      </NavLink>
    </nav>
  )
}
