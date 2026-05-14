import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export function getProducts() {
  return api.get('/produtos/');
}

export function getProduct(id) {
  return api.get(`/produtos/${id}`);
}

export function login(email, password) {
  return api.post('/auth/login', { email, password });
}

export function register(data) {
  return api.post('/auth/register', data);
}

export default api;
