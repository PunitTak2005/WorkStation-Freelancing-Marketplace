import api from './api';

export const userService = {
  getFreelancers: (params) => api.get('/freelancers', { params }),
  getFeaturedFreelancers: () => api.get('/freelancers/featured'),
  getPublicProfile: (id) => api.get(`/users/${id}`),
  getMyProfile: () => api.get('/users/profile/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  updateAvatar: (formData) =>
    api.put('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  addPortfolioItem: (formData) =>
    api.post('/users/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletePortfolioItem: (itemId) => api.delete(`/users/portfolio/${itemId}`),
};

export default userService;
