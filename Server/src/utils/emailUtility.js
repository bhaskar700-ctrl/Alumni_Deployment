// src/utils/emailUtility.js
import nodemailer from 'nodemailer';

export const sendPasswordResetEmail = async (email, token) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        // ... other settings ...
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Setting up email options and sending the email
    // ...
};
