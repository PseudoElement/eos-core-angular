import { IBaseParameters } from '../interfaces/parameters.interfaces';
export const CRYPTO_PARAM: IBaseParameters = {
    id: 'cryptography',
    title: 'Криптография',
    apiInstance: 'APP_SETTINGS',
    fields: [
        
        {
            key: 'ProfileName',
            type: 'string',
            readonly: false,
            title: 'Название профиля',
        },
        {
            key: 'InitString',
            type: 'string',
            readonly: false,
            title: 'Строка инициализации',
        },
        {
            key: 'CertStores',
            type: 'string',
            readonly: false,
            title: 'Хранилища',
        },
    ],
    fieldsChild: [

    ]
};

export const CRYPTO_PARAM_BTN_TABEL = [
    {
        tooltip: 'Добавить',
        disable: true,
        iconActiv: 'eos-adm-icon-plus-blue',
        iconDisable: 'eos-adm-icon-plus-grey',
        id: 'add'
    },
    {
        tooltip: 'Редактировать',
        disable: true,
        iconActiv: 'eos-adm-icon-edit-blue',
        iconDisable: 'eos-adm-icon-edit-grey',
        id: 'edit'
    },
    {
        tooltip: 'Удалить',
        disable: true,
        iconActiv: 'eos-adm-icon-bin-forever-blue',
        iconDisable: 'eos-adm-icon-bin-forever-grey',
        id: 'deleted'
    },
];
