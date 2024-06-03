import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/jobs`;

// Async thunks
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || 'Unexpected error occurred');
  }
});

export const fetchJobById = createAsyncThunk('jobs/fetchJobById', async (jobId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/${jobId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || 'Unexpected error occurred');
  }
});

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token; // Retrieve the token
    const authorId = state.auth.user.id; // Retrieve the user ID to use as the author

    // Include the author ID in the jobData payload
    jobData.append('author', authorId);

    try {
      console.log("Authorization Header: ", `Bearer ${token}`);
      const response = await axios.post(`${BASE_URL}/create`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
          'Content-Type': 'multipart/form-data', // Ensure the content type is multipart/form-data
        },
      });
      return response.data;
    } catch (error) {
      console.error("Job creation error: ", error.response ? error.response.data : error);
      return rejectWithValue(error?.response?.data || 'Unexpected error occurred');
    }
  }
);

export const updateJob = createAsyncThunk('jobs/updateJob', async ({ jobId, jobData }, { getState, rejectWithValue }) => {
  const { token } = getState().auth;
  const formData = new FormData();
  for (const key in jobData) {
    formData.append(key, jobData[key]);
  }

  try {
    const response = await axios.put(`${BASE_URL}/update/${jobId}`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || 'Unexpected error occurred');
  }
});

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (jobId, { getState, rejectWithValue }) => {
  const { token } = getState().auth;
  try {
    await axios.delete(`${BASE_URL}/delete/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return jobId;
  } catch (error) {
    return rejectWithValue(error?.response?.data || 'Unexpected error occurred');
  }
});

const initialState = {
  jobs: [],
  currentJob: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createJob.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs.unshift(action.payload); // Add the new job at the beginning of the jobs array
      })
      .addCase(createJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateJob.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload; // Update the job in the jobs array
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteJob.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = state.jobs.filter(job => job._id !== action.payload); // Remove the deleted job from the jobs array
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllJobs = (state) => state.jobs.jobs;
export const selectJobById = (state, jobId) => state.jobs.jobs.find(job => job._id === jobId);

export default jobSlice.reducer;
