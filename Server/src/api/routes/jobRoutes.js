// routes/jobRoutes.js
import express from 'express';
import jobController from '../controllers/jobController.js';
import authenticate from '../../middleware/authenticate.js';
import upload from '../../middleware/upload.js'; // Import the upload middleware

const router = express.Router();

router.post('/create', authenticate, upload, jobController.createJob);
router.get('/all', jobController.getAllJobs);
router.get('/:jobId', jobController.getJobById);
router.put('/update/:jobId', authenticate, upload, jobController.updateJob);
router.delete('/delete/:jobId', authenticate, jobController.deleteJob);

export default router;
