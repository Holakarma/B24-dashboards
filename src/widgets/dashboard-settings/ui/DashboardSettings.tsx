import React, { Dispatch, FC, SetStateAction, useCallback } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Drawer } from '@mui/material';
import { SettingsList } from './SettingsList';

interface DashboardSettingsProps {
    isSettingsOpen: boolean;
    setSettingsOpen: Dispatch<SetStateAction<boolean>>;
    disabled?: boolean;
}

export const DashboardSettings: FC<DashboardSettingsProps> = ({
    isSettingsOpen,
    setSettingsOpen,
    disabled,
}) => {
    const toggleDrawer = useCallback(
        (newOpen?: boolean) => setSettingsOpen(newOpen || !isSettingsOpen),
        [isSettingsOpen],
    );

    return (
        <>
            <Button
                className="btn"
                onClick={() => toggleDrawer()}
                disabled={disabled}
            >
                <SettingsIcon />
            </Button>
            <Drawer
                open={isSettingsOpen}
                onClose={() => toggleDrawer(false)}
                anchor="right"
            >
                <SettingsList toggleDrawer={toggleDrawer} />
            </Drawer>
        </>
    );
};
