export type Tuser = {
    ACTIVE: boolean;
    DATE_REGISTER: string;
    EMAIL: string;
    ID: string;
    IS_ONLINE: 'Y' | 'N';
    LAST_ACTIVITY_DATE: object;
    LAST_LOGIN: string;
    LAST_NAME: string;
    NAME: string;
    PERSONAL_BIRTHDAY: string;
    PERSONAL_CITY: string;
    PERSONAL_GENDER: string;
    PERSONAL_MOBILE: string;
    PERSONAL_PHOTO?: string;
    PERSONAL_WWW: string;
    SECOND_NAME: string;
    TIMESTAMP_X: string;
    TIME_ZONE: string;
    TIME_ZONE_OFFSET: string;
    UF_DEPARTMENT: number[];
    UF_EMPLOYMENT_DATE: string;
    WORK_PHONE: string;
    WORK_POSITION: string;
};

export type SelectedUser = {
    id: string;
    name: string;
    photo: string;
    position: string;
    sub: boolean;
    sup: boolean;
    url: string;
};
