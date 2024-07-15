import React, { FC } from 'react';
import { TDashboard } from 'entities/dashboard-item';
import { Paper, Divider, List } from '@mui/material';
import { formatNumber } from 'shared/model/formatNumber';
import { CircularProgressWithLabel } from 'shared/ui/circular-progress-w-label';
import { CoworkersCallsChart } from 'features/charts/coworkers-charts/coworkers-calls-chart';

interface CoworkersCallsProps {
    dashboard: TDashboard;
    coworkersIdList: string[];
}

export const CoworkersCalls: FC<CoworkersCallsProps> = ({
    dashboard,
    coworkersIdList,
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
                                        .COWORKERS_CALLS_GOAL,
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
                                        .COWORKERS_CALLS_GOAL,
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
                                        .COWORKERS_CALLS_GOAL,
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
                                        .COWORKERS_CALLS_GOAL,
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
                            {coworkersIdList.map((id) => (
                                <CoworkersCallsChart
                                    key={id}
                                    coworkerId={parseInt(id)}
                                    onCallsLoaded={({
                                        incomingCalls,
                                        outgoingCalls,
                                    }) => {
                                        setCallsSum(
                                            (oldSum) =>
                                                oldSum +
                                                incomingCalls +
                                                outgoingCalls,
                                        );
                                        setIncomingCallsSum(
                                            (oldSum) => oldSum + incomingCalls,
                                        );
                                        setOutgoingCallsSum(
                                            (oldSum) => oldSum + outgoingCalls,
                                        );
                                    }}
                                    cleanupFn={({
                                        incomingCalls,
                                        outgoingCalls,
                                    }) => {
                                        setCallsSum(
                                            (oldSum) =>
                                                oldSum -
                                                incomingCalls -
                                                outgoingCalls,
                                        );
                                        setIncomingCallsSum(
                                            (oldSum) => oldSum - incomingCalls,
                                        );
                                        setOutgoingCallsSum(
                                            (oldSum) => oldSum - outgoingCalls,
                                        );
                                    }}
                                    callsSum={callsSum}
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
