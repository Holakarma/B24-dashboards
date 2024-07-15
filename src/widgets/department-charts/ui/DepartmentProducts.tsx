import React, { FC, useEffect } from 'react';
import { Paper, Divider, List } from '@mui/material';
import { formatNumber } from 'shared/model/formatNumber';
import { CircularProgressWithLabel } from 'shared/ui/circular-progress-w-label';
import { TDashboard } from 'entities/dashboard-item';
import { CoworkersProductsChart } from 'features/charts/coworkers-charts/coworkers-products-chart';
import { DepartmentProductsChart } from 'features/charts/department-charts/department-products-chart/ui/DepartmentProductsChart';

interface DepartmentProducsProps {
    dashboard: TDashboard;
    departmentIdList: string[];
}

export const DepartmentProducts: FC<DepartmentProducsProps> = ({
    dashboard,
    departmentIdList,
}) => {
    const [summaryProducts, setSummaryProducts] = React.useState(0);
    const [departmentProductsList, setDepartmentProductsList] = React.useState(
        departmentIdList.map((c) => ({ id: c, products: 0 })),
    );

    useEffect(() => {
        setDepartmentProductsList(
            departmentIdList.map((c) => ({ id: c, products: 0 })),
        );
    }, [departmentIdList]);

    const [departmentProductsListCopy, setDepartmentProductsListCopy] =
        React.useState([...departmentProductsList]);

    useEffect(() => {
        const sortedDepartmentProductsList = [...departmentProductsListCopy];
        sortedDepartmentProductsList.sort((a, b) => b.products - a.products);
        setDepartmentProductsList(sortedDepartmentProductsList);
    }, [departmentProductsListCopy]);

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
                                        .DEPARTMENT_PRODUCTS_GOAL,
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
                                        .DEPARTMENT_PRODUCTS_GOAL,
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
                            {departmentProductsList.map((c, i) => (
                                <DepartmentProductsChart
                                    key={c.id}
                                    departmentId={parseInt(c.id)}
                                    setSummaryProducts={setSummaryProducts}
                                    summaryProducts={summaryProducts}
                                    getDepartmentProducts={(count) => {
                                        let copyCopy = [
                                            ...departmentProductsList,
                                        ];
                                        copyCopy[i].products = count;
                                        setDepartmentProductsListCopy(copyCopy);
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
