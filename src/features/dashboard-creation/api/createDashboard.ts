import { getExistingEntity } from '../../../entities/entity/api/getExistingEntity';
import { BX } from '../../../shared/api';

import type { dashboardItemSlice } from '../../../entities/dashboard-item/model/dashboardItemSlice';
import { ENTITY } from '../../../shared/config/consts';

export async function createDashboard(dashboard: dashboardItemSlice) {
    try {
        const entity = await getExistingEntity();
        const response = await BX.callMethod('entity.item.add', {
            ENTITY,
            NAME: dashboard.name,
            PROPERTY_VALUES: {
                PARTICIPANTS_LIST: dashboard.participantList,
                CALLS_DURATION: 5,
            },
        });
    } catch (e: any) {
        throw Error(e.message);
    }
}
