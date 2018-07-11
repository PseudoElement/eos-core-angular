import { IBaseParameters } from '../interfaces/parameters.interfaces';

export const RC_PARAM: IBaseParameters = {
    id: 'rc',
    apiInstance: 'USER_PARMS',
    title: 'Работа с РК',
    fields: [
        {
            key: 'REP_SELF',
            type: 'boolean',
            title: 'Ввод отчетов только исполнителем поручений'
        }
    ]
};
