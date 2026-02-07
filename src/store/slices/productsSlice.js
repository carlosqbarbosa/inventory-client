import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as productsAPI from '../../services/api/productsAPI'


export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    const response = await productsAPI.getAllProducts()
    return response.data
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id) => {
    const response = await productsAPI.getProductById(id)
    return response.data
  }
)

export const createProduct = createAsyncThunk(
  'products/create',
  async (product) => {
    const response = await productsAPI.createProduct(product)
    return response.data
  }
)

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, product }) => {
    const response = await productsAPI.updateProduct(id, product)
    return response.data
  }
)

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id) => {
    await productsAPI.deleteProduct(id)
    return id
  }
)

export const addRawMaterialToProduct = createAsyncThunk(
  'products/addRawMaterial',
  async ({ productId, rawMaterial }) => {
    const response = await productsAPI.addRawMaterialToProduct(productId, rawMaterial)
    return { productId, data: response.data }
  }
)

export const removeRawMaterialFromProduct = createAsyncThunk(
  'products/removeRawMaterial',
  async ({ productId, rawMaterialId }) => {
    await productsAPI.removeRawMaterialFromProduct(productId, rawMaterialId)
    return { productId, rawMaterialId }
  }
)

export const updateRawMaterialQuantity = createAsyncThunk(
  'products/updateRawMaterialQuantity',
  async ({ productId, rawMaterialId, quantity }) => {
    const response = await productsAPI.updateRawMaterialQuantity(productId, rawMaterialId, quantity)
    return { productId, data: response.data }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload
      })
      
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload)
      })
  },
})

export const { clearSelectedProduct, clearError } = productsSlice.actions
export default productsSlice.reducer