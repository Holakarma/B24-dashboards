import { BX } from 'shared/api';

import type { Tuser } from '../model/types';
import type { TResponse } from 'shared/model/types';

export async function getUser(ID?: number) {
    const response: TResponse<Tuser[]> = await BX.getAll(
        'user.get',
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
