import apiClient from './client'

const RAW_MATERIALS_ENDPOINT = '/raw-materials'

export const getAllRawMaterials = () => {
  return apiClient.get(RAW_MATERIALS_ENDPOINT)
}

export const getRawMaterialById = (id) => {
  return apiClient.get(`${RAW_MATERIALS_ENDPOINT}/${id}`)
}

export const createRawMaterial = (rawMaterial) => {
  return apiClient.post(RAW_MATERIALS_ENDPOINT, rawMaterial)
}

export const updateRawMaterial = (id, rawMaterial) => {
  return apiClient.put(`${RAW_MATERIALS_ENDPOINT}/${id}`, rawMaterial)
}

export const deleteRawMaterial = (id) => {
  return apiClient.delete(`${RAW_MATERIALS_ENDPOINT}/${id}`)
}

export const updateStock = (id, quantity) => {
  console.log(' UPDATE STOCK API Call:', { id, quantity })
  
  return apiClient.patch(`${RAW_MATERIALS_ENDPOINT}/${id}/stock`, null, {
    params: { quantity }
  }).then(response => {
    console.log(' UPDATE STOCK Response:', response.data)
    return response
  }).catch(error => {
    console.error(' UPDATE STOCK Error:', error)
    throw error
  })
}

export const increaseStock = (id, quantity) => {
  console.log(' INCREASE STOCK API Call:', { id, quantity })
  
  return apiClient.post(
    `${RAW_MATERIALS_ENDPOINT}/${id}/stock/increase`,
    { quantity }
  ).then(response => {
    console.log(' INCREASE STOCK Response:', response.data)
    return response
  }).catch(error => {
    console.error(' INCREASE STOCK Error:', error)
    throw error
  })
}

export const decreaseStock = (id, quantity) => {
  console.log(' DECREASE STOCK API Call:', { id, quantity })
  
  return apiClient.post(
    `${RAW_MATERIALS_ENDPOINT}/${id}/stock/decrease`,
    { quantity }
  ).then(response => {
    console.log(' DECREASE STOCK Response:', response.data)
    return response
  }).catch(error => {
    console.error(' DECREASE STOCK Error:', error)
    throw error
  })
}

export const getLowStock = () => {
  return apiClient.get(`${RAW_MATERIALS_ENDPOINT}/low-stock`)
}

export const searchByName = (name) => {
  return apiClient.get(`${RAW_MATERIALS_ENDPOINT}/search`, {
    params: { name }
  })
}