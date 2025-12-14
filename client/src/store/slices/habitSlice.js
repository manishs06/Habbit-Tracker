import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Async thunks
export const fetchHabits = createAsyncThunk(
    'habits/fetchHabits',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/habits');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch habits');
        }
    }
);

export const createHabit = createAsyncThunk(
    'habits/createHabit',
    async (habitData, { rejectWithValue }) => {
        try {
            const response = await api.post('/habits', habitData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create habit');
        }
    }
);

export const updateHabit = createAsyncThunk(
    'habits/updateHabit',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/habits/${id}`, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update habit');
        }
    }
);

export const deleteHabit = createAsyncThunk(
    'habits/deleteHabit',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/habits/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete habit');
        }
    }
);

export const toggleHabitCompletion = createAsyncThunk(
    'habits/toggleCompletion',
    async ({ id, date }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/habits/${id}/complete`, { date });
            return { id, stats: response.data.data.stats, status: response.data.data.status, date };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update habit');
        }
    }
);

const habitSlice = createSlice({
    name: 'habits',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchHabits.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHabits.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchHabits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createHabit.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            // Update
            .addCase(updateHabit.fulfilled, (state, action) => {
                const index = state.items.findIndex(h => h._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteHabit.fulfilled, (state, action) => {
                state.items = state.items.filter(h => h._id !== action.payload);
            })
            // Toggle
            .addCase(toggleHabitCompletion.fulfilled, (state, action) => {
                const index = state.items.findIndex(h => h._id === action.payload.id);
                if (index !== -1) {
                    // Update stats locally to reflect immediate change
                    state.items[index].currentStreak = action.payload.stats.currentStreak;
                    state.items[index].totalCompletions = action.payload.stats.totalCompletions;
                    // Note: We aren't storing the full log history in Redux 'items', 
                    // usually that's fetched separately or we just trust the stats.
                }
            });
    }
});

export default habitSlice.reducer;
