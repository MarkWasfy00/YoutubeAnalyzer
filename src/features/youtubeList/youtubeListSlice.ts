import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface YoutubeListState {
    list: string[];
    loading: boolean;
}

const initialState: YoutubeListState = {
    list: [],
    loading: false,
};

export const youtubeListSlice = createSlice({
    name: 'youtubeList',
    initialState,
    reducers: {
        // Reducer to set the list
        setList: (state, action: PayloadAction<string[]>) => {
            state.list = action.payload;
        },
        // Reducer to unset the list (clear the list)
        unsetList: (state) => {
            state.list = [];
        },
        // Reducer to set the loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setList, unsetList, setLoading } = youtubeListSlice.actions;

export default youtubeListSlice.reducer;
