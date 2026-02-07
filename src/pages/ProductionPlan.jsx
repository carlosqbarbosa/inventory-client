import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../components/common/Card/Card'
import Table from '../components/common/Table/Table'
import Loading from '../components/common/Loading/Loading'
import Button from '../components/common/Button/Button'
import { fetchProductionPlan } from '../store/slices/productionPlanSlice'
import { fetchRawMaterials } from '../store/slices/rawMaterialsSlice'

const ProductionPlan = () => {
  const dispatch = useDispatch()
  const { plan, loading: planLoading } = useSelector(state => state.productionPlan)
  const { items: rawMaterials } = useSelector(state => state.rawMaterials)

  useEffect(() => {
    dispatch(fetchProductionPlan())
    dispatch(fetchRawMaterials())
  }, [dispatch])

  const handleRefresh = () => {
    dispatch(fetchProductionPlan())
    dispatch(fetchRawMaterials())
  }

  const columns = [
    { 
      key: 'productName', 
      label: 'Product Name',
      render: (row) => (
        <strong style={{ fontSize: '15px' }}>{row.productName}</strong>
      )
    },
    { 
      key: 'quantity', 
      label: 'Quantity to Produce',
      render: (row) => (
        <span style={{ 
          fontSize: '16px', 
          fontWeight: 'bold',
          color: row.quantity > 0 ? '#2ecc71' : '#95a5a6'
        }}>
          {row.quantity}
        </span>
      )
    },
    { 
      key: 'unitValue', 
      label: 'Unit Price',
      render: (row) => `R$ ${row.unitValue?.toFixed(2) || '0.00'}`
    },
    { 
      key: 'totalValue', 
      label: 'Total Value',
      render: (row) => (
        <strong style={{ color: '#27ae60', fontSize: '15px' }}>
          R$ {row.totalValue?.toFixed(2) || '0.00'}
        </strong>
      )
    }
  ]

  const lowStockMaterials = rawMaterials.filter(m => (m.stockQuantity || 0) < 10)

  if (planLoading) {
    return <Loading fullScreen />
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>Production Plan</h1>
        <Button variant="primary" onClick={handleRefresh}>
           Refresh Plan
        </Button>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <Card title="Total Products">
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3498db' }}>
            {plan?.productionItems?.length || 0}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
            Products that can be produced
          </div>
        </Card>

        <Card title="Total Production Value">
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60' }}>
            R$ {plan?.totalValue?.toFixed(2) || '0.00'}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
            Estimated total revenue
          </div>
        </Card>

        <Card title="Total Units">
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e67e22' }}>
            {plan?.productionItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
            Total units to produce
          </div>
        </Card>

        <Card title="Low Stock Alerts">
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: lowStockMaterials.length > 0 ? '#e74c3c' : '#95a5a6' }}>
            {lowStockMaterials.length}
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
            Raw materials below threshold
          </div>
        </Card>
      </div>

      {/* Production Items Table */}
      <Card title="Production Schedule (Priority by Value)">
        {!plan || !plan.productionItems || plan.productionItems.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#7f8c8d'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3>No Products Can Be Produced</h3>
            <p>There are insufficient raw materials in stock to produce any products.</p>
            <p>Please check your raw materials inventory and restock as needed.</p>
          </div>
        ) : (
          <>
            <Table columns={columns} data={plan.productionItems} />
            <div style={{ 
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#ecf0f1',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>Total Production Value:</strong>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
                R$ {plan.totalValue?.toFixed(2) || '0.00'}
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Low Stock Warnings */}
      {lowStockMaterials.length > 0 && (
        <Card title=" Low Stock Warnings">
          <div style={{ 
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <strong style={{ color: '#856404' }}>
              {lowStockMaterials.length} raw material(s) have low stock levels
            </strong>
          </div>
          <Table 
            columns={[
              { key: 'name', label: 'Raw Material' },
              { 
                key: 'stockQuantity', 
                label: 'Current Stock',
                render: (row) => (
                  <span style={{ 
                    color: row.stockQuantity < 5 ? '#e74c3c' : '#f39c12',
                    fontWeight: 'bold'
                  }}>
                    {row.stockQuantity || 0}
                  </span>
                )
              }
            ]} 
            data={lowStockMaterials} 
          />
        </Card>
      )}

      {/* Production Notes */}
      <Card title=" Production Notes">
        <div style={{ color: '#7f8c8d', lineHeight: '1.8' }}>
          <p><strong>Priority Algorithm:</strong> Products are prioritized by highest unit value to maximize revenue.</p>
          <p><strong>Stock Calculation:</strong> The system calculates the maximum quantity of each product that can be produced based on available raw materials.</p>
          <p><strong>Material Allocation:</strong> Raw materials are allocated to higher-value products first. Once a material is allocated, remaining stock is used for lower-priority products.</p>
          <p><strong>Real-time Updates:</strong> Click "Refresh Plan" to recalculate based on current inventory levels.</p>
        </div>
      </Card>
    </div>
  )
}

export default ProductionPlan
