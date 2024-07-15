import React, { FC, useEffect } from 'react';
import { Paper, Divider, List } from '@mui/material';
import { formatNumber } from 'shared/model/formatNumber';
import { CircularProgressWithLabel } from 'shared/ui/circular-progress-w-label';
import { TDashboard } from 'entities/dashboard-item';
import { DepartmentDealCharts } from 'features/charts/department-charts/department-deals-chart';

interface DepartmentDealsProps {
    dashboard: TDashboard;
    departmentIdList: string[];
}

export const DepartmentDeals: FC<DepartmentDealsProps> = ({
    dashboard,
    departmentIdList,
}) => {
    const [summaryDealsRaw, setSummaryDealsRaw] = React.useState(0);
    const [departmentDealsList, setDepartmentDealsList] = React.useState(
        departmentIdList.map((c) => ({ id: c, deals: 0 })),
    );

    useEffect(() => {
        setDepartmentDealsList(
            departmentIdList.map((c) => ({ id: c, deals: 0 })),
        );
    }, [departmentIdList]);

    const [departmentDealsListCopy, setDepartmentDealsListCopy] =
        React.useState([...departmentDealsList]);

    useEffect(() => {
        const sortedDepartmentDealsList = [...departmentDealsListCopy];
        sortedDepartmentDealsList.sort((a, b) => b.deals - a.deals);
        setDepartmentDealsList(sortedDepartmentDealsList);
    }, [departmentDealsListCopy]);

    return (
        <Paper
            className="p-4 mt-4"
            elevation={8}
        >
            <div className="d-flex gap-4 justify-content-between">
                <div className="d-flex gap-4">
                    <div>
                        <CircularProgressWithLabel
                            size={100}
                            value={
                                (summaryDealsRaw * 100) /
                                parseInt(
                                    dashboard.PROPERTY_VALUES
                                        .DEPARTMENT_DEALS_GOAL,
                                )
                            }
                        />
                    </div>
                    <Divider
                        orientation="vertical"
                        flexItem
                    />
                    <div>
                        <h5>Сделки</h5>
                        <p>
                            {formatNumber(String(summaryDealsRaw))}{' '}
                            <span className="opacity-50">
                                /{' '}
                                {formatNumber(
                                    dashboard.PROPERTY_VALUES
                                        .DEPARTMENT_DEALS_GOAL,
                                )}
                            </span>{' '}
                            Сделок
                        </p>
                    </div>
                </div>
                <div className="d-flex gap-4">
                    <Divider
                        orientation="vertical"
                        flexItem
                    />
                    <div>
                        <List
                            sx={{
                                maxHeight: '105px',
                                overflow: 'auto',
                                minWidth: '300px',
                            }}
                            className="py-0"
                        >
                            {departmentDealsList.map((c, i) => (
                                <DepartmentDealCharts
                                    key={c.id}
                                    departmentId={parseInt(c.id)}
                                    setSummaryDealsRaw={setSummaryDealsRaw}
                                    summaryDealsRaw={summaryDealsRaw}
                                    getDepartmentDeals={(count) => {
                                        let copyCopy = [...departmentDealsList];
                                        copyCopy[i].deals = count;
                                        setDepartmentDealsListCopy(copyCopy);
                                    }}
                                    period={{
                                        dateStart:
                                            dashboard.PROPERTY_VALUES
                                                .PERIOD_START_DATE,
                                        dateEnd:
                                            dashboard.PROPERTY_VALUES
                                                .PERIOD_END_DATE,
                                    }}
                                />
                            ))}
                        </List>
                    </div>
                </div>
            </div>
        </Paper>
    );
};
