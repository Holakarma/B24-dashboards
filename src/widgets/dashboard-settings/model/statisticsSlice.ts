import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import type {CategoryStatistics, CoworkwersStatistics, DepartmentStiatisctics, Statistics,} from './types';

const initialState: { statistics: Statistics } = {
    statistics: {
        category: undefined,
        coworkers: undefined,
        department: undefined,
        period: {
            minDate: undefined,
            maxDate: undefined,
        },
        callsDuration: undefined,
    },
};

const statisticsSlice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {
        setStatistics(state, action: PayloadAction<Statistics>) {
            state.statistics = action.payload;
        },
        setCategoryStatistics(
            state,
            action: PayloadAction<CategoryStatistics>,
        ) {
            state.statistics.category = action.payload;
        },
        updateCategoryStatistics(
            state,
            action: PayloadAction<Partial<CategoryStatistics>>,
        ) {
            const finalObj = {
                ...state.statistics.category,
                ...action.payload,
            };

            state.statistics.category =
                finalObj as Required<CategoryStatistics>;
        },
        updateCoworkersStatistics(
            state,
            action: PayloadAction<Partial<CoworkwersStatistics>>,
        ) {
            const finalObj = {
                ...state.statistics.coworkers,
                ...action.payload,
            };

            state.statistics.coworkers =
                finalObj as Required<CoworkwersStatistics>;
        },
        updateDepartmentStatistics(
            state,
            action: PayloadAction<Partial<DepartmentStiatisctics>>,
        ) {
            const finalObj = {
                ...state.statistics.department,
                ...action.payload,
            };

            state.statistics.department =
                finalObj as Required<DepartmentStiatisctics>;
        },
        updatePeriod(state, action: PayloadAction<Statistics['period']>) {
            if (!action.payload) return;
            const finalPeriod = {
                ...state.statistics.period,
                ...action.payload,
            };
            state.statistics.period = finalPeriod;
        },
    },
});

export const {
    setStatistics,
    setCategoryStatistics,
    updateCategoryStatistics,
    updateCoworkersStatistics,
    updateDepartmentStatistics,
    updatePeriod,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
