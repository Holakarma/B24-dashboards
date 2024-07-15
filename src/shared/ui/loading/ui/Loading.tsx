import ReactLoading from 'react-loading';
import { FC } from 'react';

type LoadingType =
    | 'blank'
    | 'balls'
    | 'bars'
    | 'bubbles'
    | 'cubes'
    | 'cylon'
    | 'spin'
    | 'spinningBubbles'
    | 'spokes';

interface loadingProps {
    color?: string;
    height?: any;
    width?: any;
    delay?: number;
    type?: LoadingType;
    className?: string;
}

export const Loading: FC<loadingProps> = (props) => {
    const { type = 'bars', ...otherProps } = props;

    return (
        <ReactLoading
            type={type}
            {...otherProps}
        />
    );
};
