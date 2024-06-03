import express from 'express';
import eventController from '../controllers/eventController.js';
import authenticate from '../../middleware/authenticate.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.post('/create', authenticate, upload, eventController.createEvent);
router.get('/all', eventController.getAllEvents);

// Specific routes for past and upcoming events
router.get('/past', eventController.getPastEvents); // Route for past events
router.get('/upcoming', eventController.getUpcomingEvents); // Route for upcoming events

// Generic route for fetching event by ID
router.get('/:eventId', eventController.getEventById);

// Update and delete routes
router.put('/update/:eventId', authenticate, upload, eventController.updateEvent);
router.delete('/delete/:eventId', authenticate, eventController.deleteEvent);

export default router;
