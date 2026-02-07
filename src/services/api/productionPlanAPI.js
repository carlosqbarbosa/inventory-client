import apiClient from './client'

const PRODUCTION_PLAN_ENDPOINT = '/production-plan'

export const getProductionPlan = () => {
  return apiClient.get(PRODUCTION_PLAN_ENDPOINT)
}

export const getProductionForProduct = (productId) => {
  return apiClient.get(`${PRODUCTION_PLAN_ENDPOINT}/product/${productId}`)
}

export const canProduceQuantity = (productId, quantity) => {
  return apiClient.get(`${PRODUCTION_PLAN_ENDPOINT}/product/${productId}/can-produce`, {
    params: { quantity }
  })
}