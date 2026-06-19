import axios from 'axios';

const API = axios.create({
  baseURL: 'https://school-management-system-ux11.onrender.com/api',
});

// Agar aap headers mein token bhejti hain
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;