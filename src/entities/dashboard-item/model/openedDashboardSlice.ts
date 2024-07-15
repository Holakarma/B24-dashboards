import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TDashboard } from '..';

export interface dashboardItemSlice {
    dashboard: TDashboard | null;
}

const initialState = {
    dashboard: null,
} satisfies dashboardItemSlice as dashboardItemSlice;

const openedDashboardSlice = createSlice({
    name: 'openedDashboard',
    initialState,
    reducers: {
        setOpenedDashboard(state, action: PayloadAction<dashboardItemSlice>) {
            state.dashboard = action.payload.dashboard;
        },
    },
});

export const { setOpenedDashboard } = openedDashboardSlice.actions;

export default openedDashboardSlice.reducer;
