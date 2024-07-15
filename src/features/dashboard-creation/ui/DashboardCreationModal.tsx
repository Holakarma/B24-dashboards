import React, { FC, Dispatch, SetStateAction } from 'react';
import DashboardCreation from './DashboardCreation';
import { BX } from '../../../shared/api';
import Modal from 'react-bootstrap/Modal';

interface DashboardCreationModalProps {
    show: boolean;
    setShow: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCreationModal: FC<DashboardCreationModalProps> = ({
    show,
    setShow,
}) => {
    const modalElement = React.useRef<any>(null);

    React.useEffect(() => {
        const sizes = modalElement?.current?.dialog?.getBoundingClientRect();
        if (sizes) {
            BX.resizeWindow(sizes.width, 600);
        }

        show || BX.fitWindow();
    }, [show]);

    return (
        <Modal
            show={show}
            fullscreen={true}
            onHide={() => setShow(false)}
            ref={modalElement}
        >
            <Modal.Header closeButton>
                <Modal.Title>Настройки создания дашборда</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container h-100">
                    <DashboardCreation />
                </div>
            </Modal.Body>
        </Modal>
    );
};
