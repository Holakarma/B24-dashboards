import React from 'react';
import { setOpenedDashboard } from 'entities/dashboard-item/model/openedDashboardSlice';
import { useAppDispatch } from 'shared/lib/store';
import { UserAvatar } from 'entities/user';
import { getCurrentUser } from 'entities/user';

import { useEffect, type FC } from 'react';
import { AvatarGroup } from '@mui/material';
import type { TDashboard } from 'entities/dashboard-item';

import cls from './DashboardCard.module.css';

export interface DashboardItemComponentProps {
    dashboard: TDashboard;
}

export const DashboardCard: FC<DashboardItemComponentProps> = ({
    dashboard,
}) => {
    const dispatch = useAppDispatch();

    const [users, setUsers] = React.useState(
        dashboard.PROPERTY_VALUES.PARTICIPANTS_LIST.split(','),
    );

    if (dashboard) {
        return (
            <div
                className={`card ${cls.DashboardCard}`}
                onClick={() => dispatch(setOpenedDashboard({ dashboard }))}
            >
                <div className="card-header">
                    <h4>{dashboard.NAME}</h4>
                </div>
                <div className="card-body">
                    <div className="card-text text-end">Доступен для:</div>
                    <AvatarGroup
                        className="my-2"
                        max={20}
                    >
                        {users.map((u) => (
                            <UserAvatar
                                user={u}
                                key={u}
                            />
                        ))}
                    </AvatarGroup>
                </div>
            </div>
        );
    }
};
