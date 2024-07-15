import React, { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { Divider, ListItem, ListItemText, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getCategoryById } from 'entities/category';
import { getDeals } from 'entities/deal';
import { formatNumber } from 'shared/model/formatNumber';
import { GetSummaryProducts } from '../../../../../entities/product/model/GetSummaryProducts';
import { TBatch } from 'shared/api';

interface ProductsChartProps {
    categoryId: number;
    summaryProducts: number;
    setSummaryProducts: Dispatch<SetStateAction<number>>;
    getCategoryProducts: (m: number) => void;
    period?: { dateStart: string; dateEnd: string };
}

export const CategoryProductsChart: FC<ProductsChartProps> = ({
    categoryId,
    summaryProducts,
    setSummaryProducts,
    getCategoryProducts,
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

    const [categoryProducts, setCategoryProducts] = React.useState(0);

    const {
        data: category,
        isLoading: isCategoryLoading,
        isSuccess: isCategorySuccess,
    } = useQuery({
        queryFn: async () => await getCategoryById(categoryId),
        queryKey: ['categories', categoryId],
        staleTime: 60 * 1000,
        throwOnError: true,
    });

    const [batch, setBatch] = React.useState<TBatch[][]>([]);

    useEffect(() => {
        setBatch([]);
        if (isDealsSuccess && isCategorySuccess) {
            let portion: TBatch[] = [];
            deals?.forEach((d, i) => {
                portion.push({
                    method: 'crm.deal.productrows.get',
                    params: { id: d.ID },
                });
                if (portion.length > 49) {
                    const result = batch;
                    result.push(portion);
                    setBatch(result);
                    portion = [];
                }
            });
            setBatch([...batch, portion]);
        }
    }, [deals, category]);

    useEffect(() => {
        getCategoryProducts(categoryProducts);
    }, [categoryProducts])

    if (isCategoryLoading || isDealsLoading) {
        return (
            <ListItem className="pe-1">
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
            {batch?.map((b, i) => (
                <GetSummaryProducts
                    key={i}
                    batch={b}
                    additionalQueryKey={{ category: categoryId, period }}
                    enabled={!!deals}
                    onProductsLoaded={(count) => {
                        setSummaryProducts((oldCount) => oldCount + count);
                        setCategoryProducts((oldCount) => oldCount + count);
                    }}
                    cleanupFn={(count) => {
                        setSummaryProducts((oldCount) => oldCount - count);
                        setCategoryProducts((oldCount) => oldCount - count);
                    }}
                />
            ))}
            {category && (
                <ListItemText className="pe-1">
                    <b>{category.category.name}:</b>
                    <br />
                    <span className="opacity-75">
                        {formatNumber(String(categoryProducts))} товаров (
                        {Math.round(
                            categoryProducts &&
                            (categoryProducts * 100) / summaryProducts,
                        )}{' '}
                        %)
                    </span>
                </ListItemText>
            )}
        </ListItem>
    );
};
