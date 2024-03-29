import { EMAIL } from '../../../../eos-dictionaries/consts/input-validation';
import { IBaseParameters } from '../interfaces/parameters.interfaces';
export const REG_PORT: RegExp = /^(([0-9]{1,4})|([1-5][0-9]{4})|(6[0-4][0-9]{3})|(65[0-4][0-9]{2})|(655[0-2][0-9])|(6553[0-5]))$/; // проверка порта от 0 до 65535
export const EmailEncryptionType = [
    {value: 'none', title: 'Нет'},
    {value: 'tls', title: 'TLS'},
    {value: 'starttls', title: 'STARTTLS'}
];
export const EmailAuthenticationType = [
    {value: 'password', title: 'Обычный пароль'},
    {value: 'encryptedPassword', title: 'Зашифрованный пароль'},
    {value: 'kerberos', title: 'Kerberos'},
    {value: 'ntlm', title: 'NTLM'},
    {value: 'none', title: 'Нет'}
];
export enum InServerType {
    IMAP = 'imap',
    POP3 = 'poP3'
}
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
            required: true,
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
            required: true,
            options: [
                {value: InServerType.IMAP, title: 'IMAP'},
                {value: InServerType.POP3, title: 'POP3'}
            ]
        },
        {
            key: 'InServerHost',
            type: 'string',
            readonly: false,
            title: 'Сервер',
            required: true,
        },
        {
            key: 'InServerPort',
            type: 'numberIncrement',
            readonly: false,
            title: 'Порт',
            pattern: REG_PORT,
            required: true,
        },
        {
            key: 'InEncryption',
            type: 'select',
            readonly: false,
            title: 'Шифрование',
            options: EmailEncryptionType,
            required: true,
        },
        {
            key: 'InAuthMethod',
            type: 'select',
            readonly: false,
            title: 'Аутентификация',
            options: EmailAuthenticationType,
            required: true,
        },
        {
            key: 'InUserName',
            type: 'string',
            readonly: false,
            required: true,
            title: 'Имя пользователя',
        },
        {
            key: 'ImapFolder',
            type: 'string',
            readonly: false,
            required: true,
            title: 'Папка'
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
            required: true,
            title: 'Сервер',
        },
        {
            key: 'OutServerPort',
            type: 'numberIncrement',
            readonly: false,
            required: true,
            pattern: REG_PORT,
            title: 'Порт',
        },
        {
            key: 'OutEncryption',
            type: 'select',
            readonly: false,
            title: 'Шифрование',
            required: true,
            options: EmailEncryptionType
        },
        {
            key: 'OutAuthMethod',
            type: 'select',
            readonly: false,
            title: 'Аутентификация',
            required: true,
            options: EmailAuthenticationType
        },
        {
            key: 'OutUserName',
            type: 'string',
            readonly: false,
            required: true,
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
    {
        key: 'ImapFolder',
        value: 'Inbox'
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
