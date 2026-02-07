import apiClient from './client'

const PRODUCTS_ENDPOINT = '/products'

export const getAllProducts = () => {
  return apiClient.get(PRODUCTS_ENDPOINT)
}

export const getProductById = (id) => {
  return apiClient.get(`${PRODUCTS_ENDPOINT}/${id}`)
}

export const createProduct = (product) => {
  return apiClient.post(PRODUCTS_ENDPOINT, product)
}

export const updateProduct = (id, product) => {
  return apiClient.put(`${PRODUCTS_ENDPOINT}/${id}`, product)
}

export const deleteProduct = (id) => {
  return apiClient.delete(`${PRODUCTS_ENDPOINT}/${id}`)
}

// Product raw materials management
export const getProductRawMaterials = (productId) => {
  return apiClient.get(`${PRODUCTS_ENDPOINT}/${productId}/raw-materials`)
}

export const addRawMaterialToProduct = (productId, rawMaterial) => {
  return apiClient.post(`${PRODUCTS_ENDPOINT}/${productId}/raw-materials`, rawMaterial)
}

export const updateRawMaterialQuantity = (productId, rawMaterialId, quantity) => {
  return apiClient.put(
    `${PRODUCTS_ENDPOINT}/${productId}/raw-materials/${rawMaterialId}`,
    { quantity }
  )
}

export const removeRawMaterialFromProduct = (productId, rawMaterialId) => {
  return apiClient.delete(`${PRODUCTS_ENDPOINT}/${productId}/raw-materials/${rawMaterialId}`)
}