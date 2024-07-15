import React, { FC, memo, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

export type PeriodFormat = {
    minDate: string | undefined;
    maxDate: string | undefined;
};

interface DateRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    onDateChange: (newPeriod: PeriodFormat) => void;
    initialDate?: PeriodFormat;
}

export const DateRange: FC<DateRangeProps> = memo(
    ({ className, onDateChange, initialDate }) => {
        const [date, setDate] = React.useState({
            minDate: initialDate?.minDate,
            maxDate: initialDate?.maxDate,
        });

        useEffect(() => {
            if (date) {
                onDateChange(date);
            }
        }, [date]);

        return (
            <div className={`row ${className}`}>
                <div className="col">
                    <DatePicker
                        label="Дата начала"
                        defaultValue={
                            date.minDate ? moment(date.minDate) : undefined
                        }
                        onChange={(e) =>
                            setDate({
                                ...date,
                                minDate: e?.toISOString() || undefined,
                            })
                        }
                        maxDate={moment(date.maxDate)}
                        slotProps={{ field: { clearable: true } }}
                    />
                </div>
                <div className="col">
                    <DatePicker
                        defaultValue={
                            date.maxDate ? moment(date.maxDate) : undefined
                        }
                        label="Дата конца"
                        onChange={(e) =>
                            setDate({
                                ...date,
                                maxDate: e?.toISOString() || undefined,
                            })
                        }
                        minDate={moment(date.minDate)}
                        slotProps={{ field: { clearable: true } }}
                    />
                </div>
            </div>
        );
    },
);
