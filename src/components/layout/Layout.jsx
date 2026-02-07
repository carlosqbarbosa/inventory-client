import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import './Layout.css'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="layout">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="layout-container">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout