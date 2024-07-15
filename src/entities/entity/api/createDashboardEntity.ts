import { BX } from '../../../shared/api';
import { TResponse } from '../../../shared/model/types';
import { TEntity } from '../types';
import { ENTITY, NAME } from '../../../shared/config/consts';

export async function createDashboardEntity(): Promise<TEntity> {
    return new Promise(async (resolve, reject) => {
        const entityResult: TResponse<TEntity> = await BX.callMethod(
            'entity.add',
            {
                ENTITY,
                NAME,
                ACCESS: { AU: 'X' },
            },
        ).catch((e) => {
            reject(e);
            return;
        });

        try {
            const batchResult = await BX.callBatch(
                [
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'PARTICIPANTS_LIST',
                            NAME: 'participants list',
                            TYPE: 'S',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'CATEGORIES_LIST',
                            NAME: 'categories list',
                            TYPE: 'S',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'CATEGORIES_MONEY_GOAL',
                            NAME: 'category money goal',
                            TYPE: 'N',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'CATEGORIES_DEALS_GOAL',
                            NAME: 'category deals goal',
                            TYPE: 'N',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'CATEGORIES_PRODUCTS_GOAL',
                            NAME: 'category products goal',
                            TYPE: 'N',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'COWORKERS_LIST',
                            NAME: 'coworkers list',
                            TYPE: 'S',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'COWORKERS_MONEY_GOAL',
                            NAME: 'coworkers money goal',
                            TYPE: 'N',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'COWORKERS_DEALS_GOAL',
                            NAME: 'coworkers deals goal',
                            TYPE: 'N',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'COWORKERS_PRODUCTS_GOAL',
                            NAME: 'coworkers products goal',
                            TYPE: 'N',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'COWORKERS_CALLS_GOAL',
                            NAME: 'coworkers calls goal',
                            TYPE: 'N',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'DEPARTMENT_LIST',
                            NAME: 'department list',
                            TYPE: 'S',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'DEPARTMENT_MONEY_GOAL',
                            NAME: 'department money goal',
                            TYPE: 'N',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'DEPARTMENT_DEALS_GOAL',
                            NAME: 'department deals goal',
                            TYPE: 'N',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'DEPARTMENT_PRODUCTS_GOAL',
                            NAME: 'department products goal',
                            TYPE: 'N',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'DEPARTMENT_CALLS_GOAL',
                            NAME: 'department calls goal',
                            TYPE: 'N',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'CALLS_DURATION',
                            NAME: 'min duration for calls',
                            TYPE: 'N',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'PERIOD_START_DATE',
                            NAME: 'date start filter',
                            TYPE: 'S',
                        },
                    ],
                    [
                        'entity.item.property.add',
                        {
                            ENTITY,
                            PROPERTY: 'PERIOD_END_DATE',
                            NAME: 'date end filter',
                            TYPE: 'S',
                        },
                    ],
                ],
                true,
            );
        } catch (e: any) {
            reject(new Error('Ошибка при создании хранилища! ' + e.message));
            return;
        }

        entityResult.ok && resolve(entityResult.data);
    });
}
