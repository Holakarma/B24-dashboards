import {
    CircularProgressProps,
    Box,
    CircularProgress,
    Typography,
} from '@mui/material';

export function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
) {
    const { value, ...otherProps } = props;
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                value={value > 100 ? 100 : value}
                {...otherProps}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}
