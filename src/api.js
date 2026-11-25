import axios from 'axios'

export const TOKEN_KEY = 'triplog_token'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const isAuthRequest = /\/auth\/(login|register)(?:\?|$)/.test(config.url ?? '')

  if (isAuthRequest) {
    delete config.headers.Authorization
    return config
  }

  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export async function registerUser({ username, email, password }) {
  const response = await api.post('/auth/register', { username, email, password })
  return response.data
}

export async function loginUser({ email, password }) {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export async function createReview({ destination, rating, content }) {
  const response = await api.post('/reviews', { destination, rating, content })
  return response.data
}

export function getApiErrorMessage(error, fallback) {
  const responseData = axios.isAxiosError(error) ? error.response?.data : null

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData
  }

  if (typeof responseData?.message === 'string' && responseData.message.trim()) {
    return responseData.message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
