// routes/groupRoutes.js
import express from 'express';
import authenticate from '../../middleware/authenticate.js';
import GroupController from '../controllers/groupController.js';

const router = express.Router();

router.post('/create', authenticate, (req, res) => GroupController.createGroup(req, res));
router.post('/:groupId/add-member', authenticate, (req, res) => GroupController.addMember(req, res));
router.post('/:groupId/remove-member', authenticate, (req, res) => GroupController.removeMember(req, res));
router.get('/', authenticate, (req, res) => GroupController.getUserGroups(req, res));

export default router;
