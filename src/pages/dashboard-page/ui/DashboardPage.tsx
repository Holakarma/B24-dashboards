import React, { useEffect } from 'react';
import { setOpenedDashboard } from 'entities/dashboard-item';
import {
    DashboardSettings,
    convertToStat,
    setStatistics,
} from 'widgets/dashboard-settings';
import { AppTitle } from 'widgets/app-title';
import { BX } from 'shared/api';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import CloseIcon from '@mui/icons-material/Close';

import cls from './DashboardPage.module.css';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { CategoryCharts } from 'widgets/category-charts';
import { DepartmentCharts } from 'widgets/department-charts';
import { CoworkersCharts } from 'widgets/coworkers-charts';
import { AlertChooseSettings } from 'features/alert-choose-settings';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from 'entities/user';

function a11yProps(index: number) {
    return {
        id: `menu-tab-${index}`,
        'aria-controls': `menu-tabpanel-${index}`,
    };
}

export const DashboardPage = () => {
    //открытие настроек
    const [isSettingsOpen, setSettingsOpen] = React.useState(false);

    const dispatch = useAppDispatch();
    const dashboardContent = React.useRef<HTMLDivElement | null>(null);

    const dashboard = useAppSelector(
        (state) => state.openedDashboard.dashboard,
    );

    const isCategorySettings =
        dashboard?.PROPERTY_VALUES.CATEGORIES_MONEY_GOAL ||
        dashboard?.PROPERTY_VALUES.CATEGORIES_DEALS_GOAL ||
        dashboard?.PROPERTY_VALUES.CATEGORIES_PRODUCTS_GOAL;

    const isCoworkersSettings =
        dashboard?.PROPERTY_VALUES.COWORKERS_MONEY_GOAL ||
        dashboard?.PROPERTY_VALUES.COWORKERS_DEALS_GOAL ||
        dashboard?.PROPERTY_VALUES.COWORKERS_PRODUCTS_GOAL ||
        dashboard?.PROPERTY_VALUES.COWORKERS_CALLS_GOAL;

    const isDepartmentSettings =
        dashboard?.PROPERTY_VALUES.DEPARTMENT_MONEY_GOAL ||
        dashboard?.PROPERTY_VALUES.DEPARTMENT_DEALS_GOAL ||
        dashboard?.PROPERTY_VALUES.DEPARTMENT_PRODUCTS_GOAL ||
        dashboard?.PROPERTY_VALUES.DEPARTMENT_CALLS_GOAL;

    function initialValue() {
        if (
            dashboard?.PROPERTY_VALUES.CATEGORIES_LIST.length &&
            isCategorySettings
        )
            return 0;
        if (
            dashboard?.PROPERTY_VALUES.COWORKERS_LIST.length &&
            isCoworkersSettings
        )
            return 1;
        if (
            dashboard?.PROPERTY_VALUES.DEPARTMENT_LIST.length &&
            isDepartmentSettings
        )
            return 2;
    }

    const [value, setValue] = React.useState(initialValue());

    useEffect(() => {
        if (dashboard) {
            dispatch(setStatistics(convertToStat(dashboard)));
            setValue(initialValue());
        }
    }, [dashboard]);

    useEffect(() => {
        BX.fitWindow();
    }, [value]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { data: currentUser } = useQuery({
        queryFn: getCurrentUser,
        queryKey: ['currentUser'],
        staleTime: 1000 * 60,
        throwOnError: true,
    });

    return (
        <>
            <AppTitle />
            <div className="container">
                <div className={cls.DashboardButtons}>
                    {currentUser ? (
                        <DashboardSettings
                            isSettingsOpen={
                                dashboard?.CREATED_BY === currentUser.ID &&
                                isSettingsOpen
                            }
                            setSettingsOpen={setSettingsOpen}
                            disabled={dashboard?.CREATED_BY !== currentUser.ID}
                        />
                    ) : null}
                    <Button
                        className="btn"
                        onClick={() =>
                            dispatch(setOpenedDashboard({ dashboard: null }))
                        }
                    >
                        <CloseIcon />
                    </Button>
                </div>
                {isCategorySettings ||
                isCoworkersSettings ||
                isDepartmentSettings ? (
                    <>
                        <div ref={dashboardContent}>
                            <Box
                                sx={{ borderBottom: 1, borderColor: 'divider' }}
                            >
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                >
                                    <Tab
                                        label="Воронки"
                                        {...a11yProps(0)}
                                        disabled={
                                            !dashboard?.PROPERTY_VALUES
                                                .CATEGORIES_LIST.length ||
                                            !isCategorySettings
                                        }
                                    />
                                    <Tab
                                        label="Сотрудники"
                                        {...a11yProps(1)}
                                        disabled={
                                            !dashboard?.PROPERTY_VALUES
                                                .COWORKERS_LIST.length ||
                                            !isCoworkersSettings
                                        }
                                    />
                                    <Tab
                                        label="Отделы"
                                        {...a11yProps(2)}
                                        disabled={
                                            !dashboard?.PROPERTY_VALUES
                                                .DEPARTMENT_LIST.length ||
                                            !isDepartmentSettings
                                        }
                                    />
                                </Tabs>
                            </Box>

                            <div
                                id={`menu-tabpanel-0`}
                                hidden={value !== 0}
                            >
                                {value === 0 && <CategoryCharts />}
                            </div>
                            <div
                                id={`menu-tabpanel-1`}
                                hidden={value !== 1}
                            >
                                {value === 1 && <CoworkersCharts />}
                            </div>
                            <div
                                id={`menu-tabpanel-2`}
                                hidden={value !== 2}
                            >
                                {value === 2 && <DepartmentCharts />}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="d-flex justify-content-center align-items-center pt-4">
                        <AlertChooseSettings
                            setSettingsOpen={setSettingsOpen}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
