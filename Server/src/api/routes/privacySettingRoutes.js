// routes/privacySettingsRoutes.js
import express from 'express';
import {
  getPrivacySettings,
  updatePrivacySettings,
} from '../controllers/privacySettingController.js';
import authenticate from '../../middleware/authenticate.js'; // Adjust the path according to your project structure

const router = express.Router();

router.get('/users/:userId/privacy-settings', authenticate, getPrivacySettings);
router.put('/users/:userId/privacy-settings', authenticate, updatePrivacySettings);

export default router;
