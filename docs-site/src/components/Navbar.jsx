import { NavLink } from 'react-router-dom'

const GH_URL = 'https://github.com/AMP-Media-Development/ping-games'

export default function Navbar() {
  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/docs', label: 'Docs' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/support', label: 'Support' },
  ]

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <div className="logo-mark">🎮</div>
          <span>Ping Games</span>
        </NavLink>

        <div className="navbar-links">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          <a
            href={GH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: '13px', padding: '7px 14px' }}
          >
            GitHub ↗
          </a>
          <NavLink to="/docs" className="btn btn-primary" style={{ fontSize: '13px', padding: '7px 14px' }}>
            Get Started
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
