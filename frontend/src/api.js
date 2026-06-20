import axios from 'axios';

const API = axios.create({
  baseURL: 'https://school-management-system-ux11.onrender.com/api',
});

// automatic token aur multipart headers lagane ke liye
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // 💡 image upload karne ke liye yeh header hona zaroori hai
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

export default API;