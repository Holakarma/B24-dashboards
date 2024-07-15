import { getEntities } from './getEntities';
import { TEntity } from '../types';

export async function findDashboardEntity(
    entityName: string,
): Promise<TEntity | null> {
    const entities = await getEntities().catch((e: any) => {
        throw new Error(e.message);
    });

    const entity = entities.find((e) => e.ENTITY === entityName);

    if (!entity) return null;

    return entity;
}
