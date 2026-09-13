const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const isFormData = options.body instanceof FormData;
  if (isFormData) {
    delete defaultHeaders['Content-Type'];
  }

  const config = {
    ...options,
    headers: isFormData ? options.headers : { ...defaultHeaders, ...options.headers },
    credentials: 'include', // Include httpOnly cookies
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  reorderCategories: (order) => request('/categories/reorder', { method: 'PUT', body: JSON.stringify({ order }) }),

  // Food Items
  getFoodItems: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/food-items${queryString}`);
  },
  getFoodItem: (slug) => request(`/food-items/${slug}`),
  createFoodItem: (data) => request('/food-items', { method: 'POST', body: JSON.stringify(data) }),
  updateFoodItem: (id, data) => request(`/food-items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleFoodStatus: (id, field) => request(`/food-items/${id}/toggle`, { method: 'PATCH', body: JSON.stringify({ field }) }),
  deleteFoodItem: (id) => request(`/food-items/${id}`, { method: 'DELETE' }),

  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (userData) => request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),

  // Orders
  createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => request('/orders/mine'),
  getAllOrders: () => request('/orders'),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Upload (Cloudinary)
  uploadImage: async (file, folder = 'food-court') => {
    const formData = new FormData();
    formData.append('image', file);
    return request(`/upload?folder=${folder}`, {
      method: 'POST',
      body: formData,
    });
  },
};
