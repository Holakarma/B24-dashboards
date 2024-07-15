import React, { FC, useEffect } from 'react';
import { TDashboard } from 'entities/dashboard-item';
import { Paper, Divider, List } from '@mui/material';
import { formatNumber } from 'shared/model/formatNumber';
import { CircularProgressWithLabel } from 'shared/ui/circular-progress-w-label';
import { CoworkersMoneyChart } from 'features/charts/coworkers-charts/coworkers-money-chart';

interface CoworkersMoneyProps {
    dashboard: TDashboard;
    coworkersIdList: string[];
}

export const CoworkersMoney: FC<CoworkersMoneyProps> = ({
    dashboard,
    coworkersIdList,
}) => {
    const [moneySum, setMoneySum] = React.useState(0);
    const [coworkersList, setCoworkersList] = React.useState(
        coworkersIdList.map((c) => ({ id: c, money: 0 })),
    );

    useEffect(() => {
        setCoworkersList(coworkersIdList.map((c) => ({ id: c, money: 0 })));
    }, [coworkersIdList]);

    const [coworkersListCopy, setCoworkersListCopy] = React.useState([
        ...coworkersList,
    ]);

    useEffect(() => {
        const sortedCoworkersList = [...coworkersListCopy];
        sortedCoworkersList.sort((a, b) => b.money - a.money);
        setCoworkersList(sortedCoworkersList);
    }, [coworkersListCopy]);

    return (
        <Paper
            className="p-4"
            elevation={8}
        >
            <div className="row">
                <div className="col-7 d-flex gap-4">
                    <div>
                        <CircularProgressWithLabel
                            size={100}
                            value={
                                (moneySum * 100) /
                                parseInt(
                                    dashboard.PROPERTY_VALUES
                                        .COWORKERS_MONEY_GOAL,
                                )
                            }
                        />
                    </div>
                    <Divider
                        orientation="vertical"
                        flexItem
                    />
                    <div>
                        <h5>Доход</h5>
                        <p>
                            {formatNumber(String(moneySum))}{' '}
                            <span className="opacity-50">
                                /{' '}
                                {formatNumber(
                                    dashboard.PROPERTY_VALUES
                                        .COWORKERS_MONEY_GOAL,
                                )}
                            </span>{' '}
                            руб
                        </p>
                    </div>
                </div>
                <div className="col-5 d-flex gap-4">
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
                                width: '330px',
                            }}
                            className="py-0"
                        >
                            {coworkersList.map((c, i) => (
                                <CoworkersMoneyChart
                                    key={c.id}
                                    coworkerId={parseInt(c.id)}
                                    onDealsLoaded={(sum) => {
                                        setMoneySum((oldSum) => oldSum + sum);
                                        let copyCopy = [...coworkersList];
                                        copyCopy[i].money = sum;
                                        setCoworkersListCopy(copyCopy);
                                    }}
                                    cleanupFn={(sum) =>
                                        setMoneySum((oldSum) => oldSum - sum)
                                    }
                                    moneySum={moneySum}
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
