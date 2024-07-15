import React, { FC, useEffect } from 'react';
import { createDashboard } from '../api/createDashboard';
import { useAppSelector, useAppDispatch } from 'shared/lib/store';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { dashboardItemSlice } from 'entities/dashboard-item/model/dashboardItemSlice';
import { SetStateAction, Dispatch } from 'react';
import { setOpenedDashboard } from 'entities/dashboard-item/model/openedDashboardSlice';
import { changeDashboardItem } from 'entities/dashboard-item/model/dashboardItemSlice';

import { getCurrentUser } from 'entities/user';
import { Button, ButtonTypeMap, ExtendButtonBase } from '@mui/material';

interface DashboardCreationBtnProps
    extends React.HTMLAttributes<HTMLButtonElement> {
    dashboardItem: dashboardItemSlice;
    setError: Dispatch<SetStateAction<string>>;
}

const DashboardCreationBtn: FC<DashboardCreationBtnProps> = ({
    dashboardItem,
    setError,
    ...otherProps
}) => {
    const dashboards = useAppSelector((state) => state.dashboards.dashboards);
    const queryClient = useQueryClient();

    const [validation, setValidation] = React.useState(true);

    const createDashboardQuery = useMutation({
        mutationFn: (dashboardItem: dashboardItemSlice) =>
            createDashboard(dashboardItem),
        onSuccess: async () => {
            await queryClient.invalidateQueries(
                {
                    queryKey: ['dashboards'],
                },
                { throwOnError: true },
            );

            dispatch(
                changeDashboardItem({
                    name: '',
                    participantList: (await getCurrentUser()).ID,
                }),
            );
        },
    });

    useEffect(() => {
        const withSameName = dashboards.find(
            (d) => d.NAME === dashboardItem.name,
        );
        withSameName && setError('Дашборд с таким названием уже существует');
        if (
            !dashboardItem.name ||
            !dashboardItem.participantList ||
            withSameName
        ) {
            setValidation(false);
        } else {
            setValidation(true);
        }
    }, [dashboardItem]);

    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            const newDashboard = dashboards.find(
                (d) => d.NAME === dashboardItem.name,
            );
            if (newDashboard && createDashboardQuery.isPending) {
                dispatch(setOpenedDashboard({ dashboard: newDashboard }));
            }
        })();
    }, [dashboards]);

    async function createNewDashboard() {
        createDashboardQuery.mutate(dashboardItem);
    }

    return (
        <Button
            {...otherProps}
            onClick={createNewDashboard}
            color={validation ? 'success' : 'error'}
            disabled={!validation || createDashboardQuery.isPending}
            variant="contained"
        >
            {createDashboardQuery.isPending
                ? 'Создание дашборда...'
                : 'Создать дашборд'}
        </Button>
    );
};

export default DashboardCreationBtn;
