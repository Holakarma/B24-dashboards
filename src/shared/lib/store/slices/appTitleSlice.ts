import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface AppTitleState {
    title: string;
}

const initialState = {
    title: 'Dashboards',
} satisfies AppTitleState as AppTitleState;

const appTitleSlice = createSlice({
    name: 'appTitle',
    initialState,
    reducers: {
        changeTitle(state, action: PayloadAction<string>) {
            state.title = action.payload;
        },
    },
});

export const { changeTitle } = appTitleSlice.actions;

export default appTitleSlice.reducer;
