import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../components/common/Card/Card'
import Loading from '../components/common/Loading/Loading'
import { fetchProductionPlan } from '../store/slices/productionPlanSlice'

const ProductionPlan = () => {
  const dispatch = useDispatch()
  const { plan, loading } = useSelector(state => state.productionPlan)

  useEffect(() => {
    dispatch(fetchProductionPlan())
  }, [dispatch])

  if (loading) return <Loading fullScreen />

  return (
    <div>
      <h1>Production Plan</h1>

      <Card title="Current Production Plan">
        {!plan ? (
          <p>No production plan available</p>
        ) : (
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(plan, null, 2)}
          </pre>
        )}
      </Card>
    </div>
  )
}

export default ProductionPlan
