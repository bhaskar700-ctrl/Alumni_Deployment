// controllers/friendRequestController.js
import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';

const FriendRequestController = {
    async sendFriendRequest(req, res) {
        try {
            const senderId = req.user._id; // Get sender's ID from authenticated user
            const { receiverId } = req.body;

            // Prevent sending request to self
            if (senderId.equals(receiverId)) {
                return res.status(400).json({ message: 'Cannot send friend request to yourself' });
            }

            // Check if the receiver exists
            const receiverExists = await User.exists({ _id: receiverId });
            if (!receiverExists) {
                return res.status(404).json({ message: 'Receiver not found' });
            }

            // Prevent duplicate friend requests
            const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
            if (existingRequest) {
                return res.status(400).json({ message: 'Friend request already sent' });
            }

            const newRequest = new FriendRequest({ sender: senderId, receiver: receiverId });
            await newRequest.save();

            res.status(201).json({ message: 'Friend request sent', request: newRequest });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    

    async acceptFriendRequest(req, res) {
        try {
            const { requestId } = req.params;
            const request = await FriendRequest.findById(requestId);

            if (!request || request.status !== 'pending') {
                return res.status(400).json({ message: 'Invalid request' });
            }

            // Add to each user's friend list, checking for duplicates
            const sender = await User.findById(request.sender);
            const receiver = await User.findById(request.receiver);

            if (!sender.friends.includes(receiver._id)) {
                sender.friends.push(receiver._id);
            }
            if (!receiver.friends.includes(sender._id)) {
                receiver.friends.push(sender._id);
            }

            await sender.save();
            await receiver.save();

            request.status = 'accepted';
            await request.save();

            res.status(200).json({ message: 'Friend request accepted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async rejectFriendRequest(req, res) {
        try {
            const { requestId } = req.params;
            const request = await FriendRequest.findOne({ _id: requestId, status: 'pending' });

            if (!request) {
                return res.status(404).json({ message: 'Friend request not found or already processed' });
            }

            request.status = 'rejected';
            await request.save();

            res.status(200).json({ message: 'Friend request rejected' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async viewFriendRequests(req, res) {
        try {
            const { userId } = req.params;

            // Validate user existence
            const userExists = await User.exists({ _id: userId });
            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            }

            const requests = await FriendRequest.find({ receiver: userId, status: 'pending' })
                .populate('sender', 'name'); // Adjust according to your User model

            res.status(200).json(requests);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default FriendRequestController;
