import express from 'express';
import {
    getGalleryItems,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
} from '../controllers/galleryController.js';
import authenticate from '../../middleware/authenticate.js';
import upload from '../../middleware/upload.js'; // Import your upload middleware

const router = express.Router();

router.get('/', authenticate, getGalleryItems);
router.post('/', authenticate, upload, createGalleryItem);
router.put('/:id', authenticate, upload, updateGalleryItem);
router.delete('/:id', authenticate, deleteGalleryItem);

export default router;
