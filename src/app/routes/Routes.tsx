import React from 'react';
import { DashboardPage } from 'pages/dashboard-page';
import { MainPage } from 'pages/main-page';
import { useAppSelector } from 'shared/lib/store';

const Routes = () => {
    const openedDashboard = useAppSelector(
        (state) => state.openedDashboard.dashboard,
    );

    if (!openedDashboard) {
        return <MainPage />;
    }

    if (openedDashboard) {
        return <DashboardPage />;
    }
};

export default Routes;
