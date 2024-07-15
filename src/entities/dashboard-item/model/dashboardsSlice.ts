import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TDashboard } from '../types';

export interface dashboardsSlice {
    dashboards: TDashboard[];
}

const initialState = {
    dashboards: [],
} satisfies dashboardsSlice as dashboardsSlice;

const dashboardsSlice = createSlice({
    name: 'dashboards',
    initialState,
    reducers: {
        setDashboards(state, action: PayloadAction<dashboardsSlice>) {
            state.dashboards = action.payload.dashboards;
        },
    },
});

export const { setDashboards } = dashboardsSlice.actions;

export default dashboardsSlice.reducer;
