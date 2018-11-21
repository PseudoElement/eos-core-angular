import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';

export const RC_USER: IBaseUsers = {
    id: 'rc',
    title: 'РК',
    apiInstance: 'USER_PARMS',
    fields: [
       /* {
            key: 'OPEN_AR',
            type: 'select',
            title: '',
            options: [
            ]
        },*/
        {
            key: 'OPEN_AR',
            title: '',
            type: 'text',
            length: 255,
        },
        {
            key: 'SHOW_RES_HIERARCHY',
            type: 'radio',
            title: 'Показывать иерархию:',
            readonly: false,
            options: [
                {value: '0', title: 'да'},
                {value: '1', title: 'нет'}
            ]
        },
    ]
};
