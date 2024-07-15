import { Avatar } from '@mui/material';
import React, { FC, useEffect } from 'react';
import { getUser } from '../api/getUser';
import { useQuery } from '@tanstack/react-query';
import { Tooltip, Zoom } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import { BX } from 'shared/api';

interface UserAvatarProps {
    user: string;
}

export const UserAvatar: FC<UserAvatarProps> = ({ user, ...otherProps }) => {
    const {
        data: fetchedUser,
        isLoading,
        isError,
    } = useQuery({
        queryFn: () => getUser(parseInt(user)),
        staleTime: Infinity,
        throwOnError: true,
        queryKey: ['users', user],
    });

    useEffect(() => {
        BX.fitWindow();
    }, [isLoading]);

    if (!fetchedUser) return null;
    return (
        <Tooltip
            title={`${fetchedUser[0].NAME} ${fetchedUser[0].LAST_NAME}`}
            disableInteractive
            arrow
            TransitionComponent={Zoom}
            slotProps={{
                popper: {
                    sx: {
                        [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                            {
                                marginTop: '5px',
                            },
                    },
                },
            }}
        >
            <Avatar
                alt={fetchedUser[0].LAST_NAME}
                src={fetchedUser[0].PERSONAL_PHOTO}
                sx={{ color: 'white' }}
                {...otherProps}
            />
        </Tooltip>
    );
};
