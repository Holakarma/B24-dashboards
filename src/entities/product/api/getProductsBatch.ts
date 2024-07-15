import { BX, TBatch } from 'shared/api';
import { TResponse } from 'shared/model/types';
import { TProduct } from '../model/types';

export async function getProductsBatch(batch: TBatch[]) {
    try {
        const response: TResponse<TProduct[][]> = await BX.callBatch(batch);
        if (response.ok) return response.data;
    } catch (e) {
        throw new Error('Ошибка при загрзуке товаров');
    }
}
