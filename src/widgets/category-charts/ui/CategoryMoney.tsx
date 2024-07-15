import React, { FC, useEffect } from 'react';
import { Paper, Divider, List } from '@mui/material';
import { CategoryMoneyChart } from 'features/charts/category-charts/category-money-chart';
import { formatNumber } from 'shared/model/formatNumber';
import { CircularProgressWithLabel } from 'shared/ui/circular-progress-w-label';
import { TDashboard } from 'entities/dashboard-item';

interface CategoryMoneyProps {
    dashboard: TDashboard;
    categoriesIdList: string[];
}

export const CategoryMoney: FC<CategoryMoneyProps> = ({
    dashboard,
    categoriesIdList,
}) => {
    const [moneySum, setMoneySum] = React.useState(0);
    const [categoryMoneyList, setCategoryMoneyList] = React.useState(
        categoriesIdList.map((c) => ({ id: c, money: 0 })),
    );
    const [categoryMoneyListCopy, setCategoryMoneyListCopy] = React.useState([
        ...categoryMoneyList,
    ]);

    useEffect(() => {
        setCategoryMoneyList(
            categoriesIdList.map((c) => ({ id: c, money: 0 })),
        );
    }, [categoriesIdList]);

    useEffect(() => {
        const sortedCategoryMoneyList = [...categoryMoneyListCopy];
        sortedCategoryMoneyList.sort((a, b) => b.money - a.money);
        setCategoryMoneyList(sortedCategoryMoneyList);
    }, [categoryMoneyListCopy]);

    return (
        <Paper
            className="p-4"
            elevation={8}
        >
            <div className="d-flex gap-4 justify-content-between">
                <div className="d-flex gap-4">
                    <div>
                        <CircularProgressWithLabel
                            size={100}
                            value={
                                (moneySum * 100) /
                                parseInt(
                                    dashboard.PROPERTY_VALUES
                                        .CATEGORIES_MONEY_GOAL,
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
                                        .CATEGORIES_MONEY_GOAL,
                                )}
                            </span>{' '}
                            руб
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
                            {categoryMoneyList.map((c, i) => (
                                <CategoryMoneyChart
                                    key={c.id}
                                    categoryId={parseInt(c.id)}
                                    setMoneySum={setMoneySum}
                                    moneySum={moneySum}
                                    getCategoryMoney={(sum) => {
                                        let copyCopy = [...categoryMoneyList];
                                        copyCopy[i].money = sum;
                                        setCategoryMoneyListCopy(copyCopy);
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
