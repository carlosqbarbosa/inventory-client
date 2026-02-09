import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as productionPlanAPI from '../../services/api/productionPlanAPI'

export const fetchProductionPlan = createAsyncThunk(
  'productionPlan/fetch',
  async () => {
    const response = await productionPlanAPI.getProductionPlan()
    return response.data
  }
)

export const fetchProductionForProduct = createAsyncThunk(
  'productionPlan/fetchForProduct',
  async (productId) => {
    const response = await productionPlanAPI.getProductionForProduct(productId)
    return response.data
  }
)

export const checkCanProduce = createAsyncThunk(
  'productionPlan/checkCanProduce',
  async ({ productId, quantity }) => {
    const response = await productionPlanAPI.canProduceQuantity(productId, quantity)
    return response.data
  }
)

const productionPlanSlice = createSlice({
  name: 'productionPlan',
  initialState: {
    plan: null,
    productProduction: null,
    canProduceResult: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProductionPlan: (state) => {
      state.plan = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchProductionPlan.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductionPlan.fulfilled, (state, action) => {
        state.loading = false
        state.plan = action.payload
      })
      .addCase(fetchProductionPlan.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      
      .addCase(fetchProductionForProduct.fulfilled, (state, action) => {
        state.productProduction = action.payload
      })
  
      .addCase(checkCanProduce.fulfilled, (state, action) => {
        state.canProduceResult = action.payload
      })
  },
})

export const { clearProductionPlan, clearError } = productionPlanSlice.actions
export default productionPlanSlice.reducer