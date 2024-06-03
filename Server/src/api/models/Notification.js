import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    },
    message: {
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    link: String,
    read: { 
        type: Boolean, 
        default: false 
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
