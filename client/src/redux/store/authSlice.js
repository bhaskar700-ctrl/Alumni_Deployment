import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state for authentication
const initialState = {
    isAuthenticated: false,
    token: null,
    user: null, // This will store detailed user information
    status: 'idle',
    error: null,
};

// Async thunk for fetching user profile
export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/profile`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Slice for authentication
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { token, userType, personalDetails, contactInfo, _id } = action.payload;
            state.isAuthenticated = true;
            state.token = token;
            state.user = {
                id: _id, // Storing the user ID here
                userType,
                personalDetails,
                contactInfo,
            };
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
        },
        loginFailure: (state, action) => {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
                console.log('User fetched successfully:', action.payload); // Add this log
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                console.log('Error fetching user:', action.payload); // Add this log
            });
    },
});

export const { loginSuccess, logout, loginFailure } = authSlice.actions;

// Selectors to get authentication state
export const selectAuth = (state) => state.auth.isAuthenticated;
export const selectUserDetails = (state) => state.auth.user;
export const selectUserToken = (state) => state.auth.token;
export const selectUserType = (state) => state.auth.user?.userType; // Add this selector

export default authSlice.reducer;
