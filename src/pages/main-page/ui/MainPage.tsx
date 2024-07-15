import { FC } from 'react';
import { AppTitle } from 'widgets/app-title';
import { DashboardsList } from 'widgets/dashboards-list';
import { DashboardCard } from 'widgets/dashboard-card';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from 'shared/ui/error-fallback';

const MainPage: FC = () => {
    return (
        <>
            <AppTitle />
            <div className="container">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <DashboardsList DashboardItemComponent={DashboardCard} />
                </ErrorBoundary>
            </div>
        </>
    );
};

export default MainPage;
