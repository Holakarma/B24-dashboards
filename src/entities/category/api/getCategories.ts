import { BX } from 'shared/api';

import type { TResponse } from 'shared/model/types';
import { TCategory } from '../model/types';

export function getCategories(): Promise<TCategory[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const response: TResponse<{ categories: TCategory[] }> =
                await BX.callMethod('crm.category.list', { entityTypeId: 2 });
            response.ok && resolve(response.data.categories);
        } catch (e: any) {
            reject(new Error(e.message));
        }
    });
}
