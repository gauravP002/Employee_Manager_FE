import axios from "axios";
import { User } from './authTypes';

const API_BASE_URL = 'http://localhost:8080/api';
const MOCK_USERS: User[] = [
  { id: '1', name: 'John Employee', email: 'employee@company.com', role: 'EMPLOYEE', createdAt: new Date().toISOString() },
  { id: '2', name: 'Sarah Manager', email: 'manager@company.com', role: 'MANAGER', createdAt: new Date().toISOString() },
];
const api = axios.create({
  baseURL: API_BASE_URL,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const isNetworkError = (error: any) => !error.response && error.code !== 'ECONNABORTED';
export const mockAuthApi = {
  login: async ({ email, password }: any) => {
    await new Promise(r => setTimeout(r, 800));
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    if (password !== 'password') throw new Error('Invalid credentials');
    
    return {
      user,
      accessToken: 'mock-at-' + Math.random(),
      refreshToken: 'mock-rt-' + Math.random(),
    };
  },
  me: async () => {
    await new Promise(r => setTimeout(r, 400));
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No token');
    const isMockToken = token.startsWith('mock-at-');
    return isMockToken ? MOCK_USERS[0] : MOCK_USERS[0]; // Fallback for demo
  }
};

export const authApi = {
  login: async (credentials: any) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (isNetworkError(error)) {
        console.warn("Backend unreachable, falling back to mock auth.");
        return mockAuthApi.login(credentials);
      }
      throw error;
    }
  },
  me: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      if (isNetworkError(error)) {
        return mockAuthApi.me();
      }
      throw error;
    }
  }
};
