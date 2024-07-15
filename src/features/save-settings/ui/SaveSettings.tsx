import React, { FC, HTMLAttributes, memo, useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import { Statistics, convertToStat } from 'widgets/dashboard-settings';
import { updateDashboard } from '../api/updateDashboard';
import { useAllDashboards } from 'entities/entity';
import { setOpenedDashboard } from 'entities/dashboard-item';

interface SaveSettingsProps extends HTMLAttributes<HTMLButtonElement> { }

export const SaveSettings: FC<SaveSettingsProps> = memo(({ className }) => {
    const settings = useAppSelector((state) => state.statistics.statistics);
    const openedDashboard = useAppSelector(
        (state) => state.openedDashboard.dashboard,
    );

    const dispatch = useAppDispatch();

    const queryClient = useQueryClient();
    const {
        data: dashboardsData,
        isLoading: isDashboardsLoading,
        isSuccess,
    } = useAllDashboards();

    const saveMutation = useMutation({
        mutationFn: ({ settings, id }: { settings: Statistics; id: number }) =>
            updateDashboard(settings, id),
        mutationKey: ['updateDashboard'],
        onSuccess: async () => {
            await queryClient.invalidateQueries(
                {
                    queryKey: ['dashboards'],
                },
                { throwOnError: true },
            );
        },
    });
    useEffect(() => {
        if (dashboardsData && isSuccess) {
            const dashboard = dashboardsData.find(
                (dashboard) => dashboard.ID === openedDashboard?.ID,
            );
            if (dashboard) {
                dispatch(setOpenedDashboard({ dashboard }));
            }
        }
    }, [dashboardsData]);

    const itemsDashboardConvert = openedDashboard ? convertToStat(openedDashboard) : null
    const changeOrNoChange = JSON.stringify(itemsDashboardConvert) === JSON.stringify(settings)

    const clickHandler = useCallback(() => {
        openedDashboard &&
            saveMutation.mutate({
                settings,
                id: parseInt(openedDashboard.ID),
            });
    }, [settings, openedDashboard]);

    return (
        <Button
            className={className}
            color="success"
            variant="contained"
            onClick={clickHandler}
            disabled={saveMutation.isPending || isDashboardsLoading || changeOrNoChange}
        >
            {saveMutation.isPending || isDashboardsLoading
                ? 'Сохранение...'
                : 'Сохранить настройки'}
        </Button>
    );
});
