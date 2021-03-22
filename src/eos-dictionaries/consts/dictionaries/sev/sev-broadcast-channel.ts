import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from '../_linear-template';
import { EMAIL } from '../../input-validation';
import {COMMON_FIELD_NAME, COMMON_FIELD_NOTE} from '../_common';
import {AUTH_METHOD, CHANNEL_TYPE, ENCRYPTION_TYPE} from './types.consts';
import { SEV_LINEAR_TEMPLATE } from './templates-sev.consts';
import { VALID_REQ_STRING } from 'eos-common/consts/common.consts';

export const BROADCAST_CHANNEL_DICT: IDictionaryDescriptor = Object.assign({}, SEV_LINEAR_TEMPLATE, {
    id: 'broadcast-channel',
    apiInstance: 'SEV_CHANNEL',
    visible: true,
    iconName: 'eos-icon-move-2d-blue',
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
            length: 200
        }, {
            key: 'PARAMS',
            type: 'xml',
            length: 1,
            title: 'Параметры доставки',
        }, {
            key: 'SMTP_EMAIL',
            type: 'string',
            title: 'E-mail отправителя',
            length: 200,
            required: true,
            pattern: EMAIL,
        }, {
            key: 'SMTP_SERVER',
            type: 'string',
            title: 'SMTP сервер',
            pattern: VALID_REQ_STRING,
            required: true,
            length: 255,
        }, {
            key: 'SMTP_PORT',
            type: 'number',
            required: true,
            title: 'SMTP порт',
            default: 25
        }, {
            key: 'ENCRYPTION_TYPE',
            type: 'select',
            options: ENCRYPTION_TYPE,
            required: true,
            title: 'Использовать следущий тип шифрования:',
            default: 0
        }, {
            key: 'AUTH_METHOD',
            type: 'select',
            options: AUTH_METHOD,
            required: true,
            title: 'Метод аутентификации',
            default: 0
        }, {
            key: 'SMTP_LOGIN',
            type: 'string',
            length: 100,
            title: 'SMTP логин',
            required: true,
            default: '',
        }, {
            key: 'SMTP_PASSWORD',
            type: 'string',
            length: 100,
            title: 'SMTP пароль',
            password: true,
            required: true,
            default: '',
        }, {
            key: 'SMTP_DELAY',
            type: 'number',
            title: 'Задержка, мин',
            default: 1,
        }, {
            key: 'POP3_SERVER',
            type: 'string',
            title: 'POP3 сервер',
            length: 255,
            required: true,
        }, {
            key: 'POP3_PORT',
            type: 'number',
            title: 'POP3 порт',
            required: true,
            default: 110
        }, {
            key: 'POP3_ENCRYPTION',
            type: 'boolean',
            title: 'Требуется шифрованное подключение (SSL)',
        }, {
            key: 'POP3_LOGIN',
            type: 'string',
            length: 100,
            title: 'POP3 логин',
            required: true,
        }, {
            key: 'POP3_PASSWORD',
            type: 'string',
            password: true,
            length: 100,
            title: 'POP3 пароль',
            required: true,
        }, {
            key: 'OUT_FOLDER',
            type: 'string',
            title: 'Папка входящих сообщений',
            required: true,
        }, {
            key: 'IN_FOLDER',
            type: 'string',
            title: 'Папка исходящих сообщений',
            required: true,
        }]),
    editFields: ['CLASSIF_NAME', 'NOTE', 'CHANNEL_TYPE',
        'SMTP_EMAIL', 'SMTP_SERVER', 'SMTP_PORT', 'ENCRYPTION_TYPE', 'AUTH_METHOD', 'SMTP_LOGIN', 'SMTP_PASSWORD', 'SMTP_DELAY',
        'POP3_SERVER', 'POP3_PORT', 'POP3_ENCRYPTION', 'POP3_LOGIN', 'POP3_PASSWORD',
        'OUT_FOLDER', 'IN_FOLDER', 'PARAMS'
    ],
    listFields: ['CLASSIF_NAME', 'CHANNEL_TYPE', 'SMTP_EMAIL'],
    allVisibleFields: ['NOTE'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE', 'CHANNEL_TYPE'],
    searchFields: ['CLASSIF_NAME'],
});
