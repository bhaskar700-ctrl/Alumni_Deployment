// src/controllers/userControllers
import User from '../models/User.js';
import Student from '../models/Student.js';
import Alumni from '../models/Alumni.js';
import Admin from '../models/Admin.js';
import Faculty from '../models/Faculty.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import validator from 'validator';

dotenv.config();

const OAuth2 = google.auth.OAuth2;

// Register a new user

export async function registerUser(req, res) {
    const {
        userType,
        email,
        userId, // This could be studentId, facultyId, alumniId, or adminId depending on the userType
        dateOfBirth,
        password
    } = req.body;

    try {
        // Validate user type
        const validUserTypes = ['student', 'faculty', 'admin', 'alumni'];
        if (!validUserTypes.includes(userType)) {
            return res.status(400).json({ message: 'Invalid user type provided.' });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        // Validate date of birth
        const formattedDOB = new Date(dateOfBirth);
        if (isNaN(formattedDOB.getTime())) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }

        // Define model based on user type
        const RoleModel = { 'student': Student, 'faculty': Faculty, 'admin': Admin, 'alumni': Alumni }[userType];

        // Check role-specific ID and fetch existing data
        const roleData = await RoleModel.findOne({ [`${userType}Id`]: userId });
        if (!roleData) {
            return res.status(400).json({ message: `No authorized ${userType} found with the provided ID.` });
        }

        // Check for existing user in User model
        const userExists = await User.findOne({
            $or: [{ 'contactInfo.email': email }, { 'roleDetails.userId': userId }]
        });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email or ID' });
        }

        // Create a new user in the User model
        const newUser = await User.create({
            userType,
            personalDetails: { 
                firstName: roleData.name.split(' ')[0], // Assuming the name is stored as 'First Last'
                lastName: roleData.name.split(' ')[1] || '',
            },
            contactInfo: {
                email,
                phone: roleData.phoneNumber || '',
                address: roleData.address || ''
            },
            roleDetails: {
                userId: userId,
                ...roleData._doc // Spread operator to copy all relevant role-specific data
            },
            dateOfBirth: formattedDOB,
            password: password
        });

        // Generate a token for the new user
        const token = jwt.sign(
            { userId: newUser._id, userType: newUser.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            _id: newUser._id,
            userType: newUser.userType,
            personalDetails: newUser.personalDetails,
            contactInfo: newUser.contactInfo,
            token
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: error.message });
    }
};


// loginUser function
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ 'contactInfo.email': email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
              { userId: user._id, userType: user.userType },
              process.env.JWT_SECRET,
              { expiresIn: '1h' }
            );

            res.json({
                _id: user._id,
                userType: user.userType,
                personalDetails: user.personalDetails,
                contactInfo: user.contactInfo,
                token,
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password successfully reset' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: error.message });
    }
};


// Function to handle password reset request
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ 'contactInfo.email': email });

        if (user) {
            const token = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();
            await sendPasswordResetEmail(user.contactInfo.email, token);
        }

        // Send a generic response
        res.status(200).json({ message: 'If your email is registered, you will receive a password reset link' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to send password reset email
const sendPasswordResetEmail = async (email, token) => {
    const oauth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            accessToken: accessToken.token,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN
        }
    });

    const resetUrl = `${process.env.FRONTEND_RESET_PASSWORD_URL}/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset',
        // text: `You requested a password reset. Please go to this link to reset your password: ${resetUrl}`,
        // html: `<p>You requested a password reset. Please click on the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
        text: `Hello ${user.personalDetails.firstName},\n\nYou requested a password reset. Please go to this link to reset your password: ${resetUrl}`,
        html: `<p>Hello ${user.personalDetails.firstName},</p><p>You requested a password reset. Please click on the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        // Handle email sending error
    }
};