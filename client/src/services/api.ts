import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }) => api.post('/auth/register', userData),
  
  getCurrentUser: () => api.get('/auth/me'),
  
  updateProfile: (userData: any) => api.put('/auth/profile', userData),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
  
  logout: () => api.post('/auth/logout'),
}

// Tasks API
export const tasksAPI = {
  getTasks: (params?: any) => api.get('/tasks', { params }),
  
  getTask: (id: string) => api.get(`/tasks/${id}`),
  
  createTask: (taskData: any) => api.post('/tasks', taskData),
  
  updateTask: (id: string, taskData: any) => api.put(`/tasks/${id}`, taskData),
  
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
  
  completeTask: (id: string) => api.post(`/tasks/${id}/complete`),
  
  addTimeEntry: (id: string, timeData: any) =>
    api.post(`/tasks/${id}/time-entry`, timeData),
  
  addNote: (id: string, noteData: any) =>
    api.post(`/tasks/${id}/notes`, noteData),
  
  getStats: () => api.get('/tasks/stats/overview'),
}

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updatePreferences: (preferences: any) =>
    api.put('/users/preferences', preferences),
  
  searchUsers: (query: string) => api.get('/users/search', { params: { query } }),
  
  getStats: () => api.get('/users/stats'),
}

// AI API
export const aiAPI = {
  getSuggestions: (title: string, description?: string) =>
    api.post('/ai/suggestions', { title, description }),
  
  processVoiceCommand: (command: string) =>
    api.post('/ai/voice-command', { command }),
  
  generateTemplate: (context: string, taskType?: string) =>
    api.post('/ai/template', { context, taskType }),
  
  categorizeTask: (title: string, description?: string) =>
    api.post('/ai/categorize', { title, description }),
}

// Gamification API
export const gamificationAPI = {
  getAchievements: () => api.get('/gamification/achievements'),
  
  getLeaderboard: (type?: string, limit?: number) =>
    api.get('/gamification/leaderboard', { params: { type, limit } }),
  
  getProgress: () => api.get('/gamification/progress'),
  
  awardAchievement: (achievementData: any) =>
    api.post('/gamification/award-achievement', achievementData),
  
  awardBadge: (badgeData: any) =>
    api.post('/gamification/award-badge', badgeData),
}

export default api 