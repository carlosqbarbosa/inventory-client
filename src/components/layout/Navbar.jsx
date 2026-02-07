import { FaBars, FaIndustry } from 'react-icons/fa'
import './Navbar.css'

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <button className="menu-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div className="navbar-brand">
            <FaIndustry className="brand-icon" />
            <span className="brand-text">Production Inventory System</span>
          </div>
        </div>
        <div className="navbar-right">
          <span className="user-info">Welcome, User</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar