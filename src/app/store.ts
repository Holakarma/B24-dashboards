import { configureStore } from '@reduxjs/toolkit';
import { appTitleReducer } from '../shared/lib/store';
import {
    dashboardItemReducer,
    dashboardsReducer,
    openedDashboardReducer,
} from '../entities/dashboard-item';
import { statisticsReducer } from 'widgets/dashboard-settings';

export const store = configureStore({
    reducer: {
        appTitle: appTitleReducer,
        dashboardItem: dashboardItemReducer,
        dashboards: dashboardsReducer,
        openedDashboard: openedDashboardReducer,
        statistics: statisticsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
