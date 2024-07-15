import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { getUser } from 'entities/user/api/getUser';
import { CorrectDataType, SettingsChip } from 'shared/ui/settings-chip';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import { updateCoworkersStatistics } from '../model/statisticsSlice';
import { Divider, Skeleton } from '@mui/material';
import { GoalInput, TClearEvent } from 'shared/ui/goalInput';
import { useQuery } from '@tanstack/react-query';
import { getDepartments } from 'entities/department';
import { Tuser, getCurrentUser } from 'entities/user';
import { BX } from 'shared/api';
import { TDepartment } from 'entities/department/model/types';

export const CoworkersSettings = memo(() => {
    const dispatch = useAppDispatch();

    const { coworkers: statistics } = useAppSelector(
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
                updateCoworkersStatistics({
                    [e.target.name]: e.target.value,
                }),
            );
        },
        [],
    );

    const clickHandler = useCallback(({ event, inputName }: TClearEvent) => {
        dispatch(
            updateCoworkersStatistics({
                [inputName]: '',
            }),
        );
    }, []);

    const { data: users, isLoading: isUsersLoading } = useQuery({
        queryFn: async () => await getUser(),
        queryKey: ['coworkers'],
        staleTime: 1000 * 60,
        throwOnError: true,
    });
    const { data: currentUser } = useQuery({
        queryFn: async () => await getCurrentUser(),
        queryKey: ['currentUser'],
        staleTime: 1000 * 60,
        throwOnError: true,
    });

    const { data: departments, isLoading } = useQuery({
        queryFn: async () => await getDepartments(),
        queryKey: ['departments'],
        enabled: !!users && !!currentUser,
        staleTime: 1000 * 60,
        throwOnError: true,
    });

    // const [subordinates, setSubordinates] = useState<number[]>([]);

    const subordinates = useMemo(() => {
        let result: string[] = [];
        if (departments && users && currentUser) {
            let subDepartment: string[] = [];
            departments.forEach((d) => {
                let node: TDepartment | undefined = d;

                do {
                    if (node.UF_HEAD === currentUser.ID) {
                        subDepartment.push(d.ID);
                    }
                    const parent = departments.find(
                        (dep) => dep.ID === node?.PARENT,
                    );
                    node = parent;
                } while (node);
            });
            if (subDepartment) {
                result = users
                    .filter(
                        (sub) =>
                            sub.UF_DEPARTMENT.find((d) =>
                                subDepartment.includes(String(d)),
                            ) && sub.ID !== currentUser.ID,
                    )
                    .map((sub) => sub.ID);
            }
        }
        return result;
    }, [departments, users, currentUser]);

    const dispatchFn = useCallback(
        (ids: string) =>
            dispatch(
                updateCoworkersStatistics({
                    selectionIds: ids,
                }),
            ),
        [dispatch],
    );

    const queryFn = useCallback(() => getUser(), []);

    const converter = useCallback(
        (data: Tuser[]) => {
            return data
                .filter((d) => d.NAME && d.LAST_NAME)
                .map((u) => ({
                    id: parseInt(u.ID),
                    name: `${u.NAME || ''} ${u.LAST_NAME || ''}`,
                    disabled: !BX.isAdmin() && !subordinates.includes(u.ID),
                }));
        },
        [subordinates],
    ) as (data: object[]) => CorrectDataType[];

    return (
        <div>
            <div className="py-2">
                {isLoading || isUsersLoading ? (
                    <Skeleton sx={{ height: '56px' }} />
                ) : (
                    <SettingsChip
                        queryFn={queryFn}
                        queryKey={['coworkers']}
                        title="Сотрудники"
                        selector="coworkers"
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
                        id="coworkers-money-goal"
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
                        id="coworkers-deals-goal"
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
                        id="coworkers-products-goal"
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
                    <div>
                        <GoalInput
                            className="w-100"
                            label="Цель звонков"
                            id="coworkers-calls-goal"
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
        </div>
    );
});
