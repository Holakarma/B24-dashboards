import { useEffect } from 'react';
import { BX } from '../api';

export function resizeFrame(sizes = { width: '100%', height: 600 }) {
    if (sizes) {
        BX.resizeWindow(sizes.width, sizes.height);
    }
    return () => {
        BX.fitWindow();
    };
}
