import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Card from '../components/common/Card/Card'
import Table from '../components/common/Table/Table'
import Button from '../components/common/Button/Button'
import Loading from '../components/common/Loading/Loading'
import { 
  fetchRawMaterials, 
  createRawMaterial, 
  updateRawMaterial, 
  deleteRawMaterial,
  increaseStock,
  decreaseStock
} from '../store/slices/rawMaterialsSlice'

const RawMaterials = () => {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(state => state.rawMaterials)
  const [showForm, setShowForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    stockQuantity: ''
  })
  const [stockAdjustment, setStockAdjustment] = useState('')
  const [adjustmentType, setAdjustmentType] = useState('increase')

  useEffect(() => {
    dispatch(fetchRawMaterials())
  }, [dispatch])

  const handleOpenForm = (material = null) => {
    if (material) {
      setEditingMaterial(material)
      setFormData({
        name: material.name,
        stockQuantity: (material.stockQuantity || 0).toString()
      })
    } else {
      setEditingMaterial(null)
      setFormData({ name: '', stockQuantity: '' })
    }
    setStockAdjustment('')
    setAdjustmentType('increase')
    setShowForm(true)
    
    if (material) {
      setTimeout(() => {
        window.scrollTo({ 
          top: document.documentElement.scrollHeight, 
          behavior: 'smooth' 
        })
      }, 100)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    try {
      if (editingMaterial) {
        const materialData = {
          name: formData.name.trim(),
          stockQuantity: editingMaterial.stockQuantity 
        }
        

        if (formData.name.trim() !== editingMaterial.name) {
          await dispatch(updateRawMaterial({ 
            id: editingMaterial.id, 
            rawMaterial: materialData 
          })).unwrap()
        }
        
        if (stockAdjustment && parseInt(stockAdjustment) > 0) {
          const quantity = parseInt(stockAdjustment)
          
          if (adjustmentType === 'increase') {
            await dispatch(increaseStock({ 
              id: editingMaterial.id, 
              quantity 
            })).unwrap()
          } else if (adjustmentType === 'decrease') {
            if (quantity > editingMaterial.stockQuantity) {
              toast.error('Cannot decrease more than available stock')
              return
            }
            await dispatch(decreaseStock({ 
              id: editingMaterial.id, 
              quantity 
            })).unwrap()
          }
        }
        
        toast.success('Raw material updated successfully!')
      } else {

        const stockQuantity = parseInt(formData.stockQuantity) || 0
        
        if (stockQuantity < 0) {
          toast.error('Stock quantity cannot be negative')
          return
        }
        
        const materialData = {
          name: formData.name.trim(),
          stockQuantity: stockQuantity
        }
        
        await dispatch(createRawMaterial(materialData)).unwrap()
        toast.success('Raw material created successfully!')
      }
      
      setFormData({ name: '', stockQuantity: '' })
      setStockAdjustment('')
      setShowForm(false)
      setEditingMaterial(null)
      
    } catch (error) {
      console.error('Error saving raw material:', error)
      toast.error(error.message || 'Error saving raw material')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this raw material?')) {
      return
    }

    try {
      await dispatch(deleteRawMaterial(id)).unwrap()
      toast.success('Raw material deleted successfully!')
    } catch (error) {
      console.error('Error deleting raw material:', error)
      toast.error(error.message || 'Error deleting raw material')
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', stockQuantity: '' })
    setStockAdjustment('')
    setShowForm(false)
    setEditingMaterial(null)
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { 
      key: 'stockQuantity', 
      label: 'Stock',
      render: (row) => {
        const stock = row.stockQuantity || 0
        const isLowStock = stock < 10
        return (
          <span style={{ 
            color: isLowStock ? 'red' : 'inherit',
            fontWeight: isLowStock ? 'bold' : 'normal'
          }}>
            {stock} {isLowStock ? '⚠️' : ''}
          </span>
        )
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            variant="primary" 
            onClick={() => handleOpenForm(row)}
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

  const currentStock = editingMaterial?.stockQuantity || 0
  const adjustment = parseInt(stockAdjustment) || 0
  const newStock = adjustmentType === 'increase' 
    ? currentStock + adjustment 
    : currentStock - adjustment

  return (
    <div style={{ padding: '20px' }}>
      <h1>Raw Materials</h1>

      <Card title="Raw Materials Stock">
        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <p>No raw materials registered</p>
        ) : (
          <Table columns={columns} data={items} />
        )}
      </Card>

      <div style={{ marginTop: '20px' }}>
        {!showForm ? (
          <Button variant="primary" onClick={() => handleOpenForm()}>
            Add Raw Material
          </Button>
        ) : (
          <Card 
            title={editingMaterial ? `Edit: ${editingMaterial.name}` : 'New Raw Material'}
            style={{ 
              border: editingMaterial ? '2px solid #0066cc' : '2px solid #4caf50',
              boxShadow: editingMaterial 
                ? '0 4px 12px rgba(0,102,204,0.2)' 
                : '0 4px 12px rgba(76,175,80,0.2)'
            }}
          >
            {editingMaterial && (
              <div style={{ 
                backgroundColor: '#e3f2fd', 
                padding: '12px', 
                borderRadius: '6px', 
                marginBottom: '20px',
                fontSize: '14px',
                color: '#1976d2'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  ℹ️ Editing material ID: {editingMaterial.id}
                </div>
                <div>
                  Current stock: <strong style={{ fontSize: '16px' }}>{currentStock}</strong> units
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Name: <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Raw material name"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>


              {!editingMaterial ? (
   
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Initial Stock:
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || /^\d+$/.test(value)) {
                        setFormData(prev => ({ ...prev, stockQuantity: value }))
                      }
                    }}
                    placeholder="0"
                    min="0"
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      boxSizing: 'border-box',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              ) : (

                <div style={{ 
                  marginBottom: '20px',
                  padding: '15px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px'
                }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>
                    Adjust Stock (optional):
                  </label>
                  
                  {/* Radio buttons */}
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="adjustmentType"
                        value="increase"
                        checked={adjustmentType === 'increase'}
                        onChange={(e) => setAdjustmentType(e.target.value)}
                        style={{ marginRight: '6px' }}
                      />
                      <span>➕ Add</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="adjustmentType"
                        value="decrease"
                        checked={adjustmentType === 'decrease'}
                        onChange={(e) => setAdjustmentType(e.target.value)}
                        style={{ marginRight: '6px' }}
                      />
                      <span>➖ Remove</span>
                    </label>
                  </div>

                  {/* Input de quantidade */}
                  <input
                    type="number"
                    value={stockAdjustment}
                    onChange={(e) => setStockAdjustment(e.target.value)}
                    placeholder="Enter quantity to add or remove"
                    min="0"
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      boxSizing: 'border-box',
                      border: '2px solid #0066cc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />

                  {/* Preview do novo valor */}
                  {stockAdjustment && parseInt(stockAdjustment) > 0 && (
                    <div style={{ 
                      marginTop: '10px',
                      padding: '8px',
                      backgroundColor: adjustmentType === 'increase' ? '#e8f5e9' : '#ffebee',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}>
                      {currentStock} {adjustmentType === 'increase' ? '+' : '−'} {adjustment} = {' '}
                      <strong style={{ fontSize: '16px' }}>{newStock}</strong> units
                    </div>
                  )}
                </div>
              )}
              
              {/* Botões */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button type="submit" variant="primary">
                  {editingMaterial ? 'Update Material' : 'Save Material'}
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

export default RawMaterials