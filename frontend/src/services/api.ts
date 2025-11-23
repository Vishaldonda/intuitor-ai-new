/**
 * API client for backend communication.
 * Centralized axios instance with auth token management.
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH API =============

export const authAPI = {
  register: async (email: string, password: string, fullName: string) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('access_token');
    const response = await apiClient.get(`/auth/me?access_token=${token}`);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },
};

// ============= COURSE API =============

export const courseAPI = {
  getCourses: async () => {
    const response = await apiClient.get('/courses');
    return response.data;
  },

  getCourse: async (courseId: string) => {
    const response = await apiClient.get(`/courses/${courseId}`);
    return response.data;
  },
};

// ============= TOPIC API =============

export const topicAPI = {
  getTopic: async (topicId: string) => {
    const response = await apiClient.get(`/topics/${topicId}`);
    return response.data;
  },

  getTopicsByCourse: async (courseId: string) => {
    const response = await apiClient.get(`/topics/course/${courseId}`);
    return response.data;
  },
};

// ============= QUESTION API =============

export const questionAPI = {
  generateQuestion: async (data: {
    user_id: string;
    topic_id: string;
    subtopic_id?: string;
    difficulty: string;
    question_type: string;
  }) => {
    const response = await apiClient.post('/questions/generate', data);
    return response.data;
  },

  generateAdaptiveQuestion: async (userId: string, topicId: string) => {
    const response = await apiClient.post(
      `/questions/adaptive?user_id=${userId}&topic_id=${topicId}`
    );
    return response.data;
  },

  getQuestion: async (questionId: string) => {
    const response = await apiClient.get(`/questions/${questionId}`);
    return response.data;
  },
};

// ============= EVALUATION API =============

export const evaluationAPI = {
  submitAnswer: async (data: {
    question_id: string;
    user_id: string;
    selected_option_id?: string;
    snippet_answer?: string;
    code_solution?: string;
    language?: string;
  }) => {
    const response = await apiClient.post('/evaluation/submit', data);
    return response.data;
  },

  getHint: async (questionId: string, hintIndex: number) => {
    const response = await apiClient.post(`/evaluation/hint/${questionId}`, {
      hint_index: hintIndex,
    });
    return response.data;
  },
};

// ============= PROGRESS API =============

export const progressAPI = {
  getUserProgress: async (userId: string) => {
    const response = await apiClient.get(`/progress/user/${userId}`);
    return response.data;
  },

  getTopicProgress: async (userId: string, topicId: string) => {
    const response = await apiClient.get(`/progress/topic/${userId}/${topicId}`);
    return response.data;
  },

  getLeaderboard: async (limit: number = 10) => {
    const response = await apiClient.get(`/progress/leaderboard?limit=${limit}`);
    return response.data;
  },

  getUserStats: async (userId: string) => {
    const response = await apiClient.get(`/progress/stats/${userId}`);
    return response.data;
  },
};
