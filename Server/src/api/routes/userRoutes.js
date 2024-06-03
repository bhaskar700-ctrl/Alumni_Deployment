// src/routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser, resetPassword, requestPasswordReset } from '../controllers/userController.js';
// import authenticate from '../../middleware/authenticate.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-reset-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

// Route for token verification
router.post('/login/verifyToken', (req, res) => {
    // Extract the token from the request body
    const token = req.body.token;
  
    // Verify the token
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        // If verification fails, return an error response
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        // If verification succeeds, return the decoded token (user information)
        return res.status(200).json({ user: decodedToken.user });
      }
    });
  });

// Protected route
// router.get('/profile', authenticate, (req, res) => {
//     // Assuming you have a controller function to handle profile retrieval
//     // You can access the authenticated user with req.user
//     res.send(req.user);
// });

export default router;
