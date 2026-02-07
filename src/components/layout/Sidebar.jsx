import { NavLink } from 'react-router-dom'
import { FaHome, FaBox, FaCubes, FaChartLine } from 'react-icons/fa'
import './Sidebar.css'

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/products', icon: <FaBox />, label: 'Products' },
    { path: '/raw-materials', icon: <FaCubes />, label: 'Raw Materials' },
    { path: '/production-plan', icon: <FaChartLine />, label: 'Production Plan' },
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar