import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { API } from '../../utils/server';

export interface SavedDiagramState {
    saved: string[];
}

const initialState: SavedDiagramState = {
    saved: [],
};

// Create an async thunk to fetch the saved list
export const fetchSavedList = createAsyncThunk<string[], void>(
    'savedDiagram/fetchSavedList',
    async (_, thunkAPI) => {
        try {
            const response = await fetch(API.savedDiagram);
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to fetch saved list');
            }
            const data: { categorized_video_names: string[] } = await response.json();
            return data.categorized_video_names;
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('An unknown error occurred');
        }
    }
);

export const savedDiagramSlice = createSlice({
    name: 'savedDiagram',
    initialState,
    reducers: {
        // Reducer to unset the list (clear the list)
        unsetSavedList: (state) => {
            state.saved = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // .addCase(fetchSavedList.pending, (state) => {
            //     // You can add logic here to handle loading state if needed
            // })
            .addCase(fetchSavedList.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.saved = action.payload;
            })
            .addCase(fetchSavedList.rejected, (state, action) => {
                console.error('Error fetching saved list:', action.payload);
            });
    },
});

export const { unsetSavedList } = savedDiagramSlice.actions;

export default savedDiagramSlice.reducer;
