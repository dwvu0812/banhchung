import axios from 'axios';
import { Vocabulary, UserProgress, StudySession } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },
};

export const vocabularyAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    topic?: string;
  }) => {
    const response = await api.get('/vocabulary', { params });
    return response.data;
  },

  search: async (query: string, page = 1, limit = 20) => {
    const response = await api.get('/vocabulary/search', {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Vocabulary> => {
    const response = await api.get(`/vocabulary/${id}`);
    return response.data;
  },

  getTopics: async (): Promise<string[]> => {
    const response = await api.get('/vocabulary/topics');
    return response.data;
  },

  initializeSampleData: async () => {
    const response = await api.post('/vocabulary/initialize');
    return response.data;
  },

  seedIeltsVocabulary: async () => {
    const response = await api.post('/vocabulary/seed-ielts');
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  getProgress: async (): Promise<UserProgress[]> => {
    const response = await api.get('/users/progress');
    return response.data;
  },

  getDueVocabulary: async (): Promise<StudySession[]> => {
    const response = await api.get('/users/due-vocabulary');
    return response.data;
  },

  updateProgress: async (vocabularyId: string, correct: boolean) => {
    const response = await api.post(`/users/progress/${vocabularyId}`, {
      correct,
    });
    return response.data;
  },
};

export default api;