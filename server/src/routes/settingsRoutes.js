import express from 'express';
import { 
  getSettings,
  updateGeneral,
  updateAccount,
  changePassword,
  updateNotifications,
  updateAppearance,
  updatePrivacy,
  updateBilling,
  toggleConnectedAccount,
  terminateSession,
  terminateAllSessions,
  exportUserData,
  deleteAccount
} from '../controllers/settingsController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect); // All settings routes require authentication

router.get('/', getSettings);
router.put('/general', updateGeneral);
router.put('/account', updateAccount);
router.put('/security', changePassword);
router.put('/notifications', updateNotifications);
router.put('/appearance', updateAppearance);
router.put('/privacy', updatePrivacy);
router.put('/billing', updateBilling);
router.post('/connected-accounts/:provider/toggle', toggleConnectedAccount);
router.delete('/sessions/:sessionId', terminateSession);
router.post('/sessions/signout-all', terminateAllSessions);
router.post('/export', exportUserData);
router.post('/danger/delete-account', deleteAccount);

export default router;
