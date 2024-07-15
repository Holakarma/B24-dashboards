import { FC, StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from 'shared/ui/error-fallback';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/ru';
import { LocalizationProvider } from '@mui/x-date-pickers';

const Providers: FC<{ children: JSX.Element }> = ({ children }) => {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: '#FFFFFF',
            },
        },
    });

    const client = new QueryClient();

    return (
        <StrictMode>
            <QueryClientProvider client={client}>
                <ThemeProvider theme={darkTheme}>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <LocalizationProvider
                            dateAdapter={AdapterMoment}
                            adapterLocale="ru"
                        >
                            <Provider store={store}>{children}</Provider>
                        </LocalizationProvider>
                    </ErrorBoundary>
                </ThemeProvider>
            </QueryClientProvider>
        </StrictMode>
    );
};

export default Providers;
