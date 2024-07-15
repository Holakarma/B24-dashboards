import React, { FC, useEffect } from 'react';
import { Paper, Divider, List } from '@mui/material';
import { formatNumber } from 'shared/model/formatNumber';
import { CircularProgressWithLabel } from 'shared/ui/circular-progress-w-label';
import { TDashboard } from 'entities/dashboard-item';
import { CategoryProductsChart } from 'features/charts/category-charts/category-products-chart';

interface CategoryProducsProps {
    dashboard: TDashboard;
    categoriesIdList: string[];
}

export const CategoryProducts: FC<CategoryProducsProps> = ({
    dashboard,
    categoriesIdList,
}) => {
    const [summaryProducts, setSummaryProducts] = React.useState(0);
    const [summaryProductsList, setSummaryProductsList] = React.useState(
        categoriesIdList.map((c) => ({ id: c, products: 0 })),
    );

    useEffect(() => {
        setSummaryProductsList(
            categoriesIdList.map((c) => ({ id: c, products: 0 })),
        );
    }, [categoriesIdList]);

    const [summaryProductsListCopy, setSummaryProductsListCopy] =
        React.useState([...summaryProductsList]);

    useEffect(() => {
        const sortedSummaryProductsList = [...summaryProductsListCopy];
        sortedSummaryProductsList.sort((a, b) => b.products - a.products);
        setSummaryProductsList(sortedSummaryProductsList);
    }, [summaryProductsListCopy]);

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
                                (summaryProducts * 100) /
                                parseInt(
                                    dashboard.PROPERTY_VALUES
                                        .CATEGORIES_PRODUCTS_GOAL,
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
                            {formatNumber(String(summaryProducts))}{' '}
                            <span className="opacity-50">
                                /{' '}
                                {formatNumber(
                                    dashboard.PROPERTY_VALUES
                                        .CATEGORIES_PRODUCTS_GOAL,
                                )}
                            </span>{' '}
                            Товаров
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
                            {summaryProductsList.map((c, i) => (
                                <CategoryProductsChart
                                    key={c.id}
                                    categoryId={parseInt(c.id)}
                                    setSummaryProducts={setSummaryProducts}
                                    summaryProducts={summaryProducts}
                                    getCategoryProducts={(count) => {
                                        let copyCopy = [...summaryProductsList];
                                        copyCopy[i].products = count;
                                        setSummaryProductsListCopy(copyCopy);
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
