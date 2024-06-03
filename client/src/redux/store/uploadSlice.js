import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for the API
const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/uploads`;

// Async thunk for uploading CSV files
export const uploadCsv = createAsyncThunk(
    'upload/uploadCsv',
    async ({ file, type }, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${BASE_URL}/${type}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to upload file' });
        }
    }
);

// Initial state
const initialState = {
    status: 'idle',
    message: '',
    error: null
};

// Create slice
const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = '';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadCsv.pending, (state) => {
                state.status = 'loading';
                state.message = '';
                state.error = null;
            })
            .addCase(uploadCsv.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(uploadCsv.rejected, (state, action) => {
                state.status = 'failed';
                state.message = '';
                state.error = action.payload.message || 'Failed to upload file';
            });
    }
});

export const { clearMessage } = uploadSlice.actions;

export default uploadSlice.reducer;
