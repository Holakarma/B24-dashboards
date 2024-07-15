import { TDashboard } from 'entities/dashboard-item';
import { Statistics } from './types';

export function convertToStat(dashboard: TDashboard): Statistics {
    return {
        category: {
            selectionIds: dashboard.PROPERTY_VALUES.CATEGORIES_LIST,
            moneyGoal: dashboard.PROPERTY_VALUES.CATEGORIES_MONEY_GOAL,
            productsGoal: dashboard.PROPERTY_VALUES.CATEGORIES_PRODUCTS_GOAL,
            dealsGoal: dashboard.PROPERTY_VALUES.CATEGORIES_DEALS_GOAL,
        },
        coworkers: {
            selectionIds: dashboard.PROPERTY_VALUES.COWORKERS_LIST,
            moneyGoal: dashboard.PROPERTY_VALUES.COWORKERS_MONEY_GOAL,
            productsGoal: dashboard.PROPERTY_VALUES.COWORKERS_PRODUCTS_GOAL,
            dealsGoal: dashboard.PROPERTY_VALUES.COWORKERS_DEALS_GOAL,
            callsGoal: dashboard.PROPERTY_VALUES.COWORKERS_CALLS_GOAL,
        },
        department: {
            selectionIds: dashboard.PROPERTY_VALUES.DEPARTMENT_LIST,
            moneyGoal: dashboard.PROPERTY_VALUES.DEPARTMENT_MONEY_GOAL,
            productsGoal: dashboard.PROPERTY_VALUES.DEPARTMENT_PRODUCTS_GOAL,
            dealsGoal: dashboard.PROPERTY_VALUES.DEPARTMENT_DEALS_GOAL,
            callsGoal: dashboard.PROPERTY_VALUES.DEPARTMENT_CALLS_GOAL,
        },
        period: {
            minDate: dashboard.PROPERTY_VALUES.PERIOD_START_DATE,
            maxDate: dashboard.PROPERTY_VALUES.PERIOD_END_DATE,
        },
        callsDuration: dashboard.PROPERTY_VALUES.CALLS_DURATION,
    };
}
