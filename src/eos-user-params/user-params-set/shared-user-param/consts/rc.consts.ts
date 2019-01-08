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
                {value: 'YES', title: 'да'},
                {value: 'NO', title: 'нет'}
            ]
        },

        {
            key: 'SHOW_ALL_RES',
            type: 'radio',
            title: 'Показывать поручения',
            readonly: false,
            options: [
                {value: 'YES', title: 'все'},
                {value: 'NO', title: 'покартотечно'}
            ]
        },
        {
            key: 'SHOW_ALL_RESLIST',
            type: 'radio',
            title: 'Показывать поручения',
            readonly: false,
            options: [
                {value: 'YES', title: 'все'},
                {value: 'NO', title: 'покартотечно'}
            ]
        },
        {
            key: 'RES_LIST_ALL',
            type: 'boolean',
            title: 'Развернутую инф. единым списком',
            readonly: false,
        },
        {
            key: 'SHOW_RAC_DATE',
            type: 'boolean',
            title: 'Показывать дату поступления в картотеку',
            readonly: false,
        },
        {
            key: 'DONT_SHOW_DOC_HIDDEN_FILES',
            type: 'boolean',
            title: 'Не показывать скрытые файлы',
            readonly: false,
        }
    ]
};
