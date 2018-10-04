import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';

export const VISUALIZATION_USER: IBaseUsers = {
    id: 'visualization',
    title: 'Визуализация',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'COLLAGE_SHOW_MODE',
            type: 'select',
            title: '',
            options: [
                {value: '-1', title: 'Ассоциированное приложение'},
                {value: '0', title: 'Оригинальный файл'},
                {value: 'collage', title: 'Образ документа'}
            ]
        }
    ]
};
