import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  googleLogin: (idToken) => api.post('/auth/google', { idToken }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Restaurants API calls
export const restaurantsAPI = {
  getAll: (filters = {}) => api.get('/restaurants', { params: filters }),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (restaurantData) => api.post('/restaurants', restaurantData),
  update: (id, updateData) => api.put(`/restaurants/${id}`, updateData),
  delete: (id) => api.delete(`/restaurants/${id}`),
  getByOwner: () => api.get('/restaurants/owner/my-restaurants'),
};

// Reservations API calls
export const reservationsAPI = {
  create: (reservationData) => api.post('/reservations', reservationData),
  getMyReservations: () => api.get('/reservations/my-reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  updateStatus: (id, status, additionalData = {}) => 
    api.patch(`/reservations/${id}/status`, { status, ...additionalData }),
  cancel: (id) => api.patch(`/reservations/${id}/cancel`),
  getByRestaurant: (restaurantId, filters = {}) => 
    api.get(`/reservations/restaurant/${restaurantId}`, { params: filters }),
};

// Users API calls (admin only)
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  toggleStatus: (id) => api.patch(`/users/${id}/status`),
};

export default api;
