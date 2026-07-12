import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link ${isActive ? 'nav-link--active' : ''}`

export default function Navigation() {
  return (
    <nav className="flex flex-wrap items-center gap-1.5">
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
