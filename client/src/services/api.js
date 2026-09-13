import axios from 'axios';
import { store } from '../store/store';
import { setCredentials, logout } from '../store/slices/authSlice';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const authState = store.getState()?.auth || {};
    const token =
      authState.token ||
      authState.accessToken ||
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken');

    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh on auth endpoints (login, register, refresh) or if already retried
    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/verify-email');

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthRoute) {
      // If no token exists in state or storage, do not attempt to refresh
      const currentToken =
        store.getState()?.auth?.token ||
        store.getState()?.auth?.accessToken ||
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken');

      if (!currentToken || currentToken === 'null' || currentToken === 'undefined') {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
        const data = response.data?.data || response.data || {};
        const newAccessToken = data.accessToken || data.token;
        const user = data.user;

        if (newAccessToken) {
          store.dispatch(setCredentials({ accessToken: newAccessToken, token: newAccessToken, user }));
          processQueue(null, newAccessToken);

          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
          return api(originalRequest);
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
