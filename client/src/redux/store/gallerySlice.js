import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/gallery`;

// Thunk to fetch gallery items
export const fetchGalleryItems = createAsyncThunk('gallery/fetchGalleryItems', async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token; // Assuming you store the token in auth slice
    try {
        const response = await axios.get(BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Could not fetch gallery items');
    }
});

// Thunk to create a new gallery item
export const createGalleryItem = createAsyncThunk('gallery/createGalleryItem', async (formData, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    try {
        const response = await axios.post(BASE_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Could not create gallery item');
    }
});

const gallerySlice = createSlice({
    name: 'gallery',
    initialState: {
        items: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGalleryItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGalleryItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchGalleryItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createGalleryItem.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createGalleryItem.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items.push(action.payload);
            })
            .addCase(createGalleryItem.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export default gallerySlice.reducer;
