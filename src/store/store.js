import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './slices/productsSlice'
import rawMaterialsReducer from './slices/rawMaterialsSlice'
import productionPlanReducer from './slices/productionPlanSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    productionPlan: productionPlanReducer,
  },
})