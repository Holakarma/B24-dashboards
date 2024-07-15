import React, { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { Divider, ListItem, ListItemText, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getCategoryById } from 'entities/category';
import { getDeals } from 'entities/deal';
import { formatNumber } from 'shared/model/formatNumber';
import { GetSummaryProducts } from 'entities/product/model/GetSummaryProducts';
import { getUser } from 'entities/user';
import { TBatch } from 'shared/api';

interface CoworkersChartProps {
    coworkerId: number;
    summaryProducts: number;
    onDealsLoaded: (count: number) => void;
    cleanupFn?: (count: number) => void;
    UI?: boolean;
    period?: { dateStart: string; dateEnd: string };
}

export const CoworkersProductsChart: FC<CoworkersChartProps> = (props) => {
    const {
        coworkerId,
        summaryProducts,
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
                STAGE_SEMANTIC_ID: 'S',
                CLOSED: 'Y',
                '>CLOSEDATE': period?.dateStart || null,
                '<=CLOSEDATE': period?.dateEnd || null,
            }),
        queryKey: ['deals', { coworker: coworkerId }, period],
        staleTime: Infinity,
        throwOnError: true,
    });

    const [coworkerProducts, setCoworkerProducts] = React.useState(0);

    const {
        data: user,
        isLoading: isUserLoading,
        isSuccess: isUserSuccess,
    } = useQuery({
        queryFn: async () => await getUser(coworkerId),
        queryKey: ['coworker', coworkerId],
        staleTime: 60 * 1000,
        throwOnError: true,
    });

    const [batch, setBatch] = React.useState<TBatch[][]>([]);

    useEffect(() => {
        setBatch([]);
        if (isDealsSuccess && isUserSuccess) {
            let portion: TBatch[] = [];
            deals?.forEach((d) => {
                portion.push({
                    method: 'crm.deal.productrows.get',
                    params: { id: d.ID },
                });
                if (portion.length > 49) {
                    setBatch([...batch, portion]);
                    portion = [];
                }
            });
            setBatch([...batch, portion]);
        }
    }, [deals, user]);

    if (!UI)
        return batch?.map((b, id) => (
            <GetSummaryProducts
                key={id}
                additionalQueryKey={{ coworker: coworkerId, period }}
                batch={b}
                enabled={!!deals}
                onProductsLoaded={(count) => {
                    setCoworkerProducts((oldCount) => oldCount + count);
                    onDealsLoaded(count);
                }}
                cleanupFn={(count) => {
                    setCoworkerProducts((oldCount) => oldCount - count);
                    cleanupFn && cleanupFn(count);
                }}
            />
        ));

    if (isUserLoading || isDealsLoading) {
        return (
            <ListItem disablePadding>
                <Skeleton
                    className="pe-1"
                    variant="text"
                    sx={{ fontSize: '1rem', width: '100%' }}
                />
            </ListItem>
        );
    }

    return (
        <ListItem disablePadding>
            {batch?.map((b, id) => (
                <GetSummaryProducts
                    key={id}
                    additionalQueryKey={{ coworker: coworkerId, period }}
                    batch={b}
                    enabled={!!deals}
                    onProductsLoaded={(count) => {
                        setCoworkerProducts((oldCount) => oldCount + count);
                        onDealsLoaded(count);
                    }}
                    cleanupFn={(count) => {
                        setCoworkerProducts((oldCount) => oldCount - count);
                        cleanupFn && cleanupFn(count);
                    }}
                />
            ))}
            {user && (
                <ListItemText className="pe-1">
                    <b>
                        {user[0].NAME} {user[0].LAST_NAME}:{' '}
                    </b>
                    <br />
                    <span className="opacity-75">
                        {formatNumber(String(coworkerProducts))} товаров (
                        {Math.round(
                            coworkerProducts &&
                                (coworkerProducts * 100) / summaryProducts,
                        )}{' '}
                        %)
                    </span>
                </ListItemText>
            )}
        </ListItem>
    );
};
