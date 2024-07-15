import { ListItem, ListItemText, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getDeals } from 'entities/deal';
import { getUser } from 'entities/user/api/getUser';
import React, { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { formatNumber } from 'shared/model/formatNumber';

interface CoworkersDealChartsProps {
    coworkerId: number;
    summaryDealsRaw: number;
    onDealsLoaded: (deals: number) => void;
    cleanupFn?: (deals: number) => void;
    UI?: boolean;
    period?: { dateStart: string; dateEnd: string };
}

export const CoworkersDealCharts: FC<CoworkersDealChartsProps> = (props) => {
    const {
        coworkerId,
        summaryDealsRaw,
        onDealsLoaded,
        cleanupFn,
        period,
        UI = true,
    } = props;

    const {
        data: deals,
        isLoading: isDealsLoading,
        isSuccess: isDealsSuccess,
    } = useQuery({
        queryFn: async () =>
            await getDeals({
                ASSIGNED_BY_ID: String(coworkerId),
                CLOSED: 'Y',
                '>CLOSEDATE': period?.dateStart || null,
                '<=CLOSEDATE': period?.dateEnd || null,
            }),
        queryKey: ['deals', { coworker: coworkerId }, period],
        staleTime: Infinity,
        throwOnError: true,
    });

    const coworkerDeals = useMemo(() => {
        if (isDealsSuccess) {
            return deals?.length;
        }
        return -1;
    }, [deals]);

    const winnerDeals = useMemo(() => {
        if (isDealsSuccess) {
            return deals?.filter((d) => d.STAGE_SEMANTIC_ID === 'S')?.length;
        }
        return -1;
    }, [deals]);

    useEffect(() => {
        if (isDealsSuccess && coworkerDeals) {
            onDealsLoaded(coworkerDeals);
        }
        return () => {
            if (isDealsSuccess && coworkerDeals && cleanupFn) {
                cleanupFn(coworkerDeals);
            }
        };
    }, [deals]);

    const { data: user, isLoading: isCategoryLoading } = useQuery({
        queryFn: async () => await getUser(coworkerId),
        queryKey: ['coworker', coworkerId],
        staleTime: 60 * 1000,
        throwOnError: true,
    });

    if (!UI) return null;

    if (isCategoryLoading || isDealsLoading) {
        return (
            <ListItem disablePadding>
                <Skeleton
                    variant="text"
                    sx={{ fontSize: '1.5rem', width: '100%' }}
                />
            </ListItem>
        );
    }

    if (winnerDeals === undefined || coworkerDeals === undefined)
        return <p>Ошибка загрузки сделок</p>;

    return (
        <ListItem disablePadding>
            {user && (
                <ListItemText className="pe-1">
                    <b> {user[0].NAME} {user[0].LAST_NAME}: </b> <br />
                    <span className='opacity-75'>
                        всего {formatNumber(String(coworkerDeals))} сделок ({Math.round(
                            coworkerDeals && (coworkerDeals * 100) / summaryDealsRaw,
                        )} %)
                        <br />
                        {coworkerDeals ?
                            ` успешно закрыто ${Math.round(
                                (winnerDeals * 100) / coworkerDeals,
                            )} %`
                            : ''
                        }
                    </span>
                </ListItemText>
            )}
        </ListItem>
    );
};
