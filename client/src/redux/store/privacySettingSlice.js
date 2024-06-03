// redux/store/privacySettingsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch privacy settings
export const fetchPrivacySettings = createAsyncThunk(
  'privacySettings/fetchPrivacySettings',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // Retrieve the auth token from state
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/privacy-settings`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update privacy settings
export const updatePrivacySettings = createAsyncThunk(
  'privacySettings/updatePrivacySettings',
  async ({ userId, settings }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // Retrieve the auth token from state
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/privacy-settings`, settings, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const privacySettingSlice = createSlice({
    name: 'privacySettings',
    initialState: {
      settings: null,
      status: 'idle',
      error: null,
    },
    reducers: {
      resetStatus: (state) => {
        state.status = 'idle';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchPrivacySettings.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchPrivacySettings.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.settings = action.payload;
        })
        .addCase(fetchPrivacySettings.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(updatePrivacySettings.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(updatePrivacySettings.fulfilled, (state) => {
          state.status = 'succeeded';
        })
        .addCase(updatePrivacySettings.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export const { resetStatus } = privacySettingSlice.actions;
  
  export default privacySettingSlice.reducer;