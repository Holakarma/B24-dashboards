import { useMemo } from 'react';
import { useAppSelector } from 'shared/lib/store';
import { DepartmentMoney } from './DepartmentMoney';
import { DepartmentDeals } from './DepartmentDeals';
import { DepartmentProducts } from './DepartmentProducts';
import { DepartmentCalls } from './DepartmentCalls';

export const DepartmentCharts = () => {
    const dashboard = useAppSelector(
        (state) => state.openedDashboard.dashboard,
    );

    const departmentIdList = useMemo(
        () => dashboard?.PROPERTY_VALUES.DEPARTMENT_LIST.split(','),
        [dashboard],
    );
    const departmentsMoneyGoal = useMemo(
        () => dashboard?.PROPERTY_VALUES.DEPARTMENT_MONEY_GOAL.length,
        [dashboard],
    );
    const departmentDealsGoal = useMemo(
        () => dashboard?.PROPERTY_VALUES.DEPARTMENT_DEALS_GOAL.length,
        [dashboard],
    );
    const departmentProductsGoal = useMemo(
        () => dashboard?.PROPERTY_VALUES.DEPARTMENT_PRODUCTS_GOAL.length,
        [dashboard],
    );
    const departmentCallsGoal = useMemo(
        () => dashboard?.PROPERTY_VALUES.DEPARTMENT_CALLS_GOAL.length,
        [dashboard],
    );

    if (!dashboard) return <p>Ошибка при получении дашборда</p>;
    if (!departmentIdList) return null;

    return (
        <div className="my-4">
            {departmentsMoneyGoal ? (
                <DepartmentMoney
                    dashboard={dashboard}
                    departmentIdList={departmentIdList}
                />
            ) : null}
            {departmentDealsGoal ? (
                <DepartmentDeals
                    dashboard={dashboard}
                    departmentIdList={departmentIdList}
                />
            ) : null}
            {departmentProductsGoal ? (
                <DepartmentProducts
                    dashboard={dashboard}
                    departmentIdList={departmentIdList}
                />
            ) : null}
            {departmentCallsGoal ? (
                <DepartmentCalls
                    dashboard={dashboard}
                    departmentIdList={departmentIdList}
                />
            ) : null}
        </div>
    );
};
