import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://catering-app-x6j7.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

// Menu APIs
export const menuAPI = {
  getMenuItems: (params) => apiClient.get('/menu', { params }),
  getMenuItemById: (id) => apiClient.get(`/menu/${id}`),
  getCategories: () => apiClient.get('/menu/categories'),
  findMatch: (name) => apiClient.get('/menu/find-match', { params: { name } }),
  createMenuItem: (data) => {
    if (data instanceof FormData) {
      return apiClient.post('/menu', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return apiClient.post('/menu', data);
  },
  updateMenuItem: (id, data) => {
    if (data instanceof FormData) {
      return apiClient.put(`/menu/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return apiClient.put(`/menu/${id}`, data);
  },
  deleteMenuItem: (id) => apiClient.delete(`/menu/${id}`),
};

// Order APIs
export const orderAPI = {
  createOrder: (data) => apiClient.post('/orders', data),
  getUserOrders: (params) => apiClient.get('/orders', { params }),
  getActiveOrder: () => apiClient.get('/orders/active'),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  cancelOrder: (id) => apiClient.put(`/orders/${id}/cancel`),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
  getAllOrders: (params) => apiClient.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => apiClient.put(`/admin/orders/${id}/status`, { status }),
  getAllUsers: (params) => apiClient.get('/admin/users', { params }),
  toggleUserStatus: (id) => apiClient.put(`/admin/users/${id}/toggle-status`),
  getMenuItemsAdmin: (params) => apiClient.get('/admin/menu-items', { params }),
  getRevenueAnalytics: (params) => apiClient.get('/admin/analytics/revenue', { params }),
};

export default apiClient;
