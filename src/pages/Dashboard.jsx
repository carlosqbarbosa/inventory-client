import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaBox, FaCubes, FaExclamationTriangle, FaChartLine } from 'react-icons/fa'
import Card from '../components/common/Card/Card'
import { fetchProducts } from '../store/slices/productsSlice'
import { fetchRawMaterials, fetchLowStock } from '../store/slices/rawMaterialsSlice'
import '../style/Dashboard.css'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: products } = useSelector((state) => state.products)
  const { items: rawMaterials, lowStockItems } = useSelector((state) => state.rawMaterials)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchRawMaterials())
    dispatch(fetchLowStock(10))
  }, [dispatch])

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: <FaBox />,
      color: '#2563eb',
      path: '/products'
    },
    {
      title: 'Raw Materials',
      value: rawMaterials.length,
      icon: <FaCubes />,
      color: '#10b981',
      path: '/raw-materials'
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems.length,
      icon: <FaExclamationTriangle />,
      color: '#f59e0b',
      path: '/raw-materials'
    },
    {
      title: 'Production Plan',
      value: 'View',
      icon: <FaChartLine />,
      color: '#8b5cf6',
      path: '/production-plan'
    },
  ]

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="stat-card"
            onClick={() => navigate(stat.path)}
          >
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </Card>
        ))}
      </div>

      {lowStockItems.length > 0 && (
        <Card title="⚠️ Low Stock Alert" className="alert-card">
          <div className="low-stock-list">
            {lowStockItems.map((item) => (
              <div key={item.id} className="low-stock-item">
                <span className="item-name">{item.name}</span>
                <span className="item-stock">
                  Stock: <strong>{item.stockQuantity}</strong>
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default Dashboard