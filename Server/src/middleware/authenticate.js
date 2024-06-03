import jwt from 'jsonwebtoken';
import User from '../api/models/User.js'; // Adjust the path according to your project structure
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure you're using the correct field from the decoded token
        const userId = decoded.userId;
        const userType = decoded.userType;

        // Check if the userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ message: 'Invalid User ID format.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).send({ message: 'Authentication failed: User not found.' });
        }

        // Optional: Verify user role for role-based access control
        if (!userType || !['admin', 'student', 'faculty', 'alumni'].includes(userType)) {
            return res.status(403).send({ message: 'Access denied: Invalid user role.' });
        }

        req.user = user; // Attach the user document to the request
        req.userType = userType; // Attach userType to the request for role-based content
        req.token = token; // Attach the token to the request
        next();
    } catch (error) {
        // Enhanced error handling
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).send({ message: 'Session expired. Please log in again.' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).send({ message: 'Invalid token. Please log in again.' });
        } else {
            res.status(401).send({ message: 'Please authenticate.' });
        }
    }
};

export default authenticate;
