import { TDashboard } from 'entities/dashboard-item';
import { BX } from 'shared/api';
import { ENTITY } from 'shared/config/consts';
import { TResponse } from 'shared/model/types';
import { Statistics } from 'widgets/dashboard-settings/model/types';

export async function updateDashboard(statistics: Statistics, ID: number) {
    const response: TResponse<boolean> = await BX.callMethod(
        'entity.item.update',
        {
            ENTITY,
            ID,
            PROPERTY_VALUES: {
                CATEGORIES_LIST: statistics.category?.selectionIds,
                CATEGORIES_MONEY_GOAL: statistics.category?.moneyGoal,
                CATEGORIES_PRODUCTS_GOAL: statistics.category?.productsGoal,
                CATEGORIES_DEALS_GOAL: statistics.category?.dealsGoal,
                COWORKERS_LIST: statistics.coworkers?.selectionIds,
                COWORKERS_MONEY_GOAL: statistics.coworkers?.moneyGoal,
                COWORKERS_PRODUCTS_GOAL: statistics.coworkers?.productsGoal,
                COWORKERS_DEALS_GOAL: statistics.coworkers?.dealsGoal,
                COWORKERS_CALLS_GOAL: statistics.coworkers?.callsGoal,
                DEPARTMENT_LIST: statistics.department?.selectionIds,
                DEPARTMENT_MONEY_GOAL: statistics.department?.moneyGoal,
                DEPARTMENT_PRODUCTS_GOAL: statistics.department?.productsGoal,
                DEPARTMENT_DEALS_GOAL: statistics.department?.dealsGoal,
                DEPARTMENT_CALLS_GOAL: statistics.department?.callsGoal,
                PERIOD_START_DATE: statistics.period?.minDate || '',
                PERIOD_END_DATE: statistics.period?.maxDate || '',
            },
        },
    );
    if (response.ok) {
        return response.data;
    }
    throw new Error(response.ex.error_description);
}
