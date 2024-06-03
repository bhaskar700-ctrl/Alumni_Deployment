import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String },
  mediaUrl: { type: String, default: '' }, // Field to store media URLs with a default value
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  delivered: { type: Boolean, default: false }, // New field
  read: { type: Boolean, default: false }, // New field
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // Field for group chats
  editedAt: { type: Date } // Field to track when a message is edited
}, {
  timestamps: true // Automatically manage `createdAt` and `updatedAt` fields
});

// Add a text index to the content field for search functionality
messageSchema.index({ content: 'text' });

messageSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.editedAt = new Date();
  }
  next();
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
