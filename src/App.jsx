import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import RawMaterials from './pages/RawMaterials'
import ProductionPlan from './pages/ProductionPlan'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/raw-materials" element={<RawMaterials />} />
        <Route path="/production-plan" element={<ProductionPlan />} />
      </Routes>
    </Layout>
  )
}

export default App
