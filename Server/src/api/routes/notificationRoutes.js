import express from 'express';
import NotificationController from '../controllers/notificationController.js'; // Adjust the path according to your project structure

const router = express.Router();

router.get('/:userId', NotificationController.getUserNotifications);
router.put('/:notificationId/read', NotificationController.markNotificationAsRead);

export default router;
