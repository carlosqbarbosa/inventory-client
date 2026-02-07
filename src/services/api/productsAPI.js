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

export const getProductRawMaterials = (productId) => {
  return apiClient.get(`${PRODUCTS_ENDPOINT}/${productId}/raw-materials`)
}

export const addRawMaterialToProduct = (productId, rawMaterial) => {
  const payload = {
    rawMaterialId: rawMaterial.rawMaterialId,
    quantityRequired: rawMaterial.quantityRequired  
  }
  
  console.log(' ADD API Call:', { productId, payload })
  
  return apiClient.post(`${PRODUCTS_ENDPOINT}/${productId}/raw-materials`, payload)
}

export const updateRawMaterialQuantity = (productId, rawMaterialId, quantity) => {
  return apiClient.put(
    `${PRODUCTS_ENDPOINT}/${productId}/raw-materials/${rawMaterialId}`,
    { quantity }  
  )
}

export const removeRawMaterialFromProduct = (productId, rawMaterialId) => {
  const url = `${PRODUCTS_ENDPOINT}/${productId}/raw-materials/${rawMaterialId}`
  
  console.log(' DELETE API Call:', { 
    productId, 
    rawMaterialId,
    url,
    types: {
      productId: typeof productId,
      rawMaterialId: typeof rawMaterialId
    }
  })
  
  return apiClient.delete(url)
    .then(response => {
      console.log(' DELETE Response:', response)
      return response
    })
    .catch(error => {
      console.error(' DELETE Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: url
      })
      throw error
    })
}