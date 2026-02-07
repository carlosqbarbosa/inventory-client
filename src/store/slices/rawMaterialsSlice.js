import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as rawMaterialsAPI from '../../services/api/rawMaterialsAPI'

export const fetchRawMaterials = createAsyncThunk(
  'rawMaterials/fetchAll',
  async () => {
    const response = await rawMaterialsAPI.getAllRawMaterials()
    return response.data
  }
)

export const fetchRawMaterialById = createAsyncThunk(
  'rawMaterials/fetchById',
  async (id) => {
    const response = await rawMaterialsAPI.getRawMaterialById(id)
    return response.data
  }
)

export const createRawMaterial = createAsyncThunk(
  'rawMaterials/create',
  async (rawMaterial) => {
    const response = await rawMaterialsAPI.createRawMaterial(rawMaterial)
    return response.data
  }
)

export const updateRawMaterial = createAsyncThunk(
  'rawMaterials/update',
  async ({ id, rawMaterial }) => {
    const response = await rawMaterialsAPI.updateRawMaterial(id, rawMaterial)
    return response.data
  }
)

export const deleteRawMaterial = createAsyncThunk(
  'rawMaterials/delete',
  async (id) => {
    await rawMaterialsAPI.deleteRawMaterial(id)
    return id
  }
)

export const updateStock = createAsyncThunk(
  'rawMaterials/updateStock',
  async ({ id, quantity }) => {
    const response = await rawMaterialsAPI.updateStock(id, quantity)
    return response.data
  }
)

export const increaseStock = createAsyncThunk(
  'rawMaterials/increaseStock',
  async ({ id, quantity }) => {
    const response = await rawMaterialsAPI.increaseStock(id, quantity)
    return response.data
  }
)

export const decreaseStock = createAsyncThunk(
  'rawMaterials/decreaseStock',
  async ({ id, quantity }) => {
    const response = await rawMaterialsAPI.decreaseStock(id, quantity)
    return response.data
  }
)

export const fetchLowStock = createAsyncThunk(
  'rawMaterials/fetchLowStock',
  async (threshold = 10) => {
    const response = await rawMaterialsAPI.getLowStock(threshold)
    return response.data
  }
)

const rawMaterialsSlice = createSlice({
  name: 'rawMaterials',
  initialState: {
    items: [],
    lowStockItems: [],
    selectedRawMaterial: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedRawMaterial: (state) => {
      state.selectedRawMaterial = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all raw materials
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch raw material by ID
      .addCase(fetchRawMaterialById.fulfilled, (state, action) => {
        state.selectedRawMaterial = action.payload
      })
      // Create raw material
      .addCase(createRawMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      // Update raw material
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        const index = state.items.findIndex(rm => rm.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // Delete raw material
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter(rm => rm.id !== action.payload)
      })
      // Update stock
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.items.findIndex(rm => rm.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // Increase stock
      .addCase(increaseStock.fulfilled, (state, action) => {
        const index = state.items.findIndex(rm => rm.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // Decrease stock
      .addCase(decreaseStock.fulfilled, (state, action) => {
        const index = state.items.findIndex(rm => rm.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // Fetch low stock items
      .addCase(fetchLowStock.fulfilled, (state, action) => {
        state.lowStockItems = action.payload
      })
  },
})

export const { clearSelectedRawMaterial, clearError } = rawMaterialsSlice.actions
export default rawMaterialsSlice.reducer