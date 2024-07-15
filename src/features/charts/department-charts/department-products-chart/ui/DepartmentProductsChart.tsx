import React, { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { ListItem, ListItemText, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getUser } from 'entities/user/api/getUser';
import { getDepartments } from 'entities/department';
import { formatNumber } from 'shared/model/formatNumber';
import { CoworkersProductsChart } from 'features/charts/coworkers-charts/coworkers-products-chart';

interface DepartmentProductsChartProps {
    departmentId: number;
    summaryProducts: number;
    setSummaryProducts: Dispatch<SetStateAction<number>>;
    getDepartmentProducts: (m: number) => void;
    period?: { dateStart: string; dateEnd: string };
}

export const DepartmentProductsChart: FC<DepartmentProductsChartProps> = ({
    departmentId,
    summaryProducts,
    setSummaryProducts,
    getDepartmentProducts,
    period,
}) => {
    const {
        data: users,
        isLoading: isUsersLoading,
        isSuccess: isUserSuccess,
    } = useQuery({
        queryFn: async () => await getUser(),
        queryKey: ['users'],
        staleTime: 1000 * 60 * 5,
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
        staleTime: 1000 * 60 * 5,
        throwOnError: true,
    });

    const [departmentProducts, setDepartmentProducts] = React.useState(0);

    useEffect(() => {
        getDepartmentProducts(departmentProducts);
    }, [departmentProducts]);

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
                <CoworkersProductsChart
                    key={p.ID}
                    summaryProducts={summaryProducts}
                    coworkerId={Number(p.ID)}
                    onDealsLoaded={(count) => {
                        setSummaryProducts((oldSum) => oldSum + count);
                        setDepartmentProducts((oldSum) => oldSum + count);
                    }}
                    cleanupFn={(count) => {
                        setSummaryProducts((oldSum) => oldSum - count);
                        setDepartmentProducts((oldSum) => oldSum - count);
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
                        {formatNumber(String(departmentProducts),)} товаров (
                        {Math.round(
                            departmentProducts &&
                            (departmentProducts * 100) / summaryProducts,
                        )} %)
                    </span>
                </ListItemText>
            )}
        </ListItem>
    );
};
