import { EMAIL } from '../../../../eos-dictionaries/consts/input-validation';
import { IBaseParameters } from '../interfaces/parameters.interfaces';

export const EmailEncryptionType = [
    {value: 1, title: 'None'},
    {value: 2, title: 'TLS'},
    {value: 3, title: 'STARTTLS'}
];
export const EmailAuthenticationType = [
    {value: 1, title: 'Password'},
    {value: 2, title: 'EncryptedPassword'},
    {value: 3, title: 'Kerberos'},
    {value: 4, title: 'NTLM'},
    {value: 5, title: 'None'}
];
export const EMAIL_PARAM: IBaseParameters = {
    id: 'email',
    title: 'Электронная почта',
    apiInstance: 'APP_SETTINGS',
    fields: [
        {
            key: 'ProfileName',
            type: 'string',
            readonly: false,
            title: 'Название профиля',
        },
        {
            key: 'EmailAccount',
            type: 'string',
            readonly: false,
            title: 'Адрес электронной почты',
            pattern: EMAIL,
        },
        {
            key: 'Password',
            type: 'string',
            readonly: false,
            title: 'Пароль',
        },
        /* Сервер входящей почты */
        {
            key: 'InServerType',
            type: 'select',
            readonly: false,
            title: 'Протокол',
            options: [
                {value: 1, title: 'IMAP'},
                {value: 2, title: 'POP3'}
            ]
        },
        {
            key: 'InServerHost',
            type: 'string',
            readonly: false,
            title: 'Сервер',
        },
        {
            key: 'InServerPort',
            type: 'numberIncrement',
            readonly: false,
            title: 'Порт',
        },
        {
            key: 'InEncryption',
            type: 'select',
            readonly: false,
            title: 'Шифрование',
            options: EmailEncryptionType
        },
        {
            key: 'InAuthMethod',
            type: 'select',
            readonly: false,
            title: 'Аутентификация',
            options: EmailAuthenticationType
        },
        {
            key: 'InUserName',
            type: 'string',
            readonly: false,
            required: true,
            title: 'Имя пользователя',
        },
        {
            key: 'DeleteEmailsOnServer',
            type: 'boolean',
            readonly: false,
            title: 'Удалять принятые сообщения на сервере',
        },
        /* Сервер исходящей почты */
        {
            key: 'OutServerHost',
            type: 'string',
            readonly: false,
            title: 'Сервер',
        },
        {
            key: 'OutServerPort',
            type: 'numberIncrement',
            readonly: false,
            title: 'Порт',
        },
        {
            key: 'OutEncryption',
            type: 'select',
            readonly: false,
            title: 'Шифрование',
            options: EmailEncryptionType
        },
        {
            key: 'OutAuthMethod',
            type: 'select',
            readonly: false,
            title: 'Аутентификация',
            options: EmailAuthenticationType
        },
        {
            key: 'OutUserName',
            type: 'string',
            readonly: false,
            title: 'Имя пользователя',
        },
    ],
    fieldsChild: [
    ]
};

export const DEFAULT_EMAIL_PARAM = [
    {
        key: 'ProfileName',
        value: ''
    },
    {
        key: 'EmailAccount',
        value: ''
    },
    {
        key: 'Password',
        value: ''
    },
    /* Сервер входящей почты */
    {
        key: 'InServerType',
        value: ''
    },
    {
        key: 'InServerHost',
        value: ''
    },
    {
        key: 'InServerPort',
        value: ''
    },
    {
        key: 'InEncryption',
        value: 1
    },
    {
        key: 'InAuthMethod',
        value: 1
    },
    {
        key: 'InUserName',
        value: ''
    },
    {
        key: 'DeleteEmailsOnServer',
        value: false
    },
    /* Сервер исходящей почты */
    {
        key: 'OutServerHost',
        value: ''
    },
    {
        key: 'OutServerPort',
        value: ''
    },
    {
        key: 'OutEncryption',
        value: 1
    },
    {
        key: 'OutAuthMethod',
        value: 1
    },
    {
        key: 'OutUserName',
        value: ''
    },
];
