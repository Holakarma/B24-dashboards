import { BX } from 'shared/api';
import { TResponse, TypeWithLogic } from 'shared/model/types';

export type TCall = {
    CALL_CATEGORY: string;
    CALL_DURATION: string;
    CALL_FAILED_CODE: string;
    CALL_FAILED_REASON: string;
    CALL_ID: string;
    CALL_RECORD_URL: string;
    CALL_START_DATE: string | null;
    CALL_TYPE: string;
    CALL_VOTE: null | string;
    COMMENT: null | string;
    COST: string;
    COST_CURRENCY: string;
    CRM_ACTIVITY_ID: string;
    CRM_ENTITY_ID: string;
    CRM_ENTITY_TYPE: string;
    EXTERNAL_CALL_ID: null | string;
    ID: string;
    PHONE_NUMBER: string;
    PORTAL_NUMBER: string;
    PORTAL_USER_ID: string | number;
    RECORD_DURATION: null | string;
    RECORD_FILE_ID: null | string;
    REDIAL_ATTEMPT: null | string;
    REST_APP_ID: null | string;
    REST_APP_NAME: null | string;
    SESSION_ID: string;
    TRANSCRIPT_ID: null | string;
    TRANSCRIPT_PENDING: string;
};

export async function getCalls(filterParams?: Partial<TypeWithLogic<TCall>>) {
    try {
        const response: TResponse<TCall[]> = await BX.getAll(
            'voximplant.statistic.get',
            {
                FILTER: filterParams,
            },
        );
        if (response.ok) {
            return response.data;
        }
    } catch (e: any) {
        throw new Error(e.message);
    }
}
