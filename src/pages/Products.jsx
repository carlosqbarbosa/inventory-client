import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Card from '../components/common/Card/Card'
import Table from '../components/common/Table/Table'
import Button from '../components/common/Button/Button'
import Loading from '../components/common/Loading/Loading'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../store/slices/productsSlice'

const Products = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, loading } = useSelector(state => state.products)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: ''
  })

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }
    
    const priceStr = formData.price.trim()
    const priceValue = parseFloat(priceStr)
    
    if (!priceStr || isNaN(priceValue) || priceValue <= 0) {
      toast.error('Price must be a valid number greater than zero')
      return
    }

    const stockValue = parseInt(formData.stock) || 0

    try {
      const productData = {
        name: formData.name.trim(),
        price: priceValue,
        stock: stockValue
      }
      
      if (editingProduct) {
        await dispatch(updateProduct({ 
          id: editingProduct.id, 
          product: productData 
        })).unwrap()
        toast.success('Product updated successfully!')
      } else {
        await dispatch(createProduct(productData)).unwrap()
        toast.success('Product created successfully!')
      }
      
      setFormData({ name: '', price: '', stock: '' })
      setShowForm(false)
      setEditingProduct(null)
      
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(error.message || 'Error saving product')
    }
  }

  const handleEdit = (product) => {
    console.log(' Editing product:', product)
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: (product.stock || 0).toString()
    })
    setShowForm(true)
    
    
    setTimeout(() => {
      window.scrollTo({ 
        top: document.documentElement.scrollHeight, 
        behavior: 'smooth' 
      })
    }, 100)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await dispatch(deleteProduct(id)).unwrap()
      toast.success('Product deleted successfully!')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error(error.message || 'Error deleting product')
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', price: '', stock: '' })
    setShowForm(false)
    setEditingProduct(null)
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
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            variant="primary" 
            onClick={() => navigate(`/products/${row.id}`)}
            style={{ padding: '6px 12px', fontSize: '14px' }}
          >
            Details
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleEdit(row)}
            style={{ padding: '6px 12px', fontSize: '14px' }}
          >
            Edit
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(row.id)}
            style={{ padding: '6px 12px', fontSize: '14px' }}
          >
            Delete
          </Button>
        </div>
      )
    }
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
          <Card 
            title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'New Product'}
            style={{ 
              border: editingProduct ? '2px solid #0066cc' : '1px solid #ddd',
              boxShadow: editingProduct ? '0 4px 12px rgba(0,102,204,0.2)' : 'none'
            }}
          >
            {editingProduct && (
              <div style={{ 
                backgroundColor: '#e3f2fd', 
                padding: '10px', 
                borderRadius: '4px', 
                marginBottom: '15px',
                fontSize: '14px',
                color: '#1976d2'
              }}>
                ℹ️ You are editing product ID: {editingProduct.id}
              </div>
            )}
            
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

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Stock:
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '' || /^\d+$/.test(value)) {
                      setFormData(prev => ({ ...prev, stock: value }))
                    }
                  }}
                  placeholder="0"
                  min="0"
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
                  {editingProduct ? 'Update Product' : 'Save Product'}
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