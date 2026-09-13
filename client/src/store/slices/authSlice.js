import { createSlice } from '@reduxjs/toolkit';

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  if (!token || token === 'null' || token === 'undefined') return null;
  return token;
};

const storedToken = getStoredToken();

const initialState = {
  user: null,
  accessToken: storedToken,
  token: storedToken,
  isAuthenticated: Boolean(storedToken),
  loading: Boolean(storedToken), // verify token on boot if one exists; otherwise false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const payload = action.payload || {};
      const user = payload.user || (payload.data && payload.data.user) || null;
      const token =
        payload.token ||
        payload.accessToken ||
        (payload.data && (payload.data.token || payload.data.accessToken)) ||
        null;

      if (user) {
        state.user = user;
      }
      if (token) {
        state.token = token;
        state.accessToken = token;
        try {
          localStorage.setItem('token', token);
          localStorage.setItem('accessToken', token);
        } catch (e) {
          console.error('Failed to save token to localStorage', e);
        }
      }
      state.isAuthenticated = Boolean(user || token);
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
      } catch (e) {
        console.error('Failed to remove token from localStorage', e);
      }
    },
    setLoading: (state, action) => {
      state.loading = Boolean(action.payload);
    },
    updateUser: (state, action) => {
      const updated = action.payload?.user || action.payload;
      state.user = { ...state.user, ...updated };
    },
  },
});

export const { setCredentials, logout, setLoading, updateUser } = authSlice.actions;
export default authSlice.reducer;
