import { useMemo } from 'react';
import { useAppSelector } from 'shared/lib/store';
import { CategoryMoney } from './CategoryMoney';
import { CategoryDeals } from './CategoryDeals';
import { CategoryProducts } from './CategoryProducts';

export const CategoryCharts = () => {
    const dashboard = useAppSelector(
        (state) => state.openedDashboard.dashboard,
    );

    const categoriesIdList = useMemo(
        () => dashboard?.PROPERTY_VALUES.CATEGORIES_LIST.split(','),
        [dashboard],
    );
    const categoriesMoneyGoal = useMemo(
        () => dashboard?.PROPERTY_VALUES.CATEGORIES_MONEY_GOAL.length,
        [dashboard],
    );
    const categoriesDealsGoal = useMemo(
        () => dashboard?.PROPERTY_VALUES.CATEGORIES_DEALS_GOAL.length,
        [dashboard],
    );
    const categoriesProductsGoal = useMemo(
        () => dashboard?.PROPERTY_VALUES.CATEGORIES_PRODUCTS_GOAL.length,
        [dashboard],
    );

    if (!dashboard) return <p>Ошибка при получении дашборда</p>;
    if (!categoriesIdList) return null;

    return (
        <div className="my-4">
            {categoriesMoneyGoal ? (
                <CategoryMoney
                    dashboard={dashboard}
                    categoriesIdList={categoriesIdList}
                />
            ) : null}
            {categoriesDealsGoal ? (
                <CategoryDeals
                    dashboard={dashboard}
                    categoriesIdList={categoriesIdList}
                />
            ) : null}
            {categoriesProductsGoal ? (
                <CategoryProducts
                    dashboard={dashboard}
                    categoriesIdList={categoriesIdList}
                />
            ) : null}
        </div>
    );
};
