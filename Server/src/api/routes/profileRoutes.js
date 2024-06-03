// In your profileRoutes.js
import express from 'express';
import ProfileController from '../controllers/profileController.js';
import authenticate from '../../middleware/authenticate.js'; // Ensure this path is correct based on your project structure

const router = express.Router();

// Protect all profile-related routes with authentication using the `authenticate` middleware

// Get the authenticated user's profile
router.get('/profile', authenticate, ProfileController.getProfile);

// Edit the authenticated user's profile
router.put('/profile', authenticate, ProfileController.editProfile);

// Update the authenticated user's privacy settings
router.put('/privacy', authenticate, ProfileController.updatePrivacySettings);

// Upload profile picture
router.post('/upload', authenticate, ProfileController.uploadProfilePicture, ProfileController.handleProfilePictureUpload);

export default router;
