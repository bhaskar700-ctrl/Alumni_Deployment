import Event from '../models/Event.js';
import User from '../models/User.js';
import NotificationController from './notificationController.js';
import path from 'path';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const eventController = {
    createEvent: async (req, res) => {
        try {
            const { title, description, location, startDate, endDate, organizer, imageUrl } = req.body;

            let image = imageUrl;
            if (req.file) {
                image = `/uploads/images/${req.file.filename}`;
            }

            console.log('Image path:', image);

            const newEvent = new Event({ title, description, location, startDate, endDate, organizer, image });
            await newEvent.save();

            const users = await User.find({});
            users.forEach(user => {
                NotificationController.createNotification(
                    user._id,
                    'New Event',
                    `New event created: ${title}`,
                    `/events/${newEvent._id}`
                );
            });

            res.status(201).json(newEvent);
        } catch (error) {
            console.error('Error creating event:', error);
            res.status(400).json({ message: error.message });
        }
    },

    getAllEvents: async (req, res) => {
        try {
            const events = await Event.find().sort({ createdAt: -1 }).populate('organizer', 'name');
            res.status(200).json(events);
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ message: error.message });
        }
    },
    
    getEventById: async (req, res) => {
        try {
            const { eventId } = req.params;
            console.log('Event ID:', eventId);

            if (!isValidObjectId(eventId)) {
                return res.status(400).json({ message: 'Invalid event ID' });
            }

            const event = await Event.findById(eventId).populate('organizer', 'name');
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json(event);
        } catch (error) {
            console.error('Error fetching event by ID:', error);
            res.status(500).json({ message: error.message });
        }
    },

    updateEvent: async (req, res) => {
        try {
            const { eventId } = req.params;
            console.log('Event ID:', eventId);

            if (!isValidObjectId(eventId)) {
                return res.status(400).json({ message: 'Invalid event ID' });
            }

            console.log('Request body:', req.body); // Log request body
            console.log('Uploaded file:', req.file); // Log uploaded file

            const { title, description, location, startDate, endDate } = req.body;
            const updatedEventData = { title, description, location, startDate, endDate };

            if (req.file) {
                updatedEventData.image = `/uploads/images/${path.basename(req.file.path)}`;
            }

            console.log('Updated event data:', updatedEventData); // Debugging: Log the updated event data

            const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedEventData, { new: true });
            if (!updatedEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }

            const users = await User.find({});
            users.forEach(user => {
                NotificationController.createNotification(
                    user._id,
                    'Event Update',
                    `Event updated: ${updatedEvent.title}`,
                    `/events/${updatedEvent._id}`
                );
            });

            res.status(200).json(updatedEvent);
        } catch (error) {
            console.error('Error updating event:', error);
            res.status(400).json({ message: error.message });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const { eventId } = req.params;
            console.log('Event ID:', eventId);

            if (!isValidObjectId(eventId)) {
                return res.status(400).json({ message: 'Invalid event ID' });
            }

            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            const title = event.title;

            await Event.findByIdAndDelete(eventId);

            const users = await User.find({});
            users.forEach(user => {
                NotificationController.createNotification(
                    user._id,
                    'Event Cancellation',
                    `Event canceled: ${title}`,
                    `/events`
                );
            });

            res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
            console.error('Error deleting event:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getPastEvents: async (req, res) => {
        try {
            const currentDate = new Date();
            const pastEvents = await Event.find({ startDate: { $lt: currentDate } })
                                          .sort({ startDate: -1 })
                                          .populate('organizer', 'name');
            res.status(200).json(pastEvents);
        } catch (error) {
            console.error('Error fetching past events:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getUpcomingEvents: async (req, res) => {
        try {
            const currentDate = new Date();
            const upcomingEvents = await Event.find({ startDate: { $gte: currentDate } })
                                              .sort({ startDate: 1 })
                                              .populate('organizer', 'name');
            res.status(200).json(upcomingEvents);
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

export default eventController;
