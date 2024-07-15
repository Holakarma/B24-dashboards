import { HTMLAttributes } from 'react';

export type TResponse<T> = success<T> | error;

export type TResponseWithoutTime<T> = TResponse<T> & { ok: boolean; data: T };

type success<T> = {
    ok: true;
    data: T;
    time: {
        date_finish: string;
        date_start: string;
        duration: number;
        finish: number;
        processing: number;
        start: number;
    };
};

export type error = {
    ok: false;
    status: number;
    ex: {
        error: string;
        error_description: string;
    };
};

export interface IconProps extends HTMLAttributes<HTMLOrSVGElement> {
    height?: string;
    width?: string;
    fill?: string;
}

export type TypeWithLogic<T extends object> = T & {
    [K in keyof T & string as `>${K}`]: T[K];
} & {
    [K in keyof T & string as `<${K}`]: T[K];
} & {
    [K in keyof T & string as `=${K}`]: T[K];
} & {
    [K in keyof T & string as `>=${K}`]: T[K];
} & {
    [K in keyof T & string as `<=${K}`]: T[K];
};
