import { IDictionaryDescriptor } from '../../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from '../_linear-template';
import { EMAIL } from '../../input-validation';
import {COMMON_FIELD_NAME, COMMON_FIELD_NOTE} from '../_common';
import {AUTH_METHOD, CHANNEL_TYPE, ENCRYPTION_TYPE} from './types.consts';
import { SEV_LINEAR_TEMPLATE } from './templates-sev.consts';
import { VALID_REQ_STRING } from '../../../../eos-common/consts/common.consts';
import { E_DICTIONARY_ID } from '../enum/dictionaryId.enum';

export const BROADCAST_CHANNEL_DICT: IDictionaryDescriptor = Object.assign({}, SEV_LINEAR_TEMPLATE, {
    id: E_DICTIONARY_ID.BROADCAST_CHANNEL, // 'userOrderCut', 'userOrderPaste',
    apiInstance: 'SEV_CHANNEL',
    visible: true,
    iconName: 'eos-adm-icon-move-2d-blue',
    keyField: 'ISN_LCLASSIF',
    defaultOrder: 'CHANNEL_TYPE',
    title: 'Каналы передачи сообщений',
    fields: LINEAR_TEMPLATE.fields.concat([
        Object.assign({}, COMMON_FIELD_NAME, {length: 64}),
        Object.assign({}, COMMON_FIELD_NOTE, {length: 255}),
        {
            key: 'CHANNEL_TYPE',
            type: 'select',
            title: 'Тип канала',
            options: CHANNEL_TYPE,
            required: true,
            default: 'email',
            length: 200,
        }, {
            key: 'EMAIL_PROFILE',
            type: 'select',
            title: 'Профиль электронной почты',
            options: [],
            required: false
        },
           {
            key: 'PARAMS',
            type: 'xml',
            length: 1,
            title: 'Параметры доставки',
        }, {
            key: 'SMTP_EMAIL',
            type: 'string',
            title: 'E-mail отправителя',
            length: 200,
            required: false,
            pattern: EMAIL,
            isOptional: true
        }, {
            key: 'SMTP_SERVER',
            type: 'string',
            title: 'SMTP сервер',
            pattern: VALID_REQ_STRING,
            required: false,
            length: 255,
            isOptional: true
        }, {
            key: 'SMTP_PORT',
            type: 'number',
            required: false,
            title: 'SMTP порт',
            default: 25,
            isOptional: true
        }, {
            key: 'ENCRYPTION_TYPE',
            type: 'select',
            options: ENCRYPTION_TYPE,
            required: false,
            title: 'Использовать следущий тип шифрования:',
            default: 0,
            isOptional: true
        }, {
            key: 'AUTH_METHOD',
            type: 'select',
            options: AUTH_METHOD,
            required: false,
            title: 'Метод аутентификации',
            default: 0,
            isOptional: true
        }, {
            key: 'SMTP_LOGIN',
            type: 'string',
            length: 100,
            title: 'SMTP логин',
            required: false,
            default: '',
            isOptional: true
        }, {
            key: 'SMTP_PASSWORD',
            type: 'string',
            length: 100,
            title: 'SMTP пароль',
            password: true,
            required: false,
            default: '',
            isOptional: true
        }, {
            key: 'POP3_SERVER',
            type: 'string',
            title: 'POP3 сервер',
            length: 255,
            required: false,
            isOptional: true
        }, {
            key: 'POP3_PORT',
            type: 'number',
            title: 'POP3 порт',
            required: false,
            default: 110,
            isOptional: true
        }, {
            key: 'POP3_ENCRYPTION',
            type: 'boolean',
            title: 'Требуется шифрованное подключение (SSL)',
            isOptional: true
        }, {
            key: 'POP3_LOGIN',
            type: 'string',
            length: 100,
            title: 'POP3 логин',
            required: false,
            isOptional: true
        }, {
            key: 'POP3_PASSWORD',
            type: 'string',
            password: true,
            length: 100,
            title: 'POP3 пароль',
            required: false,
            isOptional: true
        },
        {
            key: 'OUT_STORAGE',
            type: 'select',
            title: 'Хранилище',
            options: [],
            required: false
        },
        {
            key: 'OUT_FOLDER',
            type: 'string',
            title: 'Папка',
            default: 'ExtendedProtocolExport',
            required: true,
        }, 
        {
            key: 'IN_STORAGE',
            type: 'select',
            title: 'Хранилище',
            options: [],
            required: false
        },
        {
            key: 'IN_FOLDER',
            type: 'string',
            title: 'Папка',
            default: 'ExtendedProtocolImport',
            required: true,
        }
    ]),
    editFields: ['CLASSIF_NAME', 'NOTE', 'CHANNEL_TYPE',
        'SMTP_EMAIL', 'SMTP_SERVER', 'SMTP_PORT', 'ENCRYPTION_TYPE', 'AUTH_METHOD', 'SMTP_LOGIN', 'SMTP_PASSWORD',
        'POP3_SERVER', 'POP3_PORT', 'POP3_ENCRYPTION', 'POP3_LOGIN', 'POP3_PASSWORD',
        'OUT_FOLDER', 'OUT_STORAGE', 'IN_FOLDER', 'IN_STORAGE', 'PARAMS', 'EMAIL_PROFILE'
    ],
    listFields: ['CLASSIF_NAME', 'CHANNEL_TYPE', 'SMTP_EMAIL'],
    allVisibleFields: ['NOTE'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE', 'CHANNEL_TYPE', 'SMTP_EMAIL'],
    searchFields: ['CLASSIF_NAME'],
});
