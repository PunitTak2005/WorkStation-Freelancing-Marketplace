import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logout, setLoading, updateUser } from '../store/slices/authSlice';
import api from '../services/api';
import { useCallback, useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      dispatch(setCredentials(response.data?.data || response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      dispatch(setCredentials(response.data?.data || response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const performLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      dispatch(logout());
    }
  };

  const checkAuth = useCallback(async () => {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken');

    if (!token || token === 'null' || token === 'undefined') {
      dispatch(setLoading(false));
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const userData =
        response.data?.user ||
        response.data?.data?.user ||
        (response.data?.data?._id ? response.data.data : null);
      const activeToken =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.data?.token ||
        response.data?.data?.accessToken ||
        token;

      if (userData) {
        dispatch(
          setCredentials({
            user: userData,
            token: activeToken,
            accessToken: activeToken,
          })
        );
      } else {
        dispatch(logout());
      }
    } catch (error) {
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const updateUserData = (userData) => {
    dispatch(updateUser(userData));
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout: performLogout,
    checkAuth,
    updateUser: updateUserData,
    updateUserData,
  };
};
