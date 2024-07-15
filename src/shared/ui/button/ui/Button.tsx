import React, { FC } from 'react';
import MaterialButton, {
    ButtonProps as MaterialButtonProps,
} from '@mui/material/Button';

interface ButtonProps extends MaterialButtonProps {}

export const Button: FC<ButtonProps> = ({
    children,
    className,
    ...otherProps
}) => {
    return (
        <MaterialButton
            className={className}
            style={{ minWidth: 0 }}
            {...otherProps}
        >
            {children}
        </MaterialButton>
    );
};
