import { BX } from '../../../shared/api';
import { getExistingEntity } from './getExistingEntity';
import { ENTITY } from '../../../shared/config/consts';

import type { TDashboard } from '../../dashboard-item/types';
import type { TResponse } from '../../../shared/model/types';

export async function getDashboards(): Promise<TDashboard[]> {
    const dashboardEntity = await getExistingEntity().catch((e) => {
        throw new Error(e.message);
    });

    if (dashboardEntity) {
        const dashboards: TResponse<TDashboard[]> = await BX.callMethod(
            'entity.item.get',
            {
                ENTITY,
            },
        ).catch((e) => {
            throw new Error(e.message);
        });
        if (dashboards.ok) {
            return dashboards.data;
        }
    }
    return [];
}
