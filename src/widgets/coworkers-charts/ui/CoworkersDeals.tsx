import React, { FC, useEffect } from 'react';
import { Paper, Divider, List } from '@mui/material';
import { CategoryMoneyChart } from 'features/charts/category-charts/category-money-chart';
import { formatNumber } from 'shared/model/formatNumber';
import { CircularProgressWithLabel } from 'shared/ui/circular-progress-w-label';
import { TDashboard } from 'entities/dashboard-item';
import { CategoryDealsChart } from 'features/charts/category-charts/category-deals-chart';
import { CoworkersDealCharts } from 'features/charts/coworkers-charts/coworkers-deals-chart';

interface CoworkersDealsProps {
    dashboard: TDashboard;
    coworkersIdList: string[];
}

export const CoworkersDeals: FC<CoworkersDealsProps> = ({
    dashboard,
    coworkersIdList,
}) => {
    const [summaryDealsRaw, setSummaryDealsRaw] = React.useState(0);
    const [summaryDeals, setSummaryDeals] = React.useState(
        coworkersIdList.map((c) => ({ id: c, deals: 0 })),
    );

    useEffect(() => {
        setSummaryDeals(coworkersIdList.map((c) => ({ id: c, deals: 0 })));
    }, [coworkersIdList]);

    const [summaryDealsCopy, setSummaryDealsCopy] = React.useState([
        ...summaryDeals,
    ]);

    useEffect(() => {
        const sortedSummaryDealsList = [...summaryDealsCopy];
        sortedSummaryDealsList.sort((a, b) => b.deals - a.deals);
        setSummaryDeals(sortedSummaryDealsList);
    }, [summaryDealsCopy]);
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
                                (summaryDealsRaw * 100) /
                                parseInt(
                                    dashboard.PROPERTY_VALUES
                                        .COWORKERS_DEALS_GOAL,
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
                                        .COWORKERS_DEALS_GOAL,
                                )}
                            </span>{' '}
                            Сделок
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
                            {summaryDeals.map((c, i) => (
                                <CoworkersDealCharts
                                    key={c.id}
                                    coworkerId={parseInt(c.id)}
                                    onDealsLoaded={(count) => {
                                        setSummaryDealsRaw(
                                            (oldSum) => oldSum + count,
                                        );
                                        let copyCopy = [...summaryDeals];
                                        copyCopy[i].id = c.id;
                                        copyCopy[i].deals = count;
                                        setSummaryDealsCopy(copyCopy);
                                    }}
                                    cleanupFn={(count) =>
                                        setSummaryDealsRaw(
                                            (oldSum) => oldSum - count,
                                        )
                                    }
                                    summaryDealsRaw={summaryDealsRaw}
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
