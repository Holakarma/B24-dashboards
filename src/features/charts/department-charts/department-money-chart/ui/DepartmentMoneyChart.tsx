import React, { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { Divider, ListItem, ListItemText, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getUser } from 'entities/user/api/getUser';
import { getDepartments } from 'entities/department';
import { CoworkersMoneyChart } from 'features/charts/coworkers-charts/coworkers-money-chart';
import { formatNumber } from 'shared/model/formatNumber';

interface DepartmentMoneyChartProps {
    departmentId: number;
    moneySum: number;
    setMoneySum: Dispatch<SetStateAction<number>>;
    getDepartmentMoney: (m: number) => void;
    period?: { dateStart: string; dateEnd: string };
}

export const DepartmentMoneyChart: FC<DepartmentMoneyChartProps> = ({
    departmentId,
    moneySum,
    setMoneySum,
    getDepartmentMoney,
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

    const [departmentMoney, setDepartmentMoney] = React.useState(0);

    useEffect(() => {
        getDepartmentMoney(departmentMoney);
    }, [departmentMoney]);

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
                <CoworkersMoneyChart
                    key={p.ID}
                    moneySum={moneySum}
                    coworkerId={Number(p.ID)}
                    onDealsLoaded={(sum) => {
                        setMoneySum((oldSum) => oldSum + sum);
                        setDepartmentMoney((oldSum) => oldSum + sum);
                    }}
                    cleanupFn={(sum) => {
                        setMoneySum((oldSum) => oldSum - sum);
                        setDepartmentMoney((oldSum) => oldSum - sum);
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
                        {formatNumber(String(departmentMoney),)} руб (
                        {Math.round(
                            departmentMoney && (departmentMoney * 100) / moneySum,
                        )} %)
                    </span>
                </ListItemText>
            )}
        </ListItem>
    );
};
