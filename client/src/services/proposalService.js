import api from './api';

export const proposalService = {
  submitProposal: (jobId, data) => api.post(`/jobs/${jobId}/proposals`, data),
  getJobProposals: (jobId) => api.get(`/jobs/${jobId}/proposals`),
  getMyProposals: (params) => api.get('/proposals/my-proposals', { params }),
  getProposalById: (id) => api.get(`/proposals/${id}`),
  updateProposalStatus: (id, status) => api.put(`/proposals/${id}/status`, { status }),
  withdrawProposal: (id) => api.delete(`/proposals/${id}`),
};

export default proposalService;
