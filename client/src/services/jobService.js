import api from './api';

export const jobService = {
  getJobs: (params) => api.get('/jobs', { params }),
  getTrendingJobs: () => api.get('/jobs/trending'),
  getJobCategories: () => api.get('/jobs/categories'),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (formData) =>
    api.post('/jobs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: (params) => api.get('/jobs/my-jobs', { params }),
  toggleSaveJob: (id) => api.put(`/jobs/${id}/save`),
  getSavedJobs: () => api.get('/jobs/saved'),
  getProjectsCount: (params) => api.get('/projects/count', { params }),
};

export const projectService = jobService;
export default jobService;
