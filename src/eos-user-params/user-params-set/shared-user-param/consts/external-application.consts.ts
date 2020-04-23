import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';
const REG_MIN_VAL: RegExp = /^[1-9][0-9]*$/;
export const EXTERNAL_APPLICATION_USER: IBaseUsers = {
    id: 'external-application',
    title: 'Внешнее приложение',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'START_APP_1',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_2',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_3',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_4',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_5',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_6',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_7',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_8',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_9',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_0',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_1_PARMS',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_2_PARMS',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_3_PARMS',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_4_PARMS',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_5_PARMS',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_6_PARMS',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_7_PARMS',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_8_PARMS',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_9_PARMS',
            type: 'string',
            title: ''
        },
        {
            key: 'START_APP_0_PARMS',
            type: 'string',
            title: ''
        },
        {
            key: 'SRCH_LIMIT_RESULT',
            type: 'numberIncrement',
            title: 'Максимальное кол-во записей:',
            maxValue: 99999,
            minValue: 1,
            pattern: REG_MIN_VAL
        },
        {
            key: 'SEARCH_CONTEXT_CARD_EMPTY',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'текущая'},
                {value: '1', title: 'не задана'}
            ]
        }
    ]
};
