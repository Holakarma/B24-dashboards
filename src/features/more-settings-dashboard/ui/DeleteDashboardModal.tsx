import React, { FC, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Modal,
} from '@mui/material';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { TDashboard, setOpenedDashboard } from 'entities/dashboard-item';
import { entityItemDelete, useAllDashboards } from 'entities/entity';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
};

interface DeleteDashboardModalProps {
    dashboard: TDashboard;
    open: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
}

export const DeleteDashboardModal: FC<DeleteDashboardModalProps> = ({
    dashboard,
    open,
    onClose,
    setShowModal,
}) => {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    const deleteDashboard = useMutation({
        mutationFn: (ID: number) => entityItemDelete(ID),
        onSuccess: async () => {
            await queryClient.invalidateQueries(
                {
                    queryKey: ['dashboards'],
                },
                { throwOnError: true },
            );
        },
    });

    const { data: dashboardsData, isPending, isSuccess } = useAllDashboards();

    const dashboards = useAppSelector((state) => state.dashboards.dashboards);

    useEffect(() => {
        if (deleteDashboard.isSuccess) {
            dispatch(setOpenedDashboard({ dashboard: null }));
        }
    }, [dashboardsData]);

    async function deleteHandler() {
        deleteDashboard.mutate(parseInt(dashboard.ID));
    }

    return (
        <Modal
            open={open}
            onClose={deleteDashboard.isPending ? undefined : onClose}
        >
            <Card sx={style}>
                <CardContent className="d-block p-4">
                    {deleteDashboard.isPending ? (
                        <Box className="text-center">Удаление...</Box>
                    ) : (
                        <>
                            <Box className="row w-100 g-0">
                                Вы действительно хотите удалить данный дашборд?
                            </Box>
                            <CardActions className="row mx-0 mt-4 d-flex justify-content-between p-0">
                                <Button
                                    className="col-4"
                                    variant="text"
                                    color="secondary"
                                    onClick={() => setShowModal(false)}
                                    disabled={deleteDashboard.isPending}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    className="col-7"
                                    variant="contained"
                                    color="error"
                                    onClick={deleteHandler}
                                    disabled={deleteDashboard.isPending}
                                >
                                    Удалить дашборд
                                </Button>
                            </CardActions>
                        </>
                    )}
                </CardContent>
            </Card>
        </Modal>
    );
};
