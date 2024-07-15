import { Divider, ListItem, ListItemText, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from 'entities/category';
import { getCategoryById } from 'entities/category/api/getCategoryById';
import { getDeals } from 'entities/deal';
import { getUser } from 'entities/user/api/getUser';
import React, { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { formatNumber } from 'shared/model/formatNumber';

interface CoworkersMoneyChartProps {
    coworkerId: number;
    moneySum: number;
    onDealsLoaded: (coworkerMoney: number) => void;
    cleanupFn?: (coworkerMoney: number) => void;
    UI?: boolean;
    period?: { dateStart: string; dateEnd: string };
}

export const CoworkersMoneyChart: FC<CoworkersMoneyChartProps> = (props) => {
    const {
        coworkerId,
        moneySum,
        onDealsLoaded,
        cleanupFn,
        UI = true,
        period,
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

    const coworkerMoney = useMemo(() => {
        if (isDealsSuccess) {
            return deals
                ?.filter((d) => d.STAGE_SEMANTIC_ID === 'S')
                .reduce((acc, deal) => {
                    if (!deal.OPPORTUNITY) return acc;
                    return acc + parseInt(deal.OPPORTUNITY);
                }, 0);
        }
        return 0;
    }, [deals]);

    useEffect(() => {
        if (isDealsSuccess && coworkerMoney) {
            onDealsLoaded(coworkerMoney);
        }
        return () => {
            if (isDealsSuccess && coworkerMoney && cleanupFn) {
                cleanupFn(coworkerMoney);
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

    if (coworkerMoney === undefined) return 'Ошибка при загрузке пользователя';
    return (
        <ListItem disablePadding>
            {user && (
                <ListItemText className="pe-1">
                    <b>
                        {user[0].NAME} {user[0].LAST_NAME}:
                    </b>
                    <br />
                    <span className="opacity-75">
                        {formatNumber(String(coworkerMoney))} руб (
                        {Math.round(
                            coworkerMoney && (coworkerMoney * 100) / moneySum,
                        )}{' '}
                        %)
                    </span>
                </ListItemText>
            )}
        </ListItem>
    );
};
