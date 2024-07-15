import { BX } from 'shared/api';
import { TResponse } from 'shared/model/types';
import { TCategory } from '../model/types';

type CategoryById = { category: TCategory };

export async function getCategoryById(id: number) {
    try {
        const response: TResponse<CategoryById> = await BX.callMethod(
            'crm.category.get',
            {
                id,
                entityTypeId: 2,
            },
        );
        if (response.ok) {
            return response.data;
        }
    } catch (e: any) {
        throw new Error(e.message);
    }
}
