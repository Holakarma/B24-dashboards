import { FC, useEffect, useState } from 'react';
import { Loading } from 'shared/ui/loading';
import { AddDashboardBtn } from 'features/add-dashboard-btn';

import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import { setDashboards } from 'entities/dashboard-item/model/dashboardsSlice';

import { DashboardCreationModal } from 'features/dashboard-creation';

import { BX } from 'shared/api';
import { useAllDashboards } from 'entities/entity';

import type {
    DashboardItemComponentProps,
    TDashboard,
} from 'entities/dashboard-item';

import cls from './DashboardList.module.css';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from 'entities/user';

interface DashboardsListProps {
    DashboardItemComponent: FC<DashboardItemComponentProps>;
}

export const DashboardsList: FC<DashboardsListProps> = ({
    DashboardItemComponent,
}) => {
    const dashboards = useAppSelector((state) => state.dashboards.dashboards);

    const { data: dashboardsData, isLoading, isSuccess } = useAllDashboards();

    const { data: currentUser } = useQuery({
        queryFn: async () => await getCurrentUser(),
        queryKey: ['currentUser'],
        staleTime: 1000 * 60,
        throwOnError: true,
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isSuccess && currentUser) {
            const availableDashboards = dashboardsData.filter((dashboard) =>
                BX.isAdmin() ||
                dashboard.PROPERTY_VALUES.PARTICIPANTS_LIST.includes(
                    currentUser.ID,
                ),
            );
            dispatch(setDashboards({ dashboards: availableDashboards }));
        }
        BX.fitWindow();
    }, [isLoading, dashboardsData, currentUser]);

    if (isLoading)
        return (
            <div className="w-100">
                <Loading className="mx-auto" />
            </div>
        );

    return (
        <ul className={cls.DashboardList}>
            {isSuccess &&
                dashboards.map((dashboard) => (
                    <li
                        className="mb-2"
                        key={parseInt(dashboard.ID)}
                    >
                        <DashboardItemComponent dashboard={dashboard} />
                    </li>
                ))}

            <li>
                <AddDashboardBtn ModalComponent={DashboardCreationModal} />
            </li>
        </ul>
    );
};
