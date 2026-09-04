import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pulse_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pulse_token');
      localStorage.removeItem('pulse_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ---- Auth ----
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const fetchMe = () => api.get('/auth/me');
export const updateMe = (data) => api.put('/auth/me', data);

// ---- Posts ----
export const fetchPosts = (params) => api.get('/posts', { params });
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const publishPostNow = (id) => api.post(`/posts/${id}/publish`);

// ---- Analytics ----
export const fetchOverview = () => api.get('/analytics/overview');
export const fetchTrend = (platform, days) => api.get('/analytics/trend', { params: { platform, days } });
export const fetchEngagement = () => api.get('/analytics/engagement');
export const fetchAccounts = () => api.get('/analytics/accounts');

export default api;
