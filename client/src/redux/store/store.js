import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import forumReducer from './forumSlice';
import jobReducer from './jobSlice';
import eventReducer from './eventSlice';
import userReducer from './userSlice';
import chattingReducer from './chattingSlice';
import donationReducer from './donationSlice'; // Import the donation slice
import donationAnalyticsReducer from './donationAnalyticsSlice'; 
import userDirectoryReducer from './userDirectorySlice';
import uploadReducer from './uploadSlice';
import preUserReducer from './preUserSlice'
import passwordResetReducer from './passwordResetSlice';
import statsReducer from "./statsSlice";
import notificationReducer from './notificationSlice';
import galleryReducer from './gallerySlice';
import privacySettingReducer from './privacySettingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forum: forumReducer,
    jobs: jobReducer,
    events: eventReducer,
    user: userReducer,
    chatting: chattingReducer,
    donations: donationReducer, // Add the donation slice here
    donationAnalytics: donationAnalyticsReducer,
    userDirectory: userDirectoryReducer,
    upload: uploadReducer,
    preUser: preUserReducer,
    passwordReset: passwordResetReducer,
    stats: statsReducer,
    notifications: notificationReducer,
    gallery: galleryReducer,
    privacySettings: privacySettingReducer,
  },
});
