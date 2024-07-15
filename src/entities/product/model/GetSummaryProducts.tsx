import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProductsByDeal } from 'entities/product';
import { TBatch } from 'shared/api';
import { getProductsBatch } from '../api/getProductsBatch';

interface GetSummaryProductsProps {
    enabled?: boolean;
    batch: TBatch[];
    additionalQueryKey: object;
    onProductsLoaded: (count: number) => void;
    cleanupFn?: (count: number) => void;
}

export const GetSummaryProducts: FC<GetSummaryProductsProps> = ({
    enabled,
    batch,
    additionalQueryKey,
    onProductsLoaded,
    cleanupFn,
}) => {
    const { data: products, isSuccess } = useQuery({
        queryKey: ['products', additionalQueryKey],
        queryFn: async () => await getProductsBatch(batch),
        staleTime: Infinity,
        throwOnError: true,
        enabled,
    });

    const productsCount = useMemo(() => {
        if (products) {
            return products.reduce((acc, p) => acc + p.length, 0);
        }
        return 0;
    }, [products]);

    useEffect(() => {
        if (productsCount && isSuccess) {
            onProductsLoaded(productsCount);
        }
        return () => {
            if (productsCount && cleanupFn) {
                cleanupFn(productsCount);
            }
        };
    }, [productsCount]);

    return null;
};
