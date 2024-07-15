export { DashboardSettings } from './ui/DashboardSettings';
export { convertToStat } from './model/convertToStat';
export {
    default as statisticsReducer,
    setStatistics,
    setCategoryStatistics,
    updateCategoryStatistics,
    updateCoworkersStatistics,
    updatePeriod,
} from './model/statisticsSlice';

export type { Statistics } from './model/types';
