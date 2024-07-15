import { BX } from 'shared/api';

import type { TDepartment } from '../model/types';
import type { TResponse } from 'shared/model/types';

export async function getDepartments(ID?: number) {
    const response: TResponse<TDepartment[]> = await BX.getAll(
        'department.get',
        ID && {
            ID,
        },
    );

    if (!response.ok)
        throw new Error(
            `Ошибка ${response.status} при загрузке пользователя: ${response.ex.error_description}`,
        );
    if (response.ok) {
        return response.data;
    } else {
        return [];
    }
}
