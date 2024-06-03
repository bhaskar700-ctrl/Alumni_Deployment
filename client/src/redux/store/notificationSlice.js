import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for the API
const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/notifications`;

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Could not fetch notifications');
        }
    }
);

// Async thunk to mark notification as read
export const markNotificationAsRead = createAsyncThunk(
    'notifications/markNotificationAsRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            await axios.put(`${BASE_URL}/${notificationId}/read`);
            return notificationId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Could not mark notification as read');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                state.notifications = state.notifications.map((notification) =>
                    notification._id === action.payload ? { ...notification, read: true } : notification
                );
            })
            .addCase(markNotificationAsRead.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export default notificationSlice.reducer;
