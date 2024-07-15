export type TDepartment = {
    ID: string;
    NAME: string;
    PARENT?: string;
    SORT: number;
    UF_HEAD: string;
};

export type DepartmentSchema = TDepartment & {
    USERS: string[];
};
