import Notification from '../models/Notification.js'; // Adjust the path according to your project structure

const NotificationController = {
    getUserNotifications: async (req, res) => {
        try {
            const userId = req.params.userId;
            const notifications = await Notification.find({ userId }).sort({ date: -1 });
            res.json(notifications);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    markNotificationAsRead: async (req, res) => {
        try {
            const notificationId = req.params.notificationId;
            await Notification.findByIdAndUpdate(notificationId, { read: true });
            res.send({ message: 'Notification marked as read' });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    createNotification: async (userId, type, message, link) => {
        try {
            const newNotification = new Notification({ userId, type, message, link });
            await newNotification.save();
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    }
};

export default NotificationController;
