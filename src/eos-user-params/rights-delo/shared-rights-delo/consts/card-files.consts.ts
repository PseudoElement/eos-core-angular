import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';

export const CARD_FILES_USER: IBaseUsers = {
    id: 'card-files',
    title: 'Картотеки и кабинеты',
    apiInstance: 'DEPARTMENT',
    fields: [
        {
            key: 'SELECT_FOR_CABINETS_NAME',
            type: 'select',
            title: '',
            options: []
        }
    ]
};
