import { BX } from 'shared/api';
import { TResponse, TypeWithLogic } from 'shared/model/types';
import { TDeal } from '../model/types';

export async function getDeals(filterParams: Partial<TypeWithLogic<TDeal>>) {
    try {
        const response: TResponse<TDeal[]> = await BX.getAll('crm.deal.list', {
            filter: filterParams,
        });
        if (response.ok) return response.data;
    } catch (e: any) {
        throw new Error(e.message);
    }
}
