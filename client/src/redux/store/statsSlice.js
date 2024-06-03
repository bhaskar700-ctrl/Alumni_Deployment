// src/features/stats/statsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/stats`;

export const fetchStats = createAsyncThunk('stats/fetchStats', async () => {
  const [usersRes, eventsRes, donationsRes, jobsRes] = await Promise.all([
    axios.get(`${API_BASE_URL}/users/count`),
    axios.get(`${API_BASE_URL}/events/count`),
    axios.get(`${API_BASE_URL}/donations/count`),
    axios.get(`${API_BASE_URL}/jobs/count`),
  ]);

  return {
    users: usersRes.data.count,
    events: eventsRes.data.count,
    donations: donationsRes.data.count,
    jobPostings: jobsRes.data.count,
  };
});

const statsSlice = createSlice({
  name: 'stats',
  initialState: {
    users: 0,
    events: 0,
    donations: 0,
    jobPostings: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.users;
        state.events = action.payload.events;
        state.donations = action.payload.donations;
        state.jobPostings = action.payload.jobPostings;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default statsSlice.reducer;
