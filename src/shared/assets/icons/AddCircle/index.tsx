import React, { FC, HTMLAttributes } from 'react';
import type { IconProps } from '../../../model/types';

interface AddCircleProps extends IconProps {}

const AddCircle: FC<AddCircleProps> = (props) => {
    const { height, width, fill, ...otherProps } = props;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height={height || '24px'}
            viewBox="0 -960 960 960"
            width={width || '24px'}
            fill={fill || '#e8eaed'}
            {...otherProps}
        >
            <path d="M464-308h32v-156h156v-32H496v-156h-32v156H308v32h156v156Zm16.41 172q-70.95 0-133.69-26.84-62.73-26.84-109.86-73.92t-73.99-109.72Q136-409.11 136-480.32q0-71.22 26.84-133.46 26.84-62.23 73.92-109.36t109.72-73.99Q409.11-824 480.32-824q71.22 0 133.46 26.84 62.23 26.84 109.36 73.92t73.99 109.48Q824-551.36 824-480.41q0 70.95-26.84 133.69-26.84 62.73-73.92 109.86t-109.48 73.99Q551.36-136 480.41-136Zm-.41-32q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z" />
        </svg>
    );
};

export default AddCircle;
