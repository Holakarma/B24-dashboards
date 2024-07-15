import { useAppDispatch } from '../../shared/lib/store/hooks';
import { changeTitle } from '../../shared/lib/store/slices/appTitleSlice';

export function setNewTitle(newTitle: string) {
    const dispatch = useAppDispatch();
    dispatch(changeTitle(newTitle));
}
