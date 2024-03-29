import { E_MODES_USER_SELECT, IModesUserSelect } from '../interfaces/user-select.interface';

export const MODS_USER_SELECT: IModesUserSelect[] = [
    {
        key: E_MODES_USER_SELECT.department,
        title: 'Подразделения',
    },
    {
        key: E_MODES_USER_SELECT.card,
        title: 'Картотеки',
        tooltip: 'Картотекообразующие подразделения'
    },
    // {
    //     key: E_MODES_USER_SELECT.organiz,
    //     title: 'Организации',
    // },
];
