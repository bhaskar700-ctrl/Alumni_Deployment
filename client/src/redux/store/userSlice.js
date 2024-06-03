import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Setup Axios Instance
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/users`, // Use the environment variable and append /api/users
});

const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Async thunk for fetching the authenticated user's profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      const response = await axiosInstance.get('/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Could not fetch user profile');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Could not register user');
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      const response = await axiosInstance.put('/profile', profileData);
      // Inside updateUserProfile thunk
      console.log('Updating profile with data:', profileData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Could not update user profile');
    }
  }
);

// Async thunk for updating privacy settings
export const updatePrivacySettings = createAsyncThunk(
  'user/updatePrivacySettings',
  async (privacySettings, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      const response = await axiosInstance.put('/privacy', privacySettings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Could not update privacy settings');
    }
  }
);

// Async thunk for deleting user profile
export const deleteUserProfile = createAsyncThunk(
  'user/deleteUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      await axiosInstance.delete('/profile');
      return {}; // Return an empty object or any success indicator as needed
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Could not delete user profile');
    }
  }
);

const initialState = {
  profile: null,
  status: 'idle', // 'idle' | 'loading' | 'updating' | 'deleting' | 'succeeded' | 'failed'
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch profile';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload; // Assuming the response includes user profile data
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed';
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'updating';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update profile';
      })
      .addCase(updatePrivacySettings.pending, (state) => {
        state.status = 'updating';
      })
      .addCase(updatePrivacySettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Assuming the entire profile is returned, adjust as necessary
        state.profile = { ...state.profile, privacySettings: action.payload.privacySettings };
      })
      .addCase(updatePrivacySettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update privacy settings';
      })
      .addCase(deleteUserProfile.pending, (state) => {
        state.status = 'deleting';
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.status = 'succeeded';
        state.profile = null; // Clear profile data upon deletion
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete profile';
      });
  },
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;
