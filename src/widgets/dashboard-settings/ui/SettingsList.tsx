import React, { FC, memo, useCallback, useMemo } from 'react';
import {
    Divider,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MoreSettingsMenu } from 'features/more-settings-dashboard';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import { CategorySettings } from './CategorySettings';
import { DateRange, PeriodFormat } from 'shared/ui/date-range';
import { updatePeriod } from '../model/statisticsSlice';
import { CoworkersSettings } from './CoworkersSettings';
import { DepartmentSettings } from './DepartmentSettings';
import { SaveSettings } from 'features/save-settings';

interface SettingsListProps {
    toggleDrawer: (newOpen?: boolean) => void;
}

export const SettingsList: FC<SettingsListProps> = memo(({ toggleDrawer }) => {
    const openedDashboard = useAppSelector(
        (state) => state.openedDashboard.dashboard,
    );
    const settings = useAppSelector((state) => state.statistics.statistics);

    const dispatch = useAppDispatch();

    const [statistics, setStatistics] = React.useState('category');
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newStatistics: string,
    ) => {
        if (newStatistics) {
            setStatistics(newStatistics);
        }
    }; 

    if (!openedDashboard)
        return (
            <div
                className="p-4 position-relative"
                style={{ minHeight: '100%', width: '500px' }}
            >
                Ошибка при получении дашборда
            </div>
        );

    const showCategorySettings = useCallback((statistics: string) => {
        switch (statistics) {
            case 'category': {
                return <CategorySettings />;
            }
            case 'coworkers': {
                return <CoworkersSettings />;
            }
            case 'department': {
                return <DepartmentSettings />;
            }
        }
    }, []);

    const initialPeriod = useMemo(() => settings.period, []);

    const onDateChange = useCallback(
        (newPeriod: PeriodFormat) => dispatch(updatePeriod(newPeriod)),
        [],
    );

    if (openedDashboard)
        return (
            <div
                className="px-4 position-relative h-100"
                style={{
                    width: '500px',
                }}
            >
                <div
                    className="d-flex flex-column justify-content-between align-items-center py-4"
                    style={{ minHeight: '100%' }}
                >
                    <div>
                        <div className="row align-items-center justify-content-between mb-2">
                            <h5 className="col mb-0">Настройки дашборда </h5>
                            <div className="col-1 text-end">
                                <MoreSettingsMenu dashboard={openedDashboard} />
                            </div>
                            <div className="col-2 text-end">
                                <IconButton onClick={() => toggleDrawer()}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
                        <div className="pt-2">
                            <div className="pb-2">
                                <ToggleButtonGroup
                                    value={statistics}
                                    className="w-100"
                                    onChange={handleChange}
                                    exclusive
                                >
                                    <ToggleButton
                                        style={{ flexGrow: 1 }}
                                        value="category"
                                    >
                                        По воронкам
                                    </ToggleButton>
                                    <ToggleButton
                                        style={{ flexGrow: 1 }}
                                        value="coworkers"
                                    >
                                        По сотрудникам
                                    </ToggleButton>
                                    <ToggleButton
                                        style={{ flexGrow: 1 }}
                                        value="department"
                                    >
                                        По отделам
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                            <Divider />
                            {showCategorySettings(statistics)}
                            <div className="py-2">
                                <DateRange
                                    onDateChange={onDateChange}
                                    initialDate={initialPeriod}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-100 d-flex flex-column gap-2 align-items-stretch pt-2">
                        <SaveSettings />
                    </div>
                </div>
            </div>
        );
});
