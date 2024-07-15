import { BX } from '../../../shared/api';
import type { TResponseWithoutTime } from '../../../shared/model/types';
import type { Tuser } from '../model/types';

export async function getCurrentUser(): Promise<Tuser> {
    const response: TResponseWithoutTime<Tuser> = await BX.callMethod(
        'user.current',
    );

    if (!response.ok)
        throw new Error(
            `user not found: ${response.status}, ${response.ex.error_description}`,
        );

    return response.data;
}
