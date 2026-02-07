import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import RawMaterials from './pages/RawMaterials'
import ProductionPlan from './pages/ProductionPlan'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="raw-materials" element={<RawMaterials />} />
          <Route path="production-plan" element={<ProductionPlan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App