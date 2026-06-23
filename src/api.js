const API_URL = process.env.REACT_APP_API_URL || '/api';

const getUserInfo = () => {
  const savedUser = localStorage.getItem('userInfo');
  return savedUser ? JSON.parse(savedUser) : null;
};

const request = async (path, options = {}) => {
  const userInfo = getUserInfo();
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Doslo je do greske');
  }

  return data;
};

export const getProducts = () => request('/products');
export const getProduct = (id) => request(`/products/${id}`);
export const createProduct = (product) => request('/products', { method: 'POST', body: JSON.stringify(product) });
export const updateProduct = (id, product) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) });
export const deleteProduct = (id) => request(`/products/${id}`, { method: 'DELETE' });
export const createReview = (id, review) => request(`/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(review) });

export const loginUser = (credentials) => request('/users/auth', { method: 'POST', body: JSON.stringify(credentials) });
export const registerUser = (user) => request('/users', { method: 'POST', body: JSON.stringify(user) });
export const logoutUser = () => request('/users/logout', { method: 'POST' });
export const getUsers = () => request('/users');

export const createOrder = (order) => request('/orders', { method: 'POST', body: JSON.stringify(order) });
export const getOrder = (id) => request(`/orders/${id}`);
export const getOrders = () => request('/orders');
export const updateOrderStatus = (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
export const markOrderDelivered = (id) => request(`/orders/${id}/deliver`, { method: 'PUT' });