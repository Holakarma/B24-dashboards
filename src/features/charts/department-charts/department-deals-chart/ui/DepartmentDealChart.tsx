import { ListItem, ListItemText, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getDepartments } from 'entities/department';
import { getUser } from 'entities/user/api/getUser';
import { CoworkersDealCharts } from 'features/charts/coworkers-charts/coworkers-deals-chart';
import React, { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { formatNumber } from 'shared/model/formatNumber';

interface DepartmentDealChartsProps {
    departmentId: number;
    summaryDealsRaw: number;
    setSummaryDealsRaw: Dispatch<SetStateAction<number>>;
    getDepartmentDeals: (m: number) => void;
    period?: { dateStart: string; dateEnd: string };
}

export const DepartmentDealCharts: FC<DepartmentDealChartsProps> = ({
    departmentId,
    summaryDealsRaw,
    setSummaryDealsRaw,
    getDepartmentDeals,
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

    const [departmentDeals, setDepartmentDeals] = React.useState(0);

    useEffect(() => {
        getDepartmentDeals(departmentDeals);
    }, [departmentDeals]);

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
                <CoworkersDealCharts
                    key={p.ID}
                    summaryDealsRaw={summaryDealsRaw}
                    coworkerId={Number(p.ID)}
                    onDealsLoaded={(count) => {
                        setSummaryDealsRaw((oldCount) => oldCount + count);
                        setDepartmentDeals((oldCount) => oldCount + count);
                    }}
                    cleanupFn={(count) => {
                        setSummaryDealsRaw((oldCount) => oldCount - count);
                        setDepartmentDeals((oldCount) => oldCount - count);
                    }}
                    UI={false}
                    period={period}
                />
            ))}
            {department && (
                <ListItemText className="pe-1">
                    <b>{department.NAME}:</b>
                    <br />
                    <span className='opacity-75'>
                        {formatNumber(String(departmentDeals),)} сделок (
                        {Math.round(
                            departmentDeals &&
                            (departmentDeals * 100) / summaryDealsRaw,
                        )} %)
                    </span>
                </ListItemText>
            )}
        </ListItem>
    );
};
