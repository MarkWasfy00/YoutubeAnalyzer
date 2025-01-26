import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { API } from '../../utils/server';

export interface DiagramState {
    id: string;
    name: string;
    value?: number;
    videos_id?: string[]
    children?: DiagramState[];
}

const initialState: DiagramState = {
    id: "0",
    name: "",
    children: []
};

// Asynchronous thunk to fetch data from an API
export const getDiagramData = createAsyncThunk(
    'diagram/getDiagramData',
    async ({ payload }: {  payload: string }) => {
        const response = await fetch(API.diagram, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               channel_url: payload
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to post data');
        }
        const data = await response.json();
        return data;
    }
);

export const saveDiagramData = createAsyncThunk(
    'diagram/saveDiagramData',
    async ({ payload }: { payload: unknown }) => {
        const response = await fetch(API.saveDiagram, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error('Failed to post data');
        }
        const data = await response.json();
        return data;
    }
);

export const getSavedDiagramData = createAsyncThunk(
    'diagram/getSavedDiagramData',
    async ({ payload }: { payload: string }) => {
        const response = await fetch(`${API.loadDiagram}?name=${payload}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Failed to post data');
        }
        const data = await response.json();
        return data;
    }
);

export const deleteSavedDiagramData = createAsyncThunk(
    'diagram/deleteSavedDiagramData',
    async ({ payload }: { payload: string }) => {
        const response = await fetch(`${API.deleteDiagram}?name=${payload}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Failed to post data');
        }
        const data = await response.json();
        return data;
    }
);


export const diagramSlice = createSlice({
    name: 'diagram',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSavedDiagramData.fulfilled, (state, action: PayloadAction<DiagramState>) => {
            // Update the state with the fetched data
            state.name = action.payload.name;
            state.children = action.payload.children || [];
        });
        builder.addCase(getSavedDiagramData.rejected, (_state, action) => {
            console.error('Failed to fetch diagram data:', action.error);
        });


        builder.addCase(getDiagramData.fulfilled, (state, action: PayloadAction<DiagramState>) => {
            // Update the state with the fetched data
            state.name = action.payload.name;
            state.children = action.payload.children || [];
        });
        builder.addCase(getDiagramData.rejected, (_state, action) => {
            console.error('Failed to fetch diagram data:', action.error);
        });
    },
});

export default diagramSlice.reducer;
