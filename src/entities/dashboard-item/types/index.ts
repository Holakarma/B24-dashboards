export type TDashboard = {
    ACTIVE: 'Y' | 'N';
    CODE: null | string;
    CREATED_BY: string;
    DATE_ACTIVE_FROM: string;
    DATE_ACTIVE_TO: string;
    DATE_CREATE: string;
    DETAIL_PICTURE: null | string;
    DETAIL_TEXT: null | string;
    ENTITY: string;
    ID: string;
    MODIFIED_BY: string;
    NAME: string;
    PREVIEW_PICTURE: null | string;
    PREVIEW_TEXT: null | string;
    PROPERTY_VALUES: TPropertyValues;
    SECTION: null | string;
    SORT: string;
    TIMESTAMP_X: string;
};

export type TPropertyValues = {
    CATEGORIES_DEALS_GOAL: string;
    CATEGORIES_LIST: string;
    CATEGORIES_MONEY_GOAL: string;
    CATEGORIES_PRODUCTS_GOAL: string;
    COWORKERS_DEALS_GOAL: string;
    COWORKERS_LIST: string;
    COWORKERS_MONEY_GOAL: string;
    COWORKERS_PRODUCTS_GOAL: string;
    COWORKERS_CALLS_GOAL: string;
    DEPARTMENT_DEALS_GOAL: string;
    DEPARTMENT_LIST: string;
    DEPARTMENT_MONEY_GOAL: string;
    DEPARTMENT_PRODUCTS_GOAL: string;
    DEPARTMENT_CALLS_GOAL: string;
    PARTICIPANTS_LIST: string;
    PERIOD_START_DATE: string;
    PERIOD_END_DATE: string;
    CALLS_DURATION: string;
};
export interface DashboardItemComponentProps {
    dashboard: TDashboard;
}
