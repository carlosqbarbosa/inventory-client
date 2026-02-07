import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../components/common/Card/Card'
import Table from '../components/common/Table/Table'
import Button from '../components/common/Button/Button'
import Loading from '../components/common/Loading/Loading'
import { fetchProducts, createProduct } from '../store/slices/productsSlice'

const Products = () => {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(state => state.products)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',  
  })

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Name is required')
      return
    }
    
    const priceStr = formData.price.trim()
    const priceValue = parseFloat(priceStr)
    
    if (!priceStr || isNaN(priceValue) || priceValue <= 0) {
      alert('Price must be a valid number greater than zero')
      return
    }

    try {
      const productData = {
        name: formData.name.trim(),
        price: priceValue, 
        stock: 0
      }
      
      console.log('Sending product:', productData)
      
      await dispatch(createProduct(productData)).unwrap()
      
      setFormData({ name: '', price: '' })
      setShowForm(false)
      dispatch(fetchProducts())
      
      alert('Product created successfully!')
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error: ' + (error.message || 'Error creating product'))
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', price: '' })
    setShowForm(false)
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { 
      key: 'price', 
      label: 'Price',
      render: (row) => `R$ ${row.price?.toFixed(2) || '0.00'}`
    },
    { 
      key: 'stock', 
      label: 'Stock',
      render: (row) => row.stock || 0
    },
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h1>Products</h1>

      <Card title="Products List">
        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <p>No products registered</p>
        ) : (
          <Table columns={columns} data={items} />
        )}
      </Card>

      <div style={{ marginTop: '20px' }}>
        {!showForm ? (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Add Product
          </Button>
        ) : (
          <Card title="New Product">
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Name: <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Product name"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Price (R$): <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setFormData(prev => ({ ...prev, price: value }))  
                    }
                  }}
                  placeholder="0.00"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button type="submit" variant="primary">
                  Save Product
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Products