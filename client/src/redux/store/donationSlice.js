import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/donations` : 'http://localhost:3000/api/donations';

const initialState = {
  donations: [],
  history: [],
  status: 'idle',
  refundStatus: 'idle',
  error: null,
};

export const updatePaymentStatus = createAsyncThunk(
  'donations/updatePaymentStatus',
  async (paymentData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.post(`${BASE_URL}/update-payment-status`, paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const makeDonation = createAsyncThunk(
  'donations/makeDonation',
  async (donationData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.post(`${BASE_URL}/make`, donationData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDonationHistory = createAsyncThunk(
  'donations/fetchHistory',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.get(`${BASE_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refundDonation = createAsyncThunk(
  'donations/refundDonation',
  async (donationId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.post(`${BASE_URL}/refund/${donationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const donationSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    resetDonationState: (state) => {
      state.status = 'idle';
      state.refundStatus = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeDonation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(makeDonation.fulfilled, (state, action) => {
        state.donations.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(makeDonation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Could not process donation';
      })
      .addCase(fetchDonationHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDonationHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchDonationHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Could not fetch history';
      })
      .addCase(refundDonation.pending, (state) => {
        state.refundStatus = 'loading';
      })
      .addCase(refundDonation.fulfilled, (state, action) => {
        state.refundStatus = 'succeeded';
      })
      .addCase(refundDonation.rejected, (state, action) => {
        state.refundStatus = 'failed';
        state.error = action.payload.message || 'Refund failed';
      })
      .addCase(updatePaymentStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const donation = state.donations.find(d => d.orderId === action.payload.orderId);
        if (donation) {
          donation.status = 'completed';
          donation.razorpayPaymentId = action.payload.razorpayPaymentId;
        }
        state.status = 'succeeded';
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Could not update payment status';
      });
  }
});

export const { resetDonationState } = donationSlice.actions;
export default donationSlice.reducer;
