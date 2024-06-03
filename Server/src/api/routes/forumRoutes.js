// src/api/routes/forumRoutes.js
import express from 'express';
import ForumControllerInit from '../controllers/forumController.js';
import authenticate from '../../middleware/authenticate.js'; // Ensure the path is correct
import upload from '../../middleware/upload.js'; // Ensure the path is correct

// This function will initialize the ForumController with the Socket.IO instance
export default function forumRoutes(io) {
  const ForumController = ForumControllerInit(io);

  const router = express.Router();

  // Apply the authenticate middleware to secure routes
  router.post('/post', authenticate, upload, ForumController.createPost); // Use the middleware as an argument
  router.post('/post/:postId/comment', authenticate, ForumController.commentOnPost);
  router.post('/post/:postId/comment/:commentId/reply', authenticate, ForumController.replyToComment);
  router.put('/post/:postId', authenticate, ForumController.editPost);
  router.delete('/post/:postId', authenticate, ForumController.deletePost);
  router.post('/post/:postId/like', authenticate, ForumController.likePost);

  // Public routes
  router.get('/posts', ForumController.getAllPosts);
  router.get('/post/:postId', ForumController.getPost);
  router.get('/posts/search', ForumController.searchPosts);
  router.get('/users/:userId/posts/count', ForumController.getPostCount);
  router.get('/posts/count', ForumController.getTotalPostCount); 
  router.get('/users/:userId/posts', ForumController.getUserPosts);

  return router;
}
