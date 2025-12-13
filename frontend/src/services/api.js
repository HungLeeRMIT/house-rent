import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      const { state } = JSON.parse(authStorage)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth storage on unauthorized
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
}

// Property APIs
export const propertyAPI = {
  getAll: () => api.get('/properties'),
  getAvailable: () => api.get('/properties/available'),
  getById: (id) => api.get(`/properties/${id}`),
  search: (params) => api.get('/properties/search', { params }),
  create: (propertyData) => api.post('/properties', propertyData),
  update: (id, propertyData) => api.put(`/properties/${id}`, propertyData),
  unlist: (id) => api.patch(`/properties/${id}/unlist`),
  delete: (id) => api.delete(`/properties/${id}`),
}

export default api

