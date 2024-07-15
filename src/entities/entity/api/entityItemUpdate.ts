import { TDashboard, TPropertyValues } from 'entities/dashboard-item';
import { BX } from '../../../shared/api';
import { ENTITY } from '../../../shared/config/consts';
import { TResponse } from 'shared/model/types';

type TPartialDashboard = Omit<Partial<TDashboard>, 'PROPERTY_VALUES'> & {
    PROPERTY_VALUES?: Partial<TPropertyValues>;
};

export async function entityItemUpdate(
    dashboardParams: TPartialDashboard,
    ID: number,
) {
    try {
        const response: TResponse<boolean> = await BX.callMethod(
            'entity.item.update',
            {
                ENTITY,
                ID,
                ...dashboardParams,
                PROPERTY_VALUES: {
                    CALLS_DURATION:
                        dashboardParams?.PROPERTY_VALUES?.CALLS_DURATION || 5,
                },
            },
        );
        if (response.ok) {
            return response.data;
        }
    } catch (e: any) {
        throw Error(e);
    }
}
