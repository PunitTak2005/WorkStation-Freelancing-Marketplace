import { Router } from 'express';
import {
  createOrGetConversation,
  getConversations,
  sendMessage,
  getMessages,
  markAsRead,
} from '../controllers/chatController.js';
import { protect } from '../middlewares/auth.js';
import { uploadMultiple } from '../middlewares/upload.js';

const router = Router();

router.use(protect); // All chat routes require authentication

router.post('/conversations', createOrGetConversation);
router.get('/conversations', getConversations);
router.patch('/conversations/:conversationId/read', markAsRead);
router.post('/messages', uploadMultiple('attachments', 5), sendMessage);
router.get('/messages/:conversationId', getMessages);

export default router;
