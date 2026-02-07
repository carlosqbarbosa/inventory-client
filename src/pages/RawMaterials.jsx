import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../components/common/Card/Card'
import Table from '../components/common/Table/Table'
import Button from '../components/common/Button/Button'
import Loading from '../components/common/Loading/Loading'
import { fetchRawMaterials } from '../store/slices/rawMaterialsSlice'

const RawMaterials = () => {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(state => state.rawMaterials)

  useEffect(() => {
    dispatch(fetchRawMaterials())
  }, [dispatch])

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'stockQuantity', label: 'Stock' },
  ]

  return (
    <div>
      <h1>Raw Materials</h1>

      <Card title="Raw Materials Stock">
        {loading ? (
          <Loading />
        ) : (
          <Table columns={columns} data={items} />
        )}
      </Card>

      <Button variant="secondary">Add Raw Material</Button>
    </div>
  )
}

export default RawMaterials
