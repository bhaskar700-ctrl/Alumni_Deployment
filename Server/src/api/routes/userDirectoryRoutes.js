// routes/userDirectoryRoutes.js

import express from 'express';
import {
  fetchUsers,
  getUserById,
  markFavorite,
  setUserOnlineStatus,
  getUserActivityFeed,
  getUserBadges,
  getProfileCompletion,
  // Import additional controller functions
} from '../controllers/userDirectoryController.js';
import authenticate from '../../middleware/authenticate.js'; // Adjust the path according to your project structure

const router = express.Router();

router.get('/users', authenticate, fetchUsers);
router.get('/users/:userId', authenticate, getUserById);
router.post('/users/:userId/favorite', authenticate, markFavorite);
router.post('/users/:userId/online-status', authenticate, setUserOnlineStatus);
router.get('/users/:userId/activity-feed', authenticate, getUserActivityFeed);
router.get('/users/:userId/badges', authenticate, getUserBadges);
router.get('/users/:userId/profile-completion', authenticate, getProfileCompletion);

// Additional routes for other features

export default router;
