import { BX } from '../../../shared/api';
import { ENTITY } from '../../../shared/config/consts';

type Response = {
    data: boolean;
    ok: boolean;
};

export async function entityItemDelete(ID: number) {
    try {
        const response: Response = await BX.callMethod('entity.item.delete', {
            ENTITY: ENTITY,
            ID,
        });
        return response;
    } catch (e: any) {
        throw Error(e.message);
    }
}
