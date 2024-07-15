import { createSlice } from '@reduxjs/toolkit';
import { DepartmentSchema } from './types';

const initialState: { departments: DepartmentSchema[] | null } = {
    departments: null,
};

const departmentsSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {
        setDepartments(
            state,
            action: { type: string; payload: DepartmentSchema[] },
        ) {
            state.departments = action.payload;
        },
    },
});

export const { actions: departmentsActions } = departmentsSlice;
export const { reducer: departmentsReducer } = departmentsSlice;
