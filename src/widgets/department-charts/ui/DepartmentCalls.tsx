import React, { FC } from 'react';
import { TDashboard } from 'entities/dashboard-item';
import { Paper, Divider, List } from '@mui/material';
import { formatNumber } from 'shared/model/formatNumber';
import { CircularProgressWithLabel } from 'shared/ui/circular-progress-w-label';
import { CoworkersCallsChart } from 'features/charts/coworkers-charts/coworkers-calls-chart';
import { DepartmentCallsChart } from 'features/charts/department-charts/department-calls-chart';

interface DepartmentCallsProps {
    dashboard: TDashboard;
    departmentIdList: string[];
}

export const DepartmentCalls: FC<DepartmentCallsProps> = ({
    dashboard,
    departmentIdList,
}) => {
    const [callsSum, setCallsSum] = React.useState(0);
    const [incomingCallsSum, setIncomingCallsSum] = React.useState(0);
    const [outgoingCallsSum, setOutgoingCallsSum] = React.useState(0);

    return (
        <Paper
            className="p-4 mt-4"
            elevation={8}
        >
            <div className="row">
                <div className="col-7 d-flex gap-4">
                    <div>
                        <CircularProgressWithLabel
                            size={100}
                            value={
                                (callsSum * 100) /
                                parseInt(
                                    dashboard.PROPERTY_VALUES
                                        .DEPARTMENT_CALLS_GOAL,
                                )
                            }
                        />
                    </div>
                    <Divider
                        orientation="vertical"
                        flexItem
                    />
                    <div>
                        <h5>Звонки</h5>
                        <p>
                            {formatNumber(String(callsSum))}{' '}
                            <span className="opacity-50">
                                /{' '}
                                {formatNumber(
                                    dashboard.PROPERTY_VALUES
                                        .DEPARTMENT_CALLS_GOAL,
                                )}
                            </span>{' '}
                            секунд
                        </p>
                        <p>
                            Исходящие: {formatNumber(String(outgoingCallsSum))}{' '}
                            <span className="opacity-50">
                                /{' '}
                                {formatNumber(
                                    dashboard.PROPERTY_VALUES
                                        .DEPARTMENT_CALLS_GOAL,
                                )}
                            </span>{' '}
                            секунд
                        </p>
                        <p>
                            Входящие: {formatNumber(String(incomingCallsSum))}{' '}
                            <span className="opacity-50">
                                /{' '}
                                {formatNumber(
                                    dashboard.PROPERTY_VALUES
                                        .DEPARTMENT_CALLS_GOAL,
                                )}
                            </span>{' '}
                            секунд
                        </p>
                    </div>
                </div>
                <div className="col d-flex gap-4">
                    <Divider
                        orientation="vertical"
                        flexItem
                    />
                    <div className="w-100">
                        <List
                            sx={{
                                maxHeight: '152px',
                                overflow: 'auto',
                                minWidth: '300px',
                            }}
                            className="py-0"
                        >
                            {departmentIdList.map((id) => (
                                <DepartmentCallsChart
                                    key={id}
                                    departmentId={parseInt(id)}
                                    setSummaryCalls={setCallsSum}
                                    summaryCalls={callsSum}
                                    setIncomingCallsSum={setIncomingCallsSum}
                                    setOutgoingCallsSum={setOutgoingCallsSum}
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
