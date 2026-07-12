import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically inject the JWT bearer token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getConversations = async () => {
  const response = await API.get('/conversations');
  return response.data;
};

export const getConversationById = async (id) => {
  const response = await API.get(`/conversations/${id}`);
  return response.data;
};

export const sendMessageToAI = async (content, conversationId = null) => {
  const response = await API.post('/chat', { content, conversationId });
  return response.data;
};

export const renameConversation = async (id, title) => {
  const response = await API.put(`/conversations/${id}`, { title });
  return response.data;
};

export const deleteConversation = async (id) => {
  const response = await API.delete(`/conversations/${id}`);
  return response.data;
};

export default API;
