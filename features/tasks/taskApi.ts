
import axios from "axios";
import { Task, TaskStatus } from './taskTypes';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && !token.startsWith('mock-at-')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const isNetworkError = (error: any) => !error.response;

// Updated mock tasks to use the same structure as backend DTOs
const INITIAL_TASKS: Task[] = [
  { 
    id: 't1', 
    title: 'Submit Expense Report', 
    description: 'Monthly travel expenses for March.', 
    status: 'SUBMITTED', 
    createdBy: { id: '1', name: 'John Employee', email: 'employee@company.com', role: 'EMPLOYEE' } as any, 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: 't2', 
    title: 'Security Audit Prep', 
    description: 'Prepare documents for ISO 27001.', 
    status: 'DRAFT', 
    createdBy: { id: '1', name: 'John Employee', email: 'employee@company.com', role: 'EMPLOYEE' } as any, 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
];

const getStoredTasks = (): Task[] => {
  const stored = localStorage.getItem('mock_tasks');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('mock_tasks', JSON.stringify(INITIAL_TASKS));
  return INITIAL_TASKS;
};

export const mockTaskApi = {
  getTasks: async () => {
    await new Promise(r => setTimeout(r, 600));
    return getStoredTasks();
  },
  getTaskById: async (id: string) => {
    await new Promise(r => setTimeout(r, 300));
    const tasks = getStoredTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    return task;
  },
  createTask: async (taskData: Partial<Task>) => {
    await new Promise(r => setTimeout(r, 800));
    const tasks = getStoredTasks();
    const newTask: Task = {
      id: 't-' + Date.now(),
      title: taskData.title || 'Untitled',
      description: taskData.description || '',
      status: 'DRAFT',
      createdBy: { id: '1', name: 'John Employee', email: 'employee@company.com', role: 'EMPLOYEE' } as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newTask, ...tasks];
    localStorage.setItem('mock_tasks', JSON.stringify(updated));
    return newTask;
  },
  updateStatus: async (id: string, status: TaskStatus) => {
    await new Promise(r => setTimeout(r, 500));
    const tasks = getStoredTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    tasks[index] = { ...tasks[index], status, updatedAt: new Date().toISOString() };
    localStorage.setItem('mock_tasks', JSON.stringify(tasks));
    return tasks[index];
  }
};

export const taskApi = {
  getTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error: any) {
      if (isNetworkError(error)) return mockTaskApi.getTasks();
      throw error;
    }
  },
  getTaskById: async (id: string) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error: any) {
      if (isNetworkError(error)) return mockTaskApi.getTaskById(id);
      throw error;
    }
  },
  createTask: async (taskData: any) => {
    try {
      // Backend expects TaskRequest DTO: { title, description }
      const response = await api.post('/tasks', {
        title: taskData.title,
        description: taskData.description
      });
      return response.data;
    } catch (error: any) {
      if (isNetworkError(error)) return mockTaskApi.createTask(taskData);
      throw error;
    }
  },
  updateStatus: async (id: string, status: TaskStatus) => {
    try {
      let endpoint = `/tasks/${id}/submit`;
      if (status === 'APPROVED') endpoint = `/approvals/${id}/approve`;
      if (status === 'REJECTED') endpoint = `/approvals/${id}/reject`;
      
      const response = await api.post(endpoint);
      return response.data;
    } catch (error: any) {
      if (isNetworkError(error)) return mockTaskApi.updateStatus(id, status);
      throw error;
    }
  }
};
