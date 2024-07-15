import { FC, HTMLAttributes } from 'react';
import type { RootState } from '../../../app/store';
import { useSelector } from 'react-redux';
import { APP_TITLE } from '../../../shared/config/consts';

interface AppTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const AppTitle: FC<AppTitleProps> = (props) => {
    const { children, className } = props;

    const title = useSelector(
        (state: RootState) => state.openedDashboard.dashboard?.NAME,
    );

    return (
        <div className="container">
            <h2 className={`display-2 text-center ${className}`}>
                {children || title || APP_TITLE}
            </h2>
        </div>
    );
};
