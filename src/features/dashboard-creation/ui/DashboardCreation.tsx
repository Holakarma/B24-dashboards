import React, { FC, useEffect } from 'react';
import { changeDashboardItem } from '../../../entities/dashboard-item/model/dashboardItemSlice';
import { useAppDispatch, useAppSelector } from '../../../shared/lib/store';
import {
    ShowSelectedUser,
    UserSelect,
    convertToSelectedUSer,
} from '../../../entities/user';
import DashboardCreationBtn from './DashboardCreationBtn';
import { getCurrentUser } from '../../../entities/user';

import QuestionMarkCircle from '../../../shared/assets/icons/QuestionMarkCircle';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { TextField } from '@mui/material';

import { useQuery } from '@tanstack/react-query';

import type { SelectedUser } from '../../../entities/user';
import type { ChangeEvent } from 'react';

import cls from './DashboardCreation.module.css';

const DashboardCreation: FC = () => {
    const { data: currentUser, isSuccess } = useQuery({
        queryFn: () => getCurrentUser(),
        staleTime: Infinity,
        throwOnError: true,
        queryKey: ['currentUser'],
    });

    const dashboardItem = useAppSelector((state) => state.dashboardItem);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isSuccess && !dashboardItem.participantList) {
            dispatch(
                changeDashboardItem({
                    ...dashboardItem,
                    participantList: currentUser.ID,
                }),
            );
        }
    }, [isSuccess]);

    function nameHandler(e: ChangeEvent<HTMLInputElement>) {
        setError('');
        dispatch(
            changeDashboardItem({ ...dashboardItem, name: e.target.value }),
        );
    }

    function participantsChanger(arrayParticipants: SelectedUser[]) {
        if (isSuccess) {
            arrayParticipants = arrayParticipants.filter(
                (u) => u.id !== currentUser.ID,
            );
            arrayParticipants.unshift(convertToSelectedUSer(currentUser));

            dispatch(
                changeDashboardItem({
                    ...dashboardItem,
                    participantList: arrayParticipants
                        .map((r: SelectedUser) => r.id)
                        .join(','),
                }),
            );
        }
    }

    const [isDitry, setDirty] = React.useState(false);
    const [error, setError] = React.useState('');

    return (
        <div className="position-relative h-100">
            <div className="form-floating mb-3">
                <TextField
                    className="w-100"
                    required
                    error={(isDitry && !dashboardItem.name) || !!error}
                    onBlur={() => setDirty(true)}
                    id="outlined-error-helper-text"
                    label="Название"
                    helperText={
                        error ||
                        (!dashboardItem.name && `Название не может быть пустым`)
                    }
                    onChange={nameHandler}
                    value={dashboardItem.name}
                    variant="standard"
                />
            </div>
            <div className="mb-2">
                <UserSelect handler={participantsChanger} />
                <OverlayTrigger
                    delay={200}
                    placement={'right'}
                    overlay={
                        <Tooltip id={`tooltip-participants`}>
                            Те, кто сможет увидеть дашборд.
                        </Tooltip>
                    }
                >
                    <span>
                        <QuestionMarkCircle className="opacity-75 ms-2" />
                    </span>
                </OverlayTrigger>
            </div>

            {dashboardItem.participantList.length ? (
                <ul
                    className={`list-group my-3 ${cls.ParticipantsList} border`}
                >
                    {dashboardItem.participantList.split(',').map((user) => (
                        <li
                            key={user}
                            className="list-group-item mw-100 border-end-0 border-start-0"
                        >
                            <ShowSelectedUser user={user} />
                        </li>
                    ))}
                </ul>
            ) : null}

            <div className="position-absolute bottom-0 w-100">
                <DashboardCreationBtn
                    className="w-100"
                    dashboardItem={dashboardItem}
                    setError={setError}
                />
            </div>
        </div>
    );
};

export default DashboardCreation;
