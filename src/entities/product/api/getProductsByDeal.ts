import { BX } from 'shared/api';
import { TResponse } from 'shared/model/types';
import { TProduct } from '../model/types';

export async function getProductsByDeal(dealId: number) {
    try {
        const response: TResponse<TProduct[]> = await BX.callMethod(
            'crm.deal.productrows.get',
            {
                id: dealId,
            },
        );
        if (response.ok) return response.data;
    } catch (e) {
        throw new Error('Ошибка при загрзуке товаров');
    }
}
