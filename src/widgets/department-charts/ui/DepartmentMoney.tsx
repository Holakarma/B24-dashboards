import React, { FC, useEffect } from 'react';
import { TDashboard } from 'entities/dashboard-item';
import { Paper, Divider, List } from '@mui/material';
import { formatNumber } from 'shared/model/formatNumber';
import { CircularProgressWithLabel } from 'shared/ui/circular-progress-w-label';
import { DepartmentMoneyChart } from 'features/charts/department-charts/department-money-chart';

interface DepartmentMoneyProps {
    dashboard: TDashboard;
    departmentIdList: string[];
}

export const DepartmentMoney: FC<DepartmentMoneyProps> = ({
    dashboard,
    departmentIdList,
}) => {
    const [moneySum, setMoneySum] = React.useState(0);
    const [departmentMoneyList, setDepartmentMoneyList] = React.useState(
        departmentIdList.map((c) => ({ id: c, money: 0 })),
    );

    useEffect(() => {
        setDepartmentMoneyList(
            departmentIdList.map((c) => ({ id: c, money: 0 })),
        );
    }, [departmentIdList]);

    const [departmentMoneyListCopy, setDepartmentMoneyListCopy] =
        React.useState([...departmentMoneyList]);

    useEffect(() => {
        const sortedDepartmentMoneyList = [...departmentMoneyListCopy];
        sortedDepartmentMoneyList.sort((a, b) => b.money - a.money);
        setDepartmentMoneyList(sortedDepartmentMoneyList);
    }, [departmentMoneyListCopy]);

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
                                        .DEPARTMENT_MONEY_GOAL,
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
                                        .DEPARTMENT_MONEY_GOAL,
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
                            {departmentMoneyList.map((c, i) => (
                                <DepartmentMoneyChart
                                    key={c.id}
                                    departmentId={parseInt(c.id)}
                                    setMoneySum={setMoneySum}
                                    moneySum={moneySum}
                                    getDepartmentMoney={(count) => {
                                        let copyCopy = [...departmentMoneyList];
                                        copyCopy[i].money = count;
                                        setDepartmentMoneyListCopy(copyCopy);
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
