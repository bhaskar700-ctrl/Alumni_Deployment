import express from 'express';
import multer from 'multer';
import studentUploadController from '../controllers/studentUploadController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });  // Temporary storage directory

router.post('/students/upload', upload.single('file'), studentUploadController.uploadStudents);

export default router;