import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import RawMaterials from './pages/RawMaterials'
import ProductionPlan from './pages/ProductionPlan'

function App() {
  return (
    <BrowserRouter> 
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="raw-materials" element={<RawMaterials />} />
          <Route path="production-plan" element={<ProductionPlan />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </BrowserRouter>
  )
}

export default App