import { IBaseParameters } from '../interfaces/parameters.interfaces';

export const CONTROL_CACHE_INFO: IBaseParameters = {
    id: 'control-cache',
    title: 'Управление кэшем',
    apiInstance: 'USER_PARMS',
    fields: [ 
        {
            key: 'USER_EDIT_AUDIT',
            type: 'boolean',
            title: `Протоколирование работы со справочником 'Пользователи'`
        },
    ],
    fieldsChild: [ ]
};


