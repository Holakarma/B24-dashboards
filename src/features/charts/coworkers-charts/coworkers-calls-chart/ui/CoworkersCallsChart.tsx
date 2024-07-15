import { Divider, ListItem, ListItemText, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getCalls } from 'entities/calls';
import { getCategories } from 'entities/category';
import { getCategoryById } from 'entities/category/api/getCategoryById';
import { getDeals } from 'entities/deal';
import { getUser } from 'entities/user/api/getUser';
import React, { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { useAppSelector } from 'shared/lib/store';
import { formatNumber } from 'shared/model/formatNumber';

interface CoworkersCallsChartProps {
    coworkerId: number;
    callsSum: number;
    onCallsLoaded: ({
        incomingCalls,
        outgoingCalls,
    }: {
        incomingCalls: number;
        outgoingCalls: number;
    }) => void;
    cleanupFn?: ({
        incomingCalls,
        outgoingCalls,
    }: {
        incomingCalls: number;
        outgoingCalls: number;
    }) => void;
    UI?: boolean;
    period?: { dateStart: string; dateEnd: string };
}

export const CoworkersCallsChart: FC<CoworkersCallsChartProps> = (props) => {
    const {
        coworkerId,
        callsSum,
        onCallsLoaded,
        cleanupFn,
        UI = true,
        period,
    } = props;

    const duration = useAppSelector(
        (state) =>
            state.openedDashboard.dashboard?.PROPERTY_VALUES.CALLS_DURATION,
    );

    const {
        data: calls,
        isLoading: isCallsLoading,
        isSuccess: isCallsSuccess,
    } = useQuery({
        queryFn: async () =>
            await getCalls({
                PORTAL_USER_ID: coworkerId,
                CALL_FAILED_CODE: '200',
                '>CALL_DURATION': duration,
                '>CALL_START_DATE': period?.dateStart || null,
                '<=CALL_START_DATE': period?.dateEnd || null,
            }),
        queryKey: ['calls', { coworker: coworkerId }, period, duration],
        staleTime: Infinity,
        throwOnError: true,
    });

    const incomingCalls = useMemo(() => {
        if (isCallsSuccess) {
            return calls
                ?.filter((d) => d.CALL_TYPE === '2')
                .reduce((acc, call) => {
                    if (!call.CALL_DURATION) return acc;
                    return acc + parseInt(call.CALL_DURATION);
                }, 0);
        }
        return -1;
    }, [calls]);

    const outgoingCalls = useMemo(() => {
        if (isCallsSuccess) {
            return calls
                ?.filter((d) => d.CALL_TYPE === '1')
                .reduce((acc, call) => {
                    if (!call.CALL_DURATION) return acc;
                    return acc + parseInt(call.CALL_DURATION);
                }, 0);
        }
        return -1;
    }, [calls]);

    useEffect(() => {
        if (isCallsSuccess && incomingCalls && outgoingCalls) {
            onCallsLoaded({ incomingCalls, outgoingCalls });
        }
        return () => {
            if (isCallsSuccess && incomingCalls && outgoingCalls && cleanupFn) {
                cleanupFn({ incomingCalls, outgoingCalls });
            }
        };
    }, [calls]);

    const { data: user, isLoading: isuserLoading } = useQuery({
        queryFn: async () => await getUser(coworkerId),
        queryKey: ['coworkers', coworkerId],
        staleTime: 60 * 1000,
        throwOnError: true,
    });

    if (!UI) return null;

    if (isuserLoading || isCallsLoading) {
        return (
            <ListItem disablePadding>
                <Skeleton
                    variant="text"
                    sx={{ fontSize: '1.5rem', width: '100%' }}
                />
            </ListItem>
        );
    }

    if (incomingCalls === undefined || outgoingCalls === undefined)
        return 'Ошибка при загрузке пользователя';

    return (
        <ListItem disablePadding>
            {user && (
                <ListItemText className="pe-1">
                    <b>
                        {user[0].NAME} {user[0].LAST_NAME}:
                    </b>
                    <br />
                    <span className="opacity-75">
                        {formatNumber(String(incomingCalls + outgoingCalls))}{' '}
                        сек (
                        {callsSum &&
                            Math.round(
                                (incomingCalls + outgoingCalls * 100) /
                                    callsSum,
                            )}{' '}
                        %)
                    </span>
                    <br />
                    Входящие:{' '}
                    <span className="opacity-75">
                        {formatNumber(String(incomingCalls))} сек (
                        {callsSum &&
                            Math.round((incomingCalls * 100) / callsSum)}{' '}
                        %)
                    </span>
                    <br />
                    Исходящие:{' '}
                    <span className="opacity-75">
                        {formatNumber(String(outgoingCalls))} сек (
                        {callsSum &&
                            Math.round((outgoingCalls * 100) / callsSum)}{' '}
                        %)
                    </span>
                </ListItemText>
            )}
        </ListItem>
    );
};
