import { IBaseParameters } from "../interfaces/parameters.interfaces";
export const SMS_GATEWAY_PARAM: IBaseParameters = {
    id: 'sms',
    title: 'Смс шлюз',
    apiInstance: 'APP_SETTINGS',
    fields: [
        {
            key: 'ProfileName',
            type: 'string',
            readonly: false,
            title: 'Название профиля',
            required: true
        },
        {
            key: 'Endpoint',
            type: 'string',
            readonly: false,
            title: 'Адрес шлюза',
            required: true
        },
        {
            key: 'UrlTemplate',
            type: 'string',
            readonly: false,
            title: 'Шаблон запроса',
        },
        {
            key: 'Login',
            type: 'string',
            readonly: false,
            title: 'Логин',
        },
        {
            key: 'Password',
            type: 'string',
            readonly: false,
            title: 'Пароль',
        },
    ],
    fieldsChild: [
    ]
};
