import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa'
import Card from '../components/common/Card/Card'
import Button from '../components/common/Button/Button'
import Input from '../components/common/Input/Input'
import Modal from '../components/common/Modal/Modal'
import Loading from '../components/common/Loading/Loading'
import {
  fetchProductById,
  addRawMaterialToProduct,
  removeRawMaterialFromProduct,
} from '../store/slices/productsSlice'
import { fetchRawMaterials } from '../store/slices/rawMaterialsSlice'
import '../style/productDetails.css'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedProduct: product, loading } = useSelector((state) => state.products)
  const { items: rawMaterials } = useSelector((state) => state.rawMaterials)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRawMaterialId, setSelectedRawMaterialId] = useState('')
  const [quantityRequired, setQuantityRequired] = useState('')

  useEffect(() => {
    dispatch(fetchProductById(id))
    dispatch(fetchRawMaterials())
  }, [dispatch, id])

  const handleAddMaterial = async () => {
    if (!selectedRawMaterialId || !quantityRequired) {
      toast.error('Please fill all fields')
      return
    }

    try {
      await dispatch(
        addRawMaterialToProduct({
          productId: id,
          rawMaterial: {
            rawMaterialId: parseInt(selectedRawMaterialId),
            quantityRequired: parseInt(quantityRequired),
          },
        })
      ).unwrap()

      toast.success('Raw material added successfully!')
      
      setSelectedRawMaterialId('')
      setQuantityRequired('')
      setIsModalOpen(false)
      
    } catch (error) {
      console.error('Error adding raw material:', error)
      toast.error(error.message || 'Failed to add raw material')
    }
  }

  const handleRemoveMaterial = async (rawMaterialId) => {
    if (!window.confirm('Are you sure you want to remove this raw material?')) {
      return
    }

    try {
      await dispatch(
        removeRawMaterialFromProduct({
          productId: id,
          rawMaterialId,
        })
      ).unwrap()

      toast.success('Raw material removed successfully!')
      
    } catch (error) {
      console.error('Error removing:', error)
      toast.error('Failed to remove raw material')
    }
  }

  const availableRawMaterials = rawMaterials.filter(
    (rm) => !product?.productRawMaterials?.some((prm) => prm.rawMaterial.id === rm.id)
  )

  if (loading) return <Loading fullScreen />

  if (!product) {
    return (
      <div>
        <p>Product not found</p>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    )
  }

  return (
    <div className="product-details">
      <div className="page-header">
        <Button variant="outline" onClick={() => navigate('/products')}>
          <FaArrowLeft /> Back
        </Button>
        <h1 className="page-title">{product.name}</h1>
      </div>

      <div className="details-grid">
        <Card title="Product Information">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span className="info-value">{product.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{product.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Price:</span>
              <span className="info-value">${product.price?.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Stock:</span>
              <span className="info-value">{product.stock || 0}</span>
            </div>
          </div>
        </Card>

        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Required Raw Materials</span>
              <Button size="small" onClick={() => setIsModalOpen(true)}>
                <FaPlus /> Add Material
              </Button>
            </div>
          }
        >
          {product.productRawMaterials && product.productRawMaterials.length > 0 ? (
            <div className="materials-list">
              {product.productRawMaterials.map((prm) => (
                <div key={prm.rawMaterial.id} className="material-item">
                  <div className="material-info">
                    <h4>{prm.rawMaterial.name}</h4>
                    <p>
                      Required: <strong>{prm.quantityRequired}</strong> units
                    </p>
                    <p>
                      Available: <strong>{prm.rawMaterial.stockQuantity}</strong> units
                    </p>
                  </div>
                  <Button
                    size="small"
                    variant="danger"
                    onClick={() => handleRemoveMaterial(prm.rawMaterial.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No raw materials associated yet</p>
          )}
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Raw Material">
        <div className="modal-form">
          <div className="form-group">
            <label>Raw Material</label>
            <select
              value={selectedRawMaterialId}
              onChange={(e) => setSelectedRawMaterialId(e.target.value)}
              className="form-select"
            >
              <option value="">Select a raw material</option>
              {availableRawMaterials.map((rm) => (
                <option key={rm.id} value={rm.id}>
                  {rm.name} (Stock: {rm.stockQuantity})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Quantity Required"
            type="number"
            value={quantityRequired}
            onChange={(e) => setQuantityRequired(e.target.value)}
            placeholder="Enter quantity"
            min="1"
          />

          <div className="modal-actions">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMaterial}>Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProductDetails