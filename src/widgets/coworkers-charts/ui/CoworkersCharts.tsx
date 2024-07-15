import React, { FC, useEffect, useMemo } from 'react';
import { useAppSelector } from 'shared/lib/store';
import { CoworkersMoney } from './CoworkersMoney';
import { CoworkersDeals } from './CoworkersDeals';
import { CoworkersProducts } from './CoworkersProducts';
import { CoworkersCalls } from './CoworkersCalls';

export const CoworkersCharts = () => {
    const dashboard = useAppSelector(
        (state) => state.openedDashboard.dashboard,
    );

    const coworkersIdList = useMemo(
        () => dashboard?.PROPERTY_VALUES.COWORKERS_LIST.split(','),
        [dashboard],
    );
    const coworkersMoneyGoal = useMemo(
        () => dashboard?.PROPERTY_VALUES.COWORKERS_MONEY_GOAL.length,
        [dashboard],
    );
    const coworkersDealsGoal = useMemo(
        () => dashboard?.PROPERTY_VALUES.COWORKERS_DEALS_GOAL.length,
        [dashboard],
    );
    const coworkersProductsGoal = useMemo(
        () => dashboard?.PROPERTY_VALUES.COWORKERS_PRODUCTS_GOAL.length,
        [dashboard],
    );
    const coworkersCallsGoal = useMemo(
        () => dashboard?.PROPERTY_VALUES.COWORKERS_CALLS_GOAL.length,
        [dashboard],
    );

    if (!dashboard) return <p>Ошибка при получении дашборда</p>;
    if (!coworkersIdList) return null;

    return (
        <div className="my-4">
            {coworkersMoneyGoal ? (
                <CoworkersMoney
                    dashboard={dashboard}
                    coworkersIdList={coworkersIdList}
                />
            ) : null}
            {coworkersDealsGoal ? (
                <CoworkersDeals
                    dashboard={dashboard}
                    coworkersIdList={coworkersIdList}
                />
            ) : null}
            {coworkersProductsGoal ? (
                <CoworkersProducts
                    dashboard={dashboard}
                    coworkersIdList={coworkersIdList}
                />
            ) : null}
            {coworkersCallsGoal ? (
                <CoworkersCalls
                    dashboard={dashboard}
                    coworkersIdList={coworkersIdList}
                />
            ) : null}
        </div>
    );
};
