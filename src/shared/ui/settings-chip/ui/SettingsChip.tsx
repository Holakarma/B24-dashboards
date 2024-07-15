import {
    SelectChangeEvent,
    FormControl,
    Autocomplete,
    TextField,
    CircularProgress,
    Chip,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { SyntheticEvent, memo, useEffect } from 'react';

import { useAppSelector } from 'shared/lib/store';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export type CorrectDataType = { id: number; name: string; disabled?: boolean };

interface SettingChipProps<DataType> {
    queryFn: () => Promise<DataType[]>;
    title: string;
    queryKey: string[];
    selector: 'category' | 'coworkers' | 'department';
    dispatchFn: (ids: string) => void;
    converter?: (data: DataType[]) => CorrectDataType[];
    select?: (data: DataType[]) => DataType[];
    show?: boolean;
}

const SettingsChip = <DataType extends object>({
    queryFn,
    title,
    queryKey,
    selector,
    dispatchFn,
    converter,
    select,
}: SettingChipProps<DataType>) => {
    const statistics = useAppSelector(
        (state) => state.statistics.statistics[selector],
    );

    const {
        data: fetchedList,
        isLoading,
        isSuccess,
    } = useQuery({
        queryFn,
        enabled: !!statistics,
        queryKey: queryKey,
        staleTime: 1000 * 60 * 5,
        throwOnError: true,
        select,
    });

    const [dataList, setDataList] = React.useState<CorrectDataType[]>([]);

    useEffect(() => {
        if (isSuccess) {
            if (converter) {
                setDataList(converter(fetchedList));
            } else {
                setDataList(fetchedList as CorrectDataType[]);
            }
        }
    }, [fetchedList]);

    const [ids, setIds] = React.useState<number[]>(
        statistics?.selectionIds.length
            ? statistics?.selectionIds.split(',').map(Number)
            : [],
    );

    const handleChange = (event: SelectChangeEvent<typeof ids>) => {
        const {
            target: { value },
        } = event;
        setIds(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',').map(Number) : value,
        );
    };

    const handleAutocomplete = (
        event: SyntheticEvent<Element, Event>,
        value: CorrectDataType[],
    ) => {
        setIds(value.map((v) => v.id));
    };

    useEffect(() => {
        dispatchFn(ids.join(','));
    }, [ids]);

    return (
        <div className="w-100">
            <FormControl sx={{ width: '100%' }}>
                {/* <InputLabel id={`${queryKey}-chip`}>
                    {isLoading ? 'Загрузка...' : title}
                </InputLabel>
                <Select
                    labelId={`${queryKey}-chip`}
                    id={`${queryKey}-select`}
                    multiple
                    input={
                        <OutlinedInput
                            id={`${queryKey}-input`}
                            label="Chip"
                        />
                    }
                    value={ids}
                    onChange={handleChange}
                    disabled={isLoading}
                    renderValue={(selected: number[]) => (
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.5,
                            }}
                        >
                            {isSuccess &&
                                selected.map((value: number) => {
                                    const item = dataList.find(
                                        (c) => c.id === value,
                                    );
                                    return (
                                        <Chip
                                            key={value}
                                            label={item?.name}
                                        />
                                    );
                                })}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {isSuccess &&
                        dataList.map((category) => (
                            <MenuItem
                                key={category.id}
                                value={category.id}
                                disabled={category?.disabled}
                            >
                                {category.name}
                            </MenuItem>
                        ))}
                </Select> */}

                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    getOptionDisabled={(option) => !!option.disabled} // Проблема
                    id="tags-standard"
                    options={dataList}
                    getOptionLabel={(option) => option.name}
                    value={dataList.filter((d) => ids.includes(d.id))}
                    onChange={handleAutocomplete}
                    loading={isLoading}
                    loadingText="Загрузка..."
                    renderOption={(props, option) => {
                        return (
                            <li
                                {...props}
                                key={option.id}
                            >
                                {option.name}
                            </li>
                        );
                    }}
                    renderTags={(tagValue, getTagProps) => {
                        return tagValue.map((option, index) => (
                            <Chip
                                {...getTagProps({ index })}
                                key={option.id}
                                label={option.name}
                            />
                        ));
                    }}
                    renderInput={({ id, ...params }) => (
                        <TextField
                            key={id}
                            {...params}
                            label={title}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {isLoading ? (
                                            <CircularProgress
                                                color="inherit"
                                                size={20}
                                            />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                />
            </FormControl>
        </div>
    );
};

export default memo(SettingsChip);
