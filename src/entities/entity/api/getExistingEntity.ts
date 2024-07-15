import { findDashboardEntity } from './findDashboardsEntity';
import { TEntity } from '../types';
import { ENTITY } from '../../../shared/config/consts';
import { createDashboardEntity } from './createDashboardEntity';
import { BX } from 'shared/api';

export async function getExistingEntity(): Promise<TEntity> {
    try {
        const entity = await findDashboardEntity(ENTITY);
        if (entity) return entity;
    } catch (e: any) {
        throw new Error(e.message);
    }

    try {
        const createdEntity = await createDashboardEntity();
        return createdEntity;
    } catch (e: any) {
        throw new Error(e.message);
    }
}
