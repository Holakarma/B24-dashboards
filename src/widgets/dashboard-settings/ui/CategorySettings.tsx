import React, { FC, memo, useCallback } from 'react';
import { Divider } from '@mui/material';
import { SettingsChip } from 'shared/ui/settings-chip';
import { getCategories } from 'entities/category';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import { updateCategoryStatistics } from '../model/statisticsSlice';
import { GoalInput } from 'shared/ui/goalInput';
import type { TClearEvent } from 'shared/ui/goalInput';

export const CategorySettings = memo(({}) => {
    const dispatch = useAppDispatch();
    const { category: statistics } = useAppSelector(
        (state) => state.statistics.statistics,
    );

    const changeHandler = useCallback(
        (e: {
            target: {
                name: string;
                value: string;
            };
        }) => {
            dispatch(
                updateCategoryStatistics({
                    [e.target.name]: e.target.value,
                }),
            );
        },
        [],
    );

    const clickHandler = useCallback(
        ({ event, inputName }: TClearEvent) => {
            dispatch(
                updateCategoryStatistics({
                    [inputName]: '',
                }),
            );
        },

        [],
    );
    return (
        <div>
            <div className="py-2">
                <SettingsChip
                    queryFn={() => getCategories()}
                    queryKey={['categories']}
                    selector="category"
                    title="Воронки"
                    dispatchFn={(ids) =>
                        dispatch(
                            updateCategoryStatistics({ selectionIds: ids }),
                        )
                    }
                />
            </div>
            <Divider />
            <div>
                <div className="py-4">
                    <GoalInput
                        className="w-100"
                        label="Финансовая цель"
                        id="category-money-goal"
                        value={
                            statistics?.selectionIds.length === 0
                                ? ''
                                : statistics?.moneyGoal
                        }
                        name="moneyGoal"
                        onChange={changeHandler}
                        onClick={clickHandler}
                        suffix="₽"
                        disabled={statistics?.selectionIds.length === 0}
                    />
                    <GoalInput
                        className="w-100"
                        label="Цель сделок"
                        id="category-deals-goal"
                        value={
                            statistics?.selectionIds.length === 0
                                ? ''
                                : statistics?.dealsGoal
                        }
                        name="dealsGoal"
                        onChange={changeHandler}
                        onClick={clickHandler}
                        suffix="Сделок"
                        decimalScale={0}
                        disabled={statistics?.selectionIds.length === 0}
                    />
                    <GoalInput
                        className="w-100"
                        label="Цель товаров"
                        id="category-products-goal"
                        value={
                            statistics?.selectionIds.length === 0
                                ? ''
                                : statistics?.productsGoal
                        }
                        name="productsGoal"
                        onChange={changeHandler}
                        onClick={clickHandler}
                        suffix="Товаров"
                        decimalScale={0}
                        disabled={statistics?.selectionIds.length === 0}
                    />
                </div>
            </div>
        </div>
    );
});
