import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Divider, Skeleton } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import { GoalInput, TClearEvent } from 'shared/ui/goalInput';
import { SettingsChip } from 'shared/ui/settings-chip';
import { updateDepartmentStatistics } from '../model/statisticsSlice';
import { getDepartments } from 'entities/department';
import { BX } from 'shared/api';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from 'entities/user';
import { TDepartment } from 'entities/department/model/types';
import { CorrectDataType } from 'shared/ui/settings-chip';

export const DepartmentSettings = memo(() => {
    const dispatch = useAppDispatch();

    const { department: statistics } = useAppSelector(
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
                updateDepartmentStatistics({
                    [e.target.name]: e.target.value,
                }),
            );
        },
        [],
    );

    const clickHandler = useCallback(
        ({ event, inputName }: TClearEvent) => {
            dispatch(
                updateDepartmentStatistics({
                    [inputName]: '',
                }),
            );
        },

        [],
    );

    const { data: departments, isLoading } = useQuery({
        queryFn: async () => await getDepartments(),
        queryKey: ['departments'],
        staleTime: 1000 * 60,
        throwOnError: true,
    });

    const { data: currentUser } = useQuery({
        queryFn: async () => await getCurrentUser(),
        queryKey: ['currentUser'],
        staleTime: 1000 * 60,
        throwOnError: true,
    });

    const [isSubsLoaded, setSubsLoaded] = useState(false);

    const subDepartments = useMemo(() => {
        const result: string[] = [];
        if (currentUser && departments) {
            departments.forEach((d) => {
                let node: TDepartment | undefined = d;

                do {
                    if (node.UF_HEAD === currentUser.ID) {
                        result.push(d.ID);
                    }
                    const parent = departments.find(
                        (dep) => dep.ID === node?.PARENT,
                    );
                    node = parent;
                } while (node);
            });
            setSubsLoaded(true);
        }
        return result;
    }, [currentUser, departments]);

    const dispatchFn = useCallback(
        (ids: string) =>
            dispatch(
                updateDepartmentStatistics({
                    selectionIds: ids,
                }),
            ),
        [],
    );

    const queryFn = useCallback(() => getDepartments(), []);

    const converter = useCallback(
        (data: TDepartment[]) => {
            return data.map((d) => ({
                id: parseInt(d.ID),
                name: d.NAME,
                disabled: !BX.isAdmin() && !subDepartments.includes(d.ID),
            }));
        },
        [subDepartments],
    ) as (data: object[]) => CorrectDataType[];

    return (
        <div>
            <div className="py-2">
                {!isSubsLoaded ? (
                    <Skeleton sx={{ height: '56px' }} />
                ) : (
                    <SettingsChip
                        queryFn={queryFn}
                        queryKey={['departments']}
                        selector="department"
                        title="Отделы"
                        dispatchFn={dispatchFn}
                        converter={converter}
                    />
                )}
            </div>
            <Divider />
            <div>
                <div className="py-4">
                    <GoalInput
                        className="w-100"
                        label="Финансовая цель"
                        id="department-money-goal"
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
                        id="department-deals-goal"
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
                        id="department-products-goal"
                        value={
                            statistics?.selectionIds.length === 0
                                ? ''
                                : statistics?.productsGoal
                        }
                        name="productsGoal"
                        onChange={changeHandler}
                        onClick={clickHandler}
                        suffix="Товаров"
                        decimalScale={4}
                        disabled={statistics?.selectionIds.length === 0}
                    />
                    <GoalInput
                        className="w-100"
                        label="Цель звонков"
                        id="department-calls-goal"
                        value={
                            statistics?.selectionIds.length === 0
                                ? ''
                                : statistics?.callsGoal
                        }
                        name="callsGoal"
                        onChange={changeHandler}
                        onClick={clickHandler}
                        suffix="Секунд"
                        decimalScale={0}
                        disabled={statistics?.selectionIds.length === 0}
                    />
                </div>
            </div>
        </div>
    );
});
