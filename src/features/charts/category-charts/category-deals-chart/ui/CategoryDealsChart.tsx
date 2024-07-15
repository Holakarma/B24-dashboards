import { ListItem, ListItemText, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getCategoryById } from 'entities/category/api/getCategoryById';
import { getDeals } from 'entities/deal';
import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { formatNumber } from 'shared/model/formatNumber';

interface DealsChartProps {
    categoryId: number;
    summaryDeals: number;
    setSummaryDeals: Dispatch<SetStateAction<number>>;
    getCategoryDeals: (m: number) => void;
    period?: { dateStart: string; dateEnd: string };
}

export const CategoryDealsChart: FC<DealsChartProps> = ({
    categoryId,
    summaryDeals,
    setSummaryDeals: setMoneySum,
    getCategoryDeals,
    period,
}) => {
    const {
        data: deals,
        isLoading: isDealsLoading,
        isSuccess: isDealsSuccess,
    } = useQuery({
        queryFn: async () =>
            await getDeals({
                CATEGORY_ID: String(categoryId),
                STAGE_SEMANTIC_ID: 'S',
                '>CLOSEDATE': period?.dateStart || null,
                '<=CLOSEDATE': period?.dateEnd || null,
            }),
        queryKey: ['deals', { category: categoryId }, period],
        staleTime: Infinity,
        throwOnError: true,
    });

    const categoryDeals = useMemo(() => {
        if (isDealsSuccess) {
            return deals?.length;
        }
        return -1;
    }, [deals]);

    useEffect(() => {
        if (isDealsSuccess && categoryDeals) {
            setMoneySum((oldSum) => oldSum + categoryDeals);
            getCategoryDeals(categoryDeals);
        }
        return () => {
            if (isDealsSuccess && categoryDeals) {
                setMoneySum((oldSum) => oldSum - categoryDeals);
            }
        };
    }, [deals]);

    const { data: category, isLoading: isCategoryLoading } = useQuery({
        queryFn: async () => await getCategoryById(categoryId),
        queryKey: ['categories', categoryId],
        staleTime: 60 * 1000,
        throwOnError: true,
    });

    if (isCategoryLoading || isDealsLoading) {
        return (
            <ListItem>
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
            {category && (
                <ListItemText className="pe-1">
                    <b>{category.category.name}:</b>
                    <br />
                    <span className="opacity-75">
                        {formatNumber(String(categoryDeals))} сделок (
                        {categoryDeals &&
                            Math.round(
                                (categoryDeals * 100) / summaryDeals,
                            )}{' '}
                        %)
                    </span>
                </ListItemText>
            )}
        </ListItem>
    );
};
