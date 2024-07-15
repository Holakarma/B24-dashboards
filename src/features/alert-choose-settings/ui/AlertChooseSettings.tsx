import React, { Dispatch, FC, SetStateAction } from 'react';
import cls from './alertChooseSettings.module.css';

interface AlertChooseSettingsProps {
    setSettingsOpen: Dispatch<SetStateAction<boolean>>;
}

export const AlertChooseSettings: FC<AlertChooseSettingsProps> = ({ setSettingsOpen }) => {
    return (
        <>
            <div
                className={'card mt-4'}
            >
                <div className="card-header">
                    <h5>Для просмотра статистики выберите настройки дашборда</h5>
                </div>
                <div className="card-body text-end">
                    <span
                        className={cls.spanHover}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSettingsOpen(true)}
                    >
                        <span className={cls.underline}>
                            Нажмите для перехода к настройкам
                        </span>
                    </span>
                </div>
            </div>
        </>
    );
};