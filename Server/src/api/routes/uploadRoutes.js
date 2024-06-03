import express from 'express';
import multer from 'multer';
import uploadController from '../controllers/uploadController.js'; // Adjust the path if necessary

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage directory

router.post('/students/upload', upload.single('file'), uploadController.uploadStudents);
router.post('/faculty/upload', upload.single('file'), uploadController.uploadFaculty);
router.post('/admins/upload', upload.single('file'), uploadController.uploadAdmins);
router.post('/alumni/upload', upload.single('file'), uploadController.uploadAlumni);

export default router;
