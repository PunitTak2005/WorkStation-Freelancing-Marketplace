import api from './api';

export const paymentService = {
  fundMilestone: (contractId, milestoneIndex) =>
    api.post(`/contracts/${contractId}/milestones/${milestoneIndex}/fund`),
  verifyPayment: (contractId, milestoneIndex, paymentData) =>
    api.post(
      `/contracts/${contractId}/milestones/${milestoneIndex}/verify-payment`,
      paymentData
    ),
  releaseMilestone: (contractId, milestoneIndex) =>
    api.post(`/contracts/${contractId}/milestones/${milestoneIndex}/approve`),
  getPaymentHistory: (params) => api.get('/payments/history', { params }),
};

export default paymentService;
