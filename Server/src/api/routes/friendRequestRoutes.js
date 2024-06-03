import express from 'express';
import FriendRequestController from '../controllers/friendRequestController.js';
import authenticate from '../../middleware/authenticate.js'; // Assuming you have authentication middleware
import { check } from 'express-validator'; // If using express-validator for input validation

const router = express.Router();

// Send a friend request
router.post('/send', 
    authenticate, 
    [
        check('senderId').isMongoId(),
        check('receiverId').isMongoId()
    ],
    FriendRequestController.sendFriendRequest);

// Accept a friend request
router.put('/accept/:requestId', 
    authenticate, 
    [check('requestId').isMongoId()],
    FriendRequestController.acceptFriendRequest);

// Reject a friend request
router.put('/reject/:requestId', 
    authenticate, 
    [check('requestId').isMongoId()],
    FriendRequestController.rejectFriendRequest);

// View all friend requests for a user
router.get('/view/:userId', 
    authenticate, 
    [check('userId').isMongoId()],
    FriendRequestController.viewFriendRequests);

export default router;
