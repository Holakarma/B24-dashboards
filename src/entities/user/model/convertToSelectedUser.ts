import type { Tuser } from './types';
import type { SelectedUser } from './types';

export function convertToSelectedUSer(profile: Tuser): SelectedUser {
    return {
        id: profile.ID,
        name: profile.NAME,
        photo: profile.PERSONAL_PHOTO || '',
        position: '',
        sub: false,
        sup: false,
        url: profile.PERSONAL_WWW,
    };
}
