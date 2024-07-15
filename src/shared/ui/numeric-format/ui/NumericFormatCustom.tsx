import React from 'react';
import {
    NumberFormatValues,
    NumericFormat,
    NumericFormatProps,
} from 'react-number-format';

interface CustomProps {
    onChange?: (event: {
        target: { name: string | undefined; value: string };
    }) => void;
    name?: string;
    suffix?: string;
    decimalScale?: number;
    value?: string;
}

export const NumericFormatCustom = React.forwardRef<
    NumericFormatProps,
    CustomProps
>(function NumericFormatCustom(props, ref) {
    const { onChange, suffix, decimalScale, ...other } = props;

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values: NumberFormatValues) => {
                if (onChange) {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }
            }}
            thousandSeparator=" "
            valueIsNumericString
            suffix={suffix ? ` ${suffix}` : undefined}
            allowNegative={false}
            decimalScale={decimalScale}
        />
    );
});
