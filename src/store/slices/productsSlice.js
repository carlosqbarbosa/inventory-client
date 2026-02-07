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
  async ({ productId, rawMaterial }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.addRawMaterialToProduct(productId, rawMaterial)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const removeRawMaterialFromProduct = createAsyncThunk(
  'products/removeRawMaterial',
  async ({ productId, rawMaterialId }, { rejectWithValue }) => {
    try {
      await productsAPI.removeRawMaterialFromProduct(productId, rawMaterialId)
      
      const response = await productsAPI.getProductById(productId)
      
      console.log(' Product after delete:', response.data)
      
      return response.data 
    } catch (error) {
      console.error(' Remove failed:', error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateRawMaterialQuantity = createAsyncThunk(
  'products/updateRawMaterialQuantity',
  async ({ productId, rawMaterialId, quantity }) => {
    const response = await productsAPI.updateRawMaterialQuantity(productId, rawMaterialId, quantity)
    return response.data
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

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
 
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload
        }
      })
      
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload)
      })

      .addCase(addRawMaterialToProduct.fulfilled, (state, action) => {
        const productId = action.payload.id
        
        const index = state.items.findIndex(p => p.id === productId)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        
        if (state.selectedProduct?.id === productId) {
          state.selectedProduct = action.payload
        }
      })
      
      .addCase(removeRawMaterialFromProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(removeRawMaterialFromProduct.fulfilled, (state, action) => {
        state.loading = false
        const product = action.payload 
        
        console.log(' Updated product from server:', product)
        
        const index = state.items.findIndex(p => p.id === product.id)
        if (index !== -1) {
          state.items[index] = product
        }
        
        if (state.selectedProduct?.id === product.id) {
          state.selectedProduct = product
        }
      })
      .addCase(removeRawMaterialFromProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      
      .addCase(updateRawMaterialQuantity.fulfilled, (state, action) => {
        const productId = action.payload.id
        
        const index = state.items.findIndex(p => p.id === productId)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        
        if (state.selectedProduct?.id === productId) {
          state.selectedProduct = action.payload
        }
      })
  },
})

export const { clearSelectedProduct, clearError } = productsSlice.actions
export default productsSlice.reducer