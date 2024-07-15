import React, { FC, useEffect } from 'react';
import { Paper, Divider, List } from '@mui/material';
import { formatNumber } from 'shared/model/formatNumber';
import { CircularProgressWithLabel } from 'shared/ui/circular-progress-w-label';
import { TDashboard } from 'entities/dashboard-item';
import { CategoryDealsChart } from 'features/charts/category-charts/category-deals-chart';

interface CategoryDealsProps {
    dashboard: TDashboard;
    categoriesIdList: string[];
}

export const CategoryDeals: FC<CategoryDealsProps> = ({
    dashboard,
    categoriesIdList,
}) => {
    const [summaryDeals, setSummaryDeals] = React.useState(0);
    const [summaryDealsList, setSummaryDealsList] = React.useState(
        categoriesIdList.map((c) => ({ id: c, deals: 0 })),
    );

    useEffect(() => {
        setSummaryDealsList(categoriesIdList.map((c) => ({ id: c, deals: 0 })));
    }, [categoriesIdList]);

    const [summaryDealsListCopy, setSummaryDealsListCopy] = React.useState([
        ...summaryDealsList,
    ]);

    useEffect(() => {
        const sortedSummaryDealsList = [...summaryDealsListCopy];
        sortedSummaryDealsList.sort((a, b) => b.deals - a.deals);
        setSummaryDealsList(sortedSummaryDealsList);
    }, [summaryDealsListCopy]);

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
                                (summaryDeals * 100) /
                                parseInt(
                                    dashboard.PROPERTY_VALUES
                                        .CATEGORIES_DEALS_GOAL,
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
                            {formatNumber(String(summaryDeals))}{' '}
                            <span className="opacity-50">
                                /{' '}
                                {formatNumber(
                                    dashboard.PROPERTY_VALUES
                                        .CATEGORIES_DEALS_GOAL,
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
                            {summaryDealsList.map((c, i) => (
                                <CategoryDealsChart
                                    key={c.id}
                                    categoryId={parseInt(c.id)}
                                    setSummaryDeals={setSummaryDeals}
                                    summaryDeals={summaryDeals}
                                    getCategoryDeals={(count) => {
                                        let copyCopy = [...summaryDealsList];
                                        copyCopy[i].deals = count;
                                        setSummaryDealsListCopy(copyCopy);
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
