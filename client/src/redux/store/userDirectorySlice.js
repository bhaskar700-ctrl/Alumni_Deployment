import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for the API
const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/directory`;

// Axios instance with authorization token
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to attach the token to the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Adjust the token retrieval logic as needed
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Initial state
const initialState = {
  users: [],
  user: null,
  favorites: [],
  status: 'idle',
  error: null,
  totalUsers: 0,
  departments: [],
  years: [],
};

// Thunks

// Fetch users with optional filtering, sorting, and pagination
export const fetchUsers = createAsyncThunk(
  'userDirectory/fetchUsers',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users', { params: filters });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  'userDirectory/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Mark user as favorite
export const markFavorite = createAsyncThunk(
  'userDirectory/markFavorite',
  async ({ userId, favoriteUserId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/users/${userId}/favorite`, { favoriteUserId });
      return { userId, favoriteUserId };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch user activity feed
export const fetchUserActivityFeed = createAsyncThunk(
  'userDirectory/fetchUserActivityFeed',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/activity-feed`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch user badges
export const fetchUserBadges = createAsyncThunk(
  'userDirectory/fetchUserBadges',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/badges`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch user profile completion status
export const fetchProfileCompletion = createAsyncThunk(
  'userDirectory/fetchProfileCompletion',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/profile-completion`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Slice
const userDirectorySlice = createSlice({
  name: 'userDirectory',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.departments = action.payload.departments;
        state.years = action.payload.years;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Mark user as favorite
      .addCase(markFavorite.fulfilled, (state, action) => {
        const { userId, favoriteUserId } = action.payload;
        if (state.user && state.user._id === userId) {
          state.user.favorites.push(favoriteUserId);
        }
      })
      // Fetch user activity feed
      .addCase(fetchUserActivityFeed.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserActivityFeed.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user.activityFeed = action.payload;
      })
      .addCase(fetchUserActivityFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch user badges
      .addCase(fetchUserBadges.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserBadges.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user.badges = action.payload;
      })
      .addCase(fetchUserBadges.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch profile completion status
      .addCase(fetchProfileCompletion.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfileCompletion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user.profileCompletion = action.payload.completionPercentage;
      })
      .addCase(fetchProfileCompletion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearUser } = userDirectorySlice.actions;

export default userDirectorySlice.reducer;
