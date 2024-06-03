import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API requests
const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/analytics`;

// Async Thunks to fetch data
export const fetchTotalDonations = createAsyncThunk(
  'donationAnalytics/fetchTotalDonations',
  async (filter, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/donations-by-filter?filter=${filter}`);
      console.log('fetchTotalDonations response:', response.data); // Log the response data
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTotalRepeatedDonors = createAsyncThunk(
  'donationAnalytics/fetchTotalRepeatedDonors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/total-repeated-donors`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTotalUniqueDonors = createAsyncThunk(
  'donationAnalytics/fetchTotalUniqueDonors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/total-unique-donors`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOverallTotalDonations = createAsyncThunk(
  'donationAnalytics/fetchOverallTotalDonations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/overall-total-donations`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDonationFrequency = createAsyncThunk(
  'donationAnalytics/fetchDonationFrequency',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/donation-frequency`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAverageDonationAmount = createAsyncThunk(
  'donationAnalytics/fetchAverageDonationAmount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/average-donation-amount`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTopDonors = createAsyncThunk(
  'donationAnalytics/fetchTopDonors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/top-donors`);
      console.log('Top Donors API Response:', response.data); // Add this line
      return response.data;
    } catch (error) {
      console.error('Error fetching top donors:', error.response.data); // Add this line
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDonationsByYears = createAsyncThunk(
  'donationAnalytics/fetchDonationsByYears',
  async ({ year1, year2 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/donations-by-years?year1=${year1}&year2=${year2}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTotalCompletedDonations = createAsyncThunk(
  'donationAnalytics/fetchTotalCompletedDonations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/total-completed-donations`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const donationAnalyticsSlice = createSlice({
  name: 'donationAnalytics',
  initialState: {
    data: {
      totalDonationsMonth: [],
      totalDonationsYear: [],
      totalRepeatedDonors: null,
      totalUniqueDonors: null,
      overallTotalDonations: null,
      donationFrequency: null,
      averageDonationAmount: null,
      topDonors: [],
      donationsByFilter: [],
      donationsByYears: null,
      totalCompletedDonations: null, // Add a new state for total completed donations
    },
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTotalDonations
      .addCase(fetchTotalDonations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTotalDonations.fulfilled, (state, action) => {
        console.log('fetchTotalDonations fulfilled:', action.payload); // Log the fulfilled payload
        state.status = 'succeeded';
        state.data.donationsByFilter = action.payload;
      })
      .addCase(fetchTotalDonations.rejected, (state, action) => {
        console.log('fetchTotalDonations rejected:', action.payload); // Log the rejected payload
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchTotalRepeatedDonors
      .addCase(fetchTotalRepeatedDonors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTotalRepeatedDonors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.totalRepeatedDonors = action.payload;
      })
      .addCase(fetchTotalRepeatedDonors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchTotalUniqueDonors
      .addCase(fetchTotalUniqueDonors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTotalUniqueDonors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.totalUniqueDonors = action.payload;
      })
      .addCase(fetchTotalUniqueDonors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchOverallTotalDonations
      .addCase(fetchOverallTotalDonations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOverallTotalDonations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.overallTotalDonations = action.payload;
      })
      .addCase(fetchOverallTotalDonations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchDonationFrequency
      .addCase(fetchDonationFrequency.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDonationFrequency.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.donationFrequency = action.payload;
      })
      .addCase(fetchDonationFrequency.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchAverageDonationAmount
      .addCase(fetchAverageDonationAmount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAverageDonationAmount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.averageDonationAmount = action.payload;
      })
      .addCase(fetchAverageDonationAmount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchTopDonors
      .addCase(fetchTopDonors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopDonors.fulfilled, (state, action) => {
        console.log('Top Donors Fulfilled:', action.payload); // Add this line
        state.topDonors = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTopDonors.rejected, (state, action) => {
        console.error('Top Donors Rejected:', action.payload); // Add this line
        state.status = 'failed';
        state.error = action.payload.message || 'Could not fetch top donors';
      })
      // fetchDonationsByYears
      .addCase(fetchDonationsByYears.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDonationsByYears.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.donationsByYears = action.payload;
      })
      .addCase(fetchDonationsByYears.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchTotalCompletedDonations
      .addCase(fetchTotalCompletedDonations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTotalCompletedDonations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.totalCompletedDonations = action.payload.totalCompletedDonations;
      })
      .addCase(fetchTotalCompletedDonations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default donationAnalyticsSlice.reducer;
