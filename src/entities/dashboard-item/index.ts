export { default as dashboardItemReducer } from './model/dashboardItemSlice';
export {
    default as openedDashboardReducer,
    setOpenedDashboard,
} from './model/openedDashboardSlice';
export { default as dashboardsReducer } from './model/dashboardsSlice';

export type { TDashboard, TPropertyValues } from './types';
export type { DashboardItemComponentProps } from './types';
