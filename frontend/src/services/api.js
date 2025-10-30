import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - configured for your network
// Use localhost for web testing, or your IP address for mobile device testing
const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (login, password) => {
    const response = await api.post('/auth/login', { login, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Tournament API
export const tournamentAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/tournaments', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/tournaments/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/tournaments', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/tournaments/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/tournaments/${id}`);
    return response.data;
  },
  register: async (id, data) => {
    const response = await api.post(`/tournaments/${id}/register`, data);
    return response.data;
  },
  getPlayers: async (id) => {
    const response = await api.get(`/tournaments/${id}/players`);
    return response.data;
  },
  getStandings: async (id) => {
    const response = await api.get(`/tournaments/${id}/standings`);
    return response.data;
  },
  getRound: async (tournamentId, roundNumber) => {
    const response = await api.get(`/tournaments/${tournamentId}/rounds/${roundNumber}`);
    return response.data;
  },
  createRound: async (tournamentId) => {
    const response = await api.post(`/tournaments/${tournamentId}/rounds`);
    return response.data;
  },
  deleteRound: async (tournamentId, roundNumber) => {
    const response = await api.delete(`/tournaments/${tournamentId}/rounds/${roundNumber}`);
    return response.data;
  },
  updatePlayerList: async (tournamentId, playerId, data) => {
    const response = await api.put(`/tournaments/${tournamentId}/players/${playerId}`, data);
    return response.data;
  },
  unregisterPlayer: async (tournamentId, playerId) => {
    const response = await api.delete(`/tournaments/${tournamentId}/players/${playerId}`);
    return response.data;
  },
  getCoOrganizers: async (tournamentId) => {
    const response = await api.get(`/tournaments/${tournamentId}/co-organizers`);
    return response.data;
  },
  addCoOrganizer: async (tournamentId, userId) => {
    const response = await api.post(`/tournaments/${tournamentId}/co-organizers`, { userId });
    return response.data;
  },
  removeCoOrganizer: async (tournamentId, userId) => {
    const response = await api.delete(`/tournaments/${tournamentId}/co-organizers/${userId}`);
    return response.data;
  },
  transferOwnership: async (tournamentId, newOwnerId) => {
    const response = await api.post(`/tournaments/${tournamentId}/transfer-ownership`, { newOwnerId });
    return response.data;
  },
};

// Match API
export const matchAPI = {
  submitResult: async (matchId, data) => {
    const response = await api.post(`/tournaments/matches/${matchId}/result`, data);
    return response.data;
  },
  updateResult: async (matchId, data) => {
    const response = await api.put(`/tournaments/matches/${matchId}/result`, data);
    return response.data;
  },
  deleteResult: async (matchId) => {
    const response = await api.delete(`/tournaments/matches/${matchId}/result`);
    return response.data;
  },
};

// Player API
export const playerAPI = {
  getStatistics: async (playerId) => {
    const response = await api.get(`/tournaments/players/${playerId}/statistics`);
    return response.data;
  },
  dropFromTournament: async (tournamentId, playerId) => {
    const response = await api.post(`/tournaments/${tournamentId}/players/${playerId}/drop`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

export default api;
