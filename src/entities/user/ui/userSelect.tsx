import React, { FC } from 'react';
import { BX } from '../../../shared/api';
import type { SelectedUser } from '../model/types';
import type { TResponse } from '../../../shared/model/types';
import { Button } from '@mui/material';

interface UserSelectProps {
    handler: (arrayParticipants: SelectedUser[]) => void;
}

export const UserSelect: FC<UserSelectProps> = ({ handler }) => {
    async function changer() {
        const result: TResponse<SelectedUser[]> = await BX.selectUsers();
        if (result.ok) {
            handler(result.data);
        }
    }

    return (
        <Button
            className=""
            variant="contained"
            color="info"
            onClick={changer}
        >
            Выбрать участников
        </Button>
    );
};
