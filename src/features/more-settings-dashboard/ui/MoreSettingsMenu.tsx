import React, { FC, HTMLAttributes } from 'react';
import { entityItemDelete } from 'entities/entity';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAppDispatch } from 'shared/lib/store';

import { setOpenedDashboard } from 'entities/dashboard-item/model/openedDashboardSlice';
import { entityItemUpdate } from 'entities/entity/api/entityItemUpdate';
import type { TDashboard } from 'entities/dashboard-item';
import { DeleteDashboardModal } from './DeleteDashboardModal';
import cls from './moreSettingsMenu.module.css';

import {
    Button,
    IconButton,
    Box,
    Menu,
    Card,
    CardContent,
    CardActions,
    TextField,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { GoalInput } from 'shared/ui/goalInput';

interface MoreSettingsMenuProps extends HTMLAttributes<HTMLButtonElement> {
    dashboard: TDashboard;
}

export const MoreSettingsMenu: FC<MoreSettingsMenuProps> = ({ dashboard }) => {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    //якорь для всплывающего меню
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        if (!update.isPending) setAnchorEl(null);
    };

    const [nameDashboard, setNameDashboard] = React.useState('');
    const [callDuration, setCallDuration] = React.useState('');
    const [showModal, setShowModal] = React.useState(false);

    //обновление названия дашборда и обновление отображений на заднем плане
    const update = useMutation({
        mutationFn: async ({
            dashboard,
            nameDashboard,
            callDuration,
        }: {
            dashboard: TDashboard;
            nameDashboard?: string;
            callDuration?: string;
        }) => {
            nameDashboard &&
                (await entityItemUpdate(
                    { NAME: nameDashboard },
                    parseInt(dashboard.ID),
                ));
            callDuration &&
                (await entityItemUpdate(
                    {
                        PROPERTY_VALUES: {
                            CALLS_DURATION: callDuration,
                        },
                    },
                    parseInt(dashboard.ID),
                ));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['dashboards'],
            });
            const dashboardUpdated = { ...dashboard, NAME: nameDashboard };
            dispatch(setOpenedDashboard({ dashboard: dashboardUpdated }));
        },
        throwOnError: true,
    });

    return (
        <>
            <IconButton
                className={'position-relative'}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            marginLeft: '-27px',
                            minWidth: '400px',
                        },
                    },
                }}
                className={`${cls.menuP}`}
            >
                <Card
                    variant="outlined"
                    style={{ border: 'none' }}
                >
                    <CardContent
                        style={{ paddingBottom: '14px', paddingTop: '24px' }}
                    >
                        <Box
                            className={`${cls.inputP} mt-3 d-flex align-items-center gap-3`}
                        >
                            <TextField
                                className="w-100"
                                label="Изменить название"
                                defaultValue={dashboard.NAME}
                                onChange={(e) =>
                                    setNameDashboard(e.target.value)
                                }
                            />
                            {nameDashboard &&
                                nameDashboard !== dashboard.NAME && (
                                    <IconButton
                                        onClick={() => {
                                            update.mutate({
                                                dashboard,
                                                nameDashboard,
                                            });
                                        }}
                                        disabled={update.isPending}
                                        className={`p-0 ${
                                            update.isPending
                                                ? 'opacity-50'
                                                : undefined
                                        }`}
                                    >
                                        <CheckBoxIcon
                                            style={{
                                                fill: '#03b703',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </IconButton>
                                )}
                        </Box>
                        <Box
                            className={`${cls.inputP} mt-3 d-flex align-items-center gap-3`}
                        >
                            <GoalInput
                                className="w-100"
                                suffix="с"
                                decimalScale={0}
                                variant="outlined"
                                label="Длительность успешного звонка"
                                defaultValue={
                                    dashboard.PROPERTY_VALUES.CALLS_DURATION
                                }
                                onChange={(e) =>
                                    setCallDuration(e.target.value)
                                }
                            />

                            {callDuration &&
                                callDuration !==
                                    dashboard.PROPERTY_VALUES
                                        .CALLS_DURATION && (
                                    <IconButton
                                        onClick={() => {
                                            update.mutate({
                                                dashboard,
                                                callDuration,
                                            });
                                        }}
                                        disabled={update.isPending}
                                        className={`p-0 ${
                                            update.isPending
                                                ? 'opacity-50'
                                                : undefined
                                        }`}
                                    >
                                        <CheckBoxIcon
                                            style={{
                                                fill: '#03b703',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </IconButton>
                                )}
                        </Box>
                    </CardContent>
                    <CardActions className="p-3 pt-0">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setShowModal(true)}
                            disabled={update.isPending}
                            className="w-100"
                        >
                            Удалить дашборд
                        </Button>
                    </CardActions>
                </Card>
            </Menu>
            {showModal ? (
                <DeleteDashboardModal
                    dashboard={dashboard}
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    setShowModal={setShowModal}
                />
            ) : null}
        </>
    );
};
