import React, { FC } from 'react';
import AddCircle from '../../../shared/assets/icons/AddCircle';

import cls from './addDashboardBtn.module.css';

import type { SetStateAction } from 'react';

interface AddDashboardBtnProps {
    ModalComponent: FC<{
        show: boolean;
        setShow: React.Dispatch<SetStateAction<boolean>>;
    }>;
}

export const AddDashboardBtn = ({ ModalComponent }: AddDashboardBtnProps) => {
    const [show, setShow] = React.useState(false);

    return (
        <>
            <div
                className={`card opacity-75 ${cls.DashboardAddBtn}`}
                onClick={() => setShow(true)}
            >
                <div className="card-header">
                    <h4>Создать новый дашборд</h4>
                </div>
                <div className="card-body">
                    <AddCircle
                        className="w-100 opacity-75"
                        height="50px"
                        fill="var(--bs-body-color)"
                    />
                </div>
            </div>
            <ModalComponent
                show={show}
                setShow={setShow}
            />
        </>
    );
};
