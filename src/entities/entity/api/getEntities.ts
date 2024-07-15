import { BX } from '../../../shared/api';
import type { TEntity } from '../types';
import type { TResponse } from '../../../shared/model/types';

export function getEntities(): Promise<TEntity[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const response: TResponse<TEntity[]> = await BX.callMethod(
                'entity.get',
            );
            response.ok && resolve(response.data);
        } catch (e: any) {
            reject(new Error(e.message));
        }
    });
}
