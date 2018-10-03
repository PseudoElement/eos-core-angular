import { IBaseUsers } from '../intrfaces/user-params.interfaces';

export const OTHER_USER: IBaseUsers = {
    id: 'other',
    title: 'Прочее',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'SEND_DIALOG',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: 'NO', title: 'Без диалога'},
                {value: 'YES', title: 'С диалогом'}
            ]
        },
        {
            key: 'DELFROMCAB',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '1', title: 'Нет'},
                {value: '0', title: 'Да'}
            ]
        },
        {
            key: 'MARKDOC',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '1', title: 'Не добавлять'},
                {value: '0', title: 'Для всех документов'},
                {value: '2', title: 'Только для документов с "бумажным" оригиналом'}
            ]
        },
        {
            key: 'MARKDOCKND',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Оригинал(ы)'},
                {value: '1', title: 'Копию(и)'},
                {value: '2', title: 'Первому оригинал(ы), остальным копии'},
                {value: '3', title: 'Вручную'}
            ]
        },
        {
            key: 'RS_OUTER_DEFAULT_DELIVERY',
            type: 'select',
            title: '',
            options: [
                {value: 'NULL', title: ''},
                {value: '3774', title: 'Почта'},
                {value: '3776', title: 'Заказная почта'},
                {value: '3772', title: 'Нарочный'},
                {value: '3773', title: 'Курьер'},
                {value: '3775', title: 'Фельдсвязь'},
                {value: '1', title: 'E-MAIL'},
                {value: '3777', title: 'Телефонограмма'},
                {value: '3779', title: 'Спецсвязь'},
                {value: '3778', title: 'Факс'},
                {value: '2', title: 'СЭВ'},
                {value: '3', title: 'МЭДО'},
                {value: '4', title: 'VipNet'},
            ]
        }
    ]
};
