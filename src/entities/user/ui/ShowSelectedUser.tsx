import React, { FC } from 'react';
import { getUser } from '../api/getUser';
import { useQuery } from '@tanstack/react-query';
import Account from '../../../shared/assets/icons/Account';

import { Skeleton } from '@mui/material';

import type { SelectedUser, Tuser } from '../model/types';

interface ShowSelectedUsersProps {
    user: string;
}

function showPhoto(user: Tuser) {
    return user.PERSONAL_PHOTO ? (
        <img
            className="rounded-circle w-100"
            src={user.PERSONAL_PHOTO}
            alt={user.LAST_NAME}
        />
    ) : (
        <div
            className="w-100 rounded-circle"
            style={{
                aspectRatio: 1 / 1,
                background: 'var(--bs-gray-600)',
            }}
        >
            <Account
                width={'100%'}
                height={'100%'}
                style={{ aspectRatio: 1 / 1 }}
            />
        </div>
    );
}

export const ShowSelectedUser: FC<ShowSelectedUsersProps> = ({ user }) => {
    const {
        data: fetchedUser,
        isPending,
        isError,
    } = useQuery({
        queryFn: () => getUser(parseInt(user)),
        staleTime: 3600000,
        // throwOnError: true,
        queryKey: ['participant', user],
    });

    if (isError)
        return (
            <span style={{ height: '52px' }}>
                Не удалось загрузить пользователя. ID: {user}
            </span>
        );

    return (
        <div className="row align-items-center">
            <div className="col-1">
                {isPending ? (
                    <Skeleton
                        variant="circular"
                        width={'52px'}
                        height={'52px'}
                    />
                ) : (
                    fetchedUser && showPhoto(fetchedUser[0])
                )}
            </div>
            <div className="col">
                {isPending ? (
                    <Skeleton
                        variant="text"
                        sx={{ fontSize: '1rem' }}
                        width={140}
                    />
                ) : (
                    fetchedUser &&
                    `${fetchedUser[0].NAME} ${fetchedUser[0].LAST_NAME}`
                )}
            </div>
        </div>
    );
};
