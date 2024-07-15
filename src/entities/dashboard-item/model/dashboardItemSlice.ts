import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface dashboardItemSlice {
    name: string;
    participantList: string;
}

const initialState = {
    name: '',
    participantList: '',
} satisfies dashboardItemSlice as dashboardItemSlice;

const dashboardItemSlice = createSlice({
    name: 'dashboardItem',
    initialState,
    reducers: {
        changeDashboardItem(state, action: PayloadAction<dashboardItemSlice>) {
            state.name = action.payload.name;
            state.participantList = action.payload.participantList;
        },
    },
});

export const { changeDashboardItem } = dashboardItemSlice.actions;

export default dashboardItemSlice.reducer;
