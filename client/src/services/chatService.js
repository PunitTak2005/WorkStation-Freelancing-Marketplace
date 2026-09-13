import api from './api';

export const chatService = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId, params) =>
    api.get(`/chat/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, data) =>
    api.post(`/chat/conversations/${conversationId}/messages`, data),
  startConversation: (recipientId) =>
    api.post('/chat/conversations', { recipientId }),
};

export default chatService;
