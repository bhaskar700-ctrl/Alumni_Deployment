import User from '../models/User.js';
import path from 'path';
import multer from 'multer';

// Set up storage and filename for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
    }
});

const upload = multer({ storage: storage });

const ProfileController = {
    // Fetch the authenticated user's profile
    async getProfile(req, res) {
        try {
            const user = req.user.toObject(); // Convert the Mongoose document to a plain JavaScript object
            delete user.password; // Exclude password from the result

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Edit the authenticated user's profile
    async editProfile(req, res) {
        try {
            const userId = req.user._id; // Use _id from the authenticated user
            const { personalDetails, contactInfo, educationHistory, workExperience, roleDetails } = req.body;

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: { personalDetails, contactInfo, educationHistory, workExperience, roleDetails } },
                { new: true, omitUndefined: true }
            ).select('-password'); // Exclude password from the result

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'Profile updated successfully', profile: updatedUser });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update the authenticated user's privacy settings
    async updatePrivacySettings(req, res) {
        try {
            const userId = req.user._id; // Use _id from the authenticated user
            const { privacySettings } = req.body;

            const user = await User.findByIdAndUpdate(
                userId,
                { $set: { privacySettings } },
                { new: true, omitUndefined: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'Privacy settings updated successfully', privacySettings: user.privacySettings });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Upload profile picture
    uploadProfilePicture: upload.single('profilePicture'),

    async handleProfilePictureUpload(req, res) {
        try {
            const fileUrl = `/uploads/${req.file.filename}`; // Assuming you serve files from the 'uploads' directory
            res.status(200).json({ url: fileUrl });
        } catch (error) {
            res.status(500).json({ error: 'Failed to upload file' });
        }
    }
};

export default ProfileController;
