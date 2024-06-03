import express from 'express';
import authenticate from '../../middleware/authenticate.js';
import upload from '../../middleware/upload.js';
import MessageController from '../controllers/messageController.js';

function messageRoutes(io) {
    const router = express.Router();
    const messageController = new MessageController(io);

    router.post('/send', authenticate, upload, (req, res) => messageController.sendMessage(req, res));
    router.get('/conversation/:otherUserId', authenticate, (req, res) => messageController.getConversation(req, res));
    router.get('/search', authenticate, (req, res) => messageController.searchMessages(req, res));
    router.post('/messages/:messageId/read', authenticate, (req, res) => messageController.markAsRead(req, res));
    router.put('/messages/:messageId', authenticate, (req, res) => messageController.editMessage(req, res));
    router.delete('/messages/:messageId', authenticate, (req, res) => messageController.deleteMessage(req, res));
    router.get('/list', authenticate, (req, res) => messageController.listConversations(req, res));
    router.post('/start', authenticate, (req, res) => messageController.startConversation(req, res));
    router.get('/users', authenticate, (req, res) => messageController.getAllUsers(req, res));
    router.get('/chatted-users', authenticate, (req, res) => messageController.listChattedUsers(req, res));

    return router;
}

export default messageRoutes;
