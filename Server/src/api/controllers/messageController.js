import Message from '../models/Message.js';
import User from '../models/User.js';
import Group from '../models/Group.js';
import NotificationController from './notificationController.js';

class MessageController {
    constructor(io) {
        this.io = io;
    }

    async sendMessage(req, res) {
        try {
          const senderId = req.user._id;
          const { receiverId, content, groupId } = req.body;
          let mediaUrl = null;
      
          if (req.file) {
            if (req.file.mimetype.startsWith('image/')) {
              mediaUrl = `/uploads/images/${req.file.filename}`;
            } else if (req.file.mimetype.startsWith('video/')) {
              mediaUrl = `/uploads/videos/${req.file.filename}`;
            } else {
              mediaUrl = `/uploads/documents/${req.file.filename}`;
            }
          }
      
          let newMessage;
      
          if (groupId) {
            const group = await Group.findById(groupId);
            if (!group) {
              return res.status(404).json({ message: 'Group not found' });
            }
      
            newMessage = new Message({ sender: senderId, content, mediaUrl, groupId });
            await newMessage.save();
      
            console.log('New group message:', newMessage);
      
            // Emit the message to all group members
            group.members.forEach(memberId => {
              this.io.to(memberId.toString()).emit('message:newMessage', newMessage);
            });
          } else {
            const receiver = await User.findById(receiverId);
            if (!receiver) {
              return res.status(404).json({ message: 'Receiver not found' });
            }
      
            newMessage = new Message({ sender: senderId, receiver: receiverId, content, mediaUrl });
            await newMessage.save();
      
            console.log('New direct message:', newMessage);
      
            // Emit the message to both the sender and receiver using their user IDs as room names
            this.io.to(senderId.toString()).emit('message:newMessage', newMessage);
            this.io.to(receiverId.toString()).emit('message:newMessage', newMessage);
      
            NotificationController.createNotification(
              receiverId,
              'New Message',
              `You have a new message from ${req.user.name}`,
              `/messages/${newMessage._id}`
            );
          }
      
          res.status(201).json({ message: 'Message sent', data: newMessage });
        } catch (error) {
          res.status(500).json({ message: 'Error sending message: ' + error.message });
        }
    }
    async getAllUsers(req, res) {
        const userId = req.user._id;

        try {
            const users = await User.find({ _id: { $ne: userId } })
                                     .select("personalDetails.firstName personalDetails.lastName personalDetails.profilePicture");
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users: ' + error.message });
        }
    }

    async searchUsers(req, res) {
        const { query } = req.query;
        const userId = req.user._id;

        const users = await User.find({
            $text: { $search: query },
            _id: { $ne: userId }
        })
        .select("personalDetails.firstName personalDetails.lastName personalDetails.profilePicture");

        res.status(200).json(users);
    }

    async getConversation(req, res) {
        const userId = req.user._id;
        const { otherUserId } = req.params;
    
        try {
            const messages = await Message.find({
                $or: [
                    { sender: userId, receiver: otherUserId },
                    { sender: otherUserId, receiver: userId }
                ]
            })
            .sort({ createdAt: 1 })
            .populate('sender receiver', 'personalDetails.firstName personalDetails.lastName personalDetails.profilePicture');
    
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving conversation: ' + error.message });
        }
    }

    async listConversations(req, res) {
        try {
            const userId = req.user._id;
            const searchQuery = req.query.search;

            let matchStage = {
                $match: {
                    $or: [{ sender: userId }, { receiver: userId }]
                }
            };

            if (searchQuery) {
                matchStage = {
                    $match: {
                        $or: [{ sender: userId }, { receiver: userId }],
                        $text: { $search: searchQuery }
                    }
                };
            }

            const conversations = await Message.aggregate([
                matchStage,
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: {
                            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"]
                        },
                        lastMessage: { $first: "$$ROOT" }
                    }
                },
                {
                    $sort: { "lastMessage.createdAt": -1 }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: "$userDetails"
                },
                {
                    $project: {
                        _id: 1,
                        lastMessage: 1,
                        "userDetails.personalDetails": 1
                    }
                }
            ]);

            res.status(200).json(conversations);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving conversations: ' + error.message });
        }
    }

    async startConversation(req, res) {
        const { userId } = req.user._id;
        const { receiverId } = req.body;

        try {
            const receiver = await User.findById(receiverId);
            if (!receiver) {
                return res.status(404).json({ message: 'Receiver not found' });
            }

            const existingConversation = await Message.findOne({
                $or: [
                    { sender: userId, receiver: receiverId },
                    { sender: receiverId, receiver: userId }
                ]
            });

            if (existingConversation) {
                return res.status(400).json({ message: 'Conversation already exists' });
            }

            res.status(200).json({ message: 'Conversation started', data: { receiverId: receiver._id } });
        } catch (error) {
            res.status(500).json({ message: 'Error starting conversation: ' + error.message });
        }
    }

    async searchMessages(req, res) {
        try {
            const userId = req.user._id;
            const { query } = req.query;

            const messages = await Message.find({
                $text: { $search: query },
                $or: [{ sender: userId }, { receiver: userId }]
            })
            .populate('sender receiver', 'personalDetails.firstName personalDetails.lastName personalDetails.profilePicture');

            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: 'Error searching messages: ' + error.message });
        }
    }

    async markAsRead(req, res) {
        const { messageId } = req.params;
        const userId = req.user._id;

        try {
            const message = await Message.findById(messageId);
            if (!message.readBy.includes(userId)) {
                message.readBy.push(userId);
                await message.save();
                this.io.to(message.sender.toString()).emit('messageRead', { messageId, userId });
            }
            res.status(200).json({ message: 'Message marked as read' });
        } catch (error) {
            res.status(500).json({ message: 'Error marking message as read: ' + error.message });
        }
    }

    async editMessage(req, res) {
        const { messageId } = req.params;
        const { content } = req.body;
    
        try {
            const updatedMessage = await Message.findByIdAndUpdate(
                messageId,
                { content, editedAt: new Date() },
                { new: true }
            ).populate('sender receiver', 'personalDetails.firstName personalDetails.lastName personalDetails.profilePicture'); // Ensure it includes sender and receiver details
            
            this.io.to(updatedMessage.receiver.toString()).emit('messageEdited', updatedMessage);
            res.status(200).json(updatedMessage);
        } catch (error) {
            res.status(500).json({ message: 'Error editing message: ' + error.message });
        }
    }
    
    

    async deleteMessage(req, res) {
        try {
            const { messageId } = req.params;
            const message = await Message.findById(messageId);

            if (!message) {
                return res.status(404).json({ message: 'Message not found' });
            }

            if (message.sender.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Unauthorized to delete this message' });
            }

            await Message.findByIdAndDelete(messageId);

            this.io.to(message.receiver.toString()).emit('deleteMessage', messageId);

            res.status(200).json({ message: 'Message successfully deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting message: ' + error.message });
        }
    }

    async listChattedUsers(req, res) {
        try {
            const userId = req.user._id;

            const users = await Message.aggregate([
                {
                    $match: {
                        $or: [{ sender: userId }, { receiver: userId }]
                    }
                },
                {
                    $group: {
                        _id: {
                            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: "$userDetails"
                },
                {
                    $project: {
                        _id: 0,
                        "userDetails._id": 1,
                        "userDetails.personalDetails.firstName": 1,
                        "userDetails.personalDetails.lastName": 1,
                        "userDetails.personalDetails.profilePicture": 1
                    }
                }
            ]);

            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving chatted users: ' + error.message });
        }
    }
}

export default MessageController;
