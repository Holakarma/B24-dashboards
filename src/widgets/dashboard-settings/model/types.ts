import type { PeriodFormat } from 'shared/ui/date-range';

export type CategoryStatistics = {
    selectionIds: string;
    moneyGoal: string;
    productsGoal: string;
    dealsGoal: string;
};
export type CoworkwersStatistics = {
    selectionIds: string;
    moneyGoal: string;
    productsGoal: string;
    dealsGoal: string;
    callsGoal: string;
};
export type DepartmentStiatisctics = {
    selectionIds: string;
    moneyGoal: string;
    productsGoal: string;
    dealsGoal: string;
    callsGoal: string;
};

export type Statistics = {
    category: CategoryStatistics | undefined;
    coworkers: CoworkwersStatistics | undefined;
    department: DepartmentStiatisctics | undefined;
    callsDuration: string | undefined;
    period: PeriodFormat | undefined;
};
