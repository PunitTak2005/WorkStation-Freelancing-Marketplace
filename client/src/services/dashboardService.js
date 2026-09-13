import api from './api';

export const dashboardService = {
  getPublicStats: () => api.get('/dashboard/public-stats'),
  getClientDashboard: () => api.get('/dashboard/client'),
  getFreelancerDashboard: () => api.get('/dashboard/freelancer'),
  getAdminStats: () => api.get('/admin/stats'),
};

export default dashboardService;
