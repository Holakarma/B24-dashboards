import React, { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { ListItem, ListItemText, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getUser } from 'entities/user/api/getUser';
import { getDepartments } from 'entities/department';
import { formatNumber } from 'shared/model/formatNumber';
import { CoworkersProductsChart } from 'features/charts/coworkers-charts/coworkers-products-chart';
import { CoworkersCallsChart } from 'features/charts/coworkers-charts/coworkers-calls-chart';

interface DepartmentCallsChartProps {
    departmentId: number;
    summaryCalls: number;
    setSummaryCalls: Dispatch<SetStateAction<number>>;
    period?: { dateStart: string; dateEnd: string };
    setIncomingCallsSum: React.Dispatch<React.SetStateAction<number>>;
    setOutgoingCallsSum: React.Dispatch<React.SetStateAction<number>>;
}

export const DepartmentCallsChart: FC<DepartmentCallsChartProps> = ({
    departmentId,
    summaryCalls,
    setSummaryCalls,
    setIncomingCallsSum,
    setOutgoingCallsSum,
    period,
}) => {
    const {
        data: users,
        isLoading: isUsersLoading,
        isSuccess: isUserSuccess,
    } = useQuery({
        queryFn: async () => await getUser(),
        queryKey: ['users'],
        staleTime: 1000 * 60 * 2,
        throwOnError: true,
    });

    const {
        data: department,
        isLoading: isDepartmentLoading,
        isSuccess: isDepartmentSuccess,
    } = useQuery({
        queryFn: async () => await getDepartments(Number(departmentId)),
        queryKey: ['departments', departmentId],
        select: (data) => {
            const participants = users?.filter(
                (u) =>
                    u.UF_DEPARTMENT.includes(Number(data[0].ID)) &&
                    u.ID !== data[0].UF_HEAD,
            );
            return { ...data[0], PARTICIPANTS: participants };
        },
        enabled: !!users,
        staleTime: 1000 * 60 * 2,
        throwOnError: true,
    });

    const [departmentIncomingCalls, setDepartmentIncomingCalls] =
        React.useState(0);
    const [departmentOutgoingCalls, setDepartmentOutgoingCalls] =
        React.useState(0);

    if (isDepartmentLoading || isUsersLoading) {
        return (
            <ListItem disablePadding>
                <Skeleton
                    variant="text"
                    sx={{ fontSize: '1.5rem', width: '100%' }}
                />
            </ListItem>
        );
    }

    return (
        <ListItem disablePadding>
            {department?.PARTICIPANTS?.map((p) => (
                <CoworkersCallsChart
                    key={p.ID}
                    coworkerId={Number(p.ID)}
                    onCallsLoaded={({ incomingCalls, outgoingCalls }) => {
                        setSummaryCalls(
                            (oldSum) => oldSum + incomingCalls + outgoingCalls,
                        );
                        setIncomingCallsSum((oldSum) => oldSum + incomingCalls);
                        setDepartmentIncomingCalls(
                            (oldSum) => oldSum + incomingCalls,
                        );
                        setOutgoingCallsSum((oldSum) => oldSum + outgoingCalls);
                        setDepartmentOutgoingCalls(
                            (oldSum) => oldSum + outgoingCalls,
                        );
                    }}
                    callsSum={summaryCalls}
                    cleanupFn={({ incomingCalls, outgoingCalls }) => {
                        setSummaryCalls(
                            (oldSum) => oldSum - incomingCalls - outgoingCalls,
                        );
                        setIncomingCallsSum((oldSum) => oldSum - incomingCalls);
                        setDepartmentIncomingCalls(
                            (oldSum) => oldSum - incomingCalls,
                        );
                        setOutgoingCallsSum((oldSum) => oldSum - outgoingCalls);
                        setDepartmentOutgoingCalls(
                            (oldSum) => oldSum - outgoingCalls,
                        );
                    }}
                    UI={false}
                    period={period}
                />
            ))}
            {department && (
                <ListItemText className="pe-1">
                    <b>{department.NAME}:</b>
                    <br />
                    <span className="opacity-75">
                        {formatNumber(
                            String(
                                departmentIncomingCalls +
                                    departmentOutgoingCalls,
                            ),
                        )}{' '}
                        сек (
                        {departmentOutgoingCalls &&
                            Math.round(
                                (departmentIncomingCalls +
                                    departmentOutgoingCalls * 100) /
                                    summaryCalls,
                            )}{' '}
                        %)
                    </span>
                    <br />
                    Входящие:{' '}
                    <span className="opacity-75">
                        {formatNumber(String(departmentIncomingCalls))} сек (
                        {departmentOutgoingCalls &&
                            Math.round(
                                (departmentIncomingCalls * 100) / summaryCalls,
                            )}{' '}
                        %)
                    </span>
                    <br />
                    Исходящие:{' '}
                    <span className="opacity-75">
                        {formatNumber(String(departmentOutgoingCalls))} сек (
                        {departmentOutgoingCalls &&
                            Math.round(
                                (departmentOutgoingCalls * 100) / summaryCalls,
                            )}{' '}
                        %)
                    </span>
                </ListItemText>
            )}
        </ListItem>
    );
};
