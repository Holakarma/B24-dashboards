import React, { FC, useEffect } from 'react';
import { Paper, Divider, List } from '@mui/material';
import { formatNumber } from 'shared/model/formatNumber';
import { CircularProgressWithLabel } from 'shared/ui/circular-progress-w-label';
import { TDashboard } from 'entities/dashboard-item';
import { CoworkersProductsChart } from 'features/charts/coworkers-charts/coworkers-products-chart';

interface CoworkersProducsProps {
    dashboard: TDashboard;
    coworkersIdList: string[];
}

export const CoworkersProducts: FC<CoworkersProducsProps> = ({
    dashboard,
    coworkersIdList,
}) => {
    const [summaryProductsRaw, setSummaryProductsRaw] = React.useState(0);
    const [summaryProducts, setSummaryProducts] = React.useState(
        coworkersIdList.map((c) => ({ id: c, products: 0 })),
    );

    useEffect(() => {
        setSummaryProducts(
            coworkersIdList.map((c) => ({ id: c, products: 0 })),
        );
    }, [coworkersIdList]);

    const [summaryProductsCopy, setSummaryProductsCopy] = React.useState([
        ...summaryProducts,
    ]);

    useEffect(() => {
        const sortedCoworkersList = [...summaryProductsCopy];
        sortedCoworkersList.sort((a, b) => b.products - a.products);
        setSummaryProducts(sortedCoworkersList);
    }, [summaryProductsCopy]);

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
                                (summaryProductsRaw * 100) /
                                parseInt(
                                    dashboard.PROPERTY_VALUES
                                        .COWORKERS_PRODUCTS_GOAL,
                                )
                            }
                        />
                    </div>
                    <Divider
                        orientation="vertical"
                        flexItem
                    />
                    <div>
                        <h5>Товары</h5>
                        <p>
                            {formatNumber(String(summaryProductsRaw))}{' '}
                            <span className="opacity-50">
                                /{' '}
                                {formatNumber(
                                    dashboard.PROPERTY_VALUES
                                        .COWORKERS_PRODUCTS_GOAL,
                                )}
                            </span>{' '}
                            Товаров
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
                            {summaryProducts.map((c, i) => (
                                <CoworkersProductsChart
                                    key={c.id}
                                    coworkerId={parseInt(c.id)}
                                    onDealsLoaded={(count) => {
                                        setSummaryProductsRaw(
                                            (oldCount) => oldCount + count,
                                        );
                                        let copyCopy = [...summaryProducts];
                                        copyCopy[i].products = count;
                                        setSummaryProductsCopy(copyCopy);
                                    }}
                                    cleanupFn={(count) =>
                                        setSummaryProductsRaw(
                                            (oldCount) => oldCount - count,
                                        )
                                    }
                                    summaryProducts={summaryProductsRaw}
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
