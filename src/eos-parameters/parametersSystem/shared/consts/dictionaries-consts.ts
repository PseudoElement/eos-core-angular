import { IBaseParameters } from '../interfaces/parameters.interfaces';

export const DICTIONARIES_PARAM: IBaseParameters = {
    id: 'dictionaries',
    title: 'Справочники',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'DICT_RUBRIC_UNIQUE_CHECK',
            type: 'boolean',
            title: 'Рубрикатор - Проверка уникальности наименования рубрик'
        },
    ]
};


