import { useQuery } from '@tanstack/react-query';
import { getDashboards } from '../../api/getDashboards';

export function useAllDashboards() {
    const response = useQuery({
        queryFn: getDashboards,
        staleTime: 1000 * 60, // 60 сек после запроса брать значение из кеша
        queryKey: ['dashboards'],
        throwOnError: true,
    });

    return response;
}
