import api from './api';

export const reviewService = {
  getPublicReviews: (params) => api.get('/reviews', { params }),
  getUserReviews: (userId, params) => api.get(`/reviews/user/${userId}`, { params }),
  createReview: (data) => api.post('/reviews', data),
};

export default reviewService;
