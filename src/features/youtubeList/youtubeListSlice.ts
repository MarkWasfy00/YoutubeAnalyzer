import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { API } from '../../utils/server';


interface Video {
    video_id: string;
    title: string;
    views: number;
    likes: number;
    thumbnail: string;
}


export interface YoutubeListState {
    list: string[];
    youtubeInfo: Video[];
    loading: boolean;
}

const initialState: YoutubeListState = {
    list: [],
    youtubeInfo: [],
    loading: false,
};


export const sendYoutubeLinks = createAsyncThunk(
    'youtubeList/sendYoutubeLinks',
    async (videoIds: string[]) => {
        const response = await fetch(API.fetchYoutubeData, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ video_ids: videoIds }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch YouTube data');
        }

        return await response.json();
    }
);

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
        // setYoutubeList: (state, action: PayloadAction<Video[]>) => {
        //     state.youtubeInfo = action.payload;
        // },
        // // Reducer to unset the list (clear the list)
        // unsetYoutubeList: (state) => {
        //     state.youtubeInfo = [];
        // },
        // Reducer to set the loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(sendYoutubeLinks.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendYoutubeLinks.fulfilled, (state, action) => {
                state.youtubeInfo = action.payload;
                state.loading = false;
            })
            .addCase(sendYoutubeLinks.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { setList, unsetList, setLoading } = youtubeListSlice.actions;

export default youtubeListSlice.reducer;
