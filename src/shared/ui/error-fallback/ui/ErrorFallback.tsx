import React, { FC } from 'react';

// type TError = {
//     errorTitle?: string;
//     error: string;
//     error_description: string;
// };

interface ErrorFallbackProps {
    error: any;
    resetErrorBoundary: (...args: any[]) => void;
}

export const ErrorFallback: FC<ErrorFallbackProps> = (props) => {
    const { error, resetErrorBoundary } = props;
    return (
        <div className="card">
            <div className="card-body">
                <h6>{error.message || 'Что-то пошло не так!'}</h6>
            </div>
        </div>
    );
};
