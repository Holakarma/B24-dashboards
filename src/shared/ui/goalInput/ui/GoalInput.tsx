import { Close } from '@mui/icons-material';
import { TextField, Divider, IconButton } from '@mui/material';
import React, { FC, memo } from 'react';
import { NumericFormatCustom } from 'shared/ui/numeric-format';

interface GoalInputProps {
    className?: string;
    value?: string;
    variant?: 'filled' | 'outlined' | 'standard';
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    label?: string;
    id?: string;
    onChange?: (event: { target: { name: string; value: string } }) => void;
    onClick?: (e: TClearEvent) => void;
    suffix?: string;
    decimalScale?: number;
    name?: string;
    disabled?: boolean;
    additionalChildren?: React.ReactNode;
    defaultValue?: string | number;
}

export type TClearEvent = {
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>;
    inputName: string;
};

export const GoalInput: FC<GoalInputProps> = memo(
    ({
        className,
        label,
        id,
        value,
        onChange,
        onClick,
        suffix,
        decimalScale,
        name,
        color,
        variant,
        disabled,
        additionalChildren,
        defaultValue,
    }) => {
        return (
            <TextField
                className={className}
                label={label}
                id={id}
                name={name}
                variant={variant || 'filled'}
                color={color}
                disabled={disabled}
                InputProps={{
                    inputComponent: NumericFormatCustom as any,
                    inputProps: { suffix, value, decimalScale },
                    defaultValue: defaultValue,
                    onChange,
                    endAdornment: value?.length ? (
                        <>
                            {additionalChildren}
                            <Divider
                                sx={{ height: 28, m: 0.5 }}
                                orientation="vertical"
                            />
                            <IconButton
                                color="error"
                                sx={{ p: '10px' }}
                                onClick={(event) => {
                                    onClick &&
                                        onClick({
                                            event,
                                            inputName: name || '',
                                        });
                                }}
                            >
                                <Close />
                            </IconButton>
                        </>
                    ) : null,
                }}
            />
        );
    },
);
