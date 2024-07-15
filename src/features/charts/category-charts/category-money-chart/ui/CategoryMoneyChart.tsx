import { ListItem, ListItemText, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getCategoryById } from 'entities/category/api/getCategoryById';
import { getDeals } from 'entities/deal';
import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { formatNumber } from 'shared/model/formatNumber';

interface MoneyChartProps {
    categoryId: number;
    moneySum: number;
    setMoneySum: Dispatch<SetStateAction<number>>;
    getCategoryMoney: (m: number) => void;
    period?: { dateStart: string; dateEnd: string };
}

export const CategoryMoneyChart: FC<MoneyChartProps> = ({
    categoryId,
    moneySum,
    setMoneySum,
    getCategoryMoney,
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
                CLOSED: 'Y',
                '>CLOSEDATE': period?.dateStart || null,
                '<=CLOSEDATE': period?.dateEnd || null,
            }),
        queryKey: ['deals', { category: categoryId }, period],
        staleTime: Infinity,
        throwOnError: true,
    });

    const categoryMoney = useMemo(() => {
        if (isDealsSuccess) {
            return deals?.reduce(
                (acc, deal) => acc + parseInt(deal.OPPORTUNITY || '0'),
                0,
            );
        }
        return -1;
    }, [deals]);

    useEffect(() => {
        if (isDealsSuccess && categoryMoney) {
            setMoneySum((oldSum) => oldSum + categoryMoney);
            getCategoryMoney(categoryMoney);
        }
        return () => {
            if (isDealsSuccess && categoryMoney) {
                setMoneySum((oldSum) => oldSum - categoryMoney);
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
                    <b>{category.category.name}: </b> <br />
                    <span className="opacity-75">
                        {formatNumber(String(categoryMoney))} руб (
                        {categoryMoney &&
                            Math.round(
                                (categoryMoney * 100) / moneySum,
                            )}{''}
                        %)
                    </span>
                </ListItemText>
            )}
        </ListItem>
    );
};
