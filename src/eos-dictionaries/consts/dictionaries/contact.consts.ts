import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { environment } from 'environments/environment';
import { ISelectOption } from '../../../eos-common/interfaces';

export const MAIL_FORMATS: ISelectOption[] = [
    { value: 1, title: 'Старый паспорт' },
    { value: 2, title: 'Паспорт XML' },
    { value: 3, title: 'DOCX' }
];

export const CONTACT_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'contact',
    apiInstance: 'CONTACT',
    title: 'Контакты',
    iconName: '',
    visible: !environment.production,
    keyField: 'ISN_CONTACT',
    fields: [{
        key: 'ISN_CONTACT',
        type: 'number',
        title: 'ISN контакта',
    }, {
        key: 'ISN_ORGANIZ',
        type: 'number',
        title: 'ISN Организации',
    }, {
        key: 'ORDERNUM',
        type: 'number',
        title: '№ в списке',
    }, {
        key: 'SURNAME',
        type: 'string',
        title: 'ФИО',
        length: 255,
    }, {
        key: 'SURNAME_DP',
        type: 'string',
        title: 'ФИО в дательном',
        length: 255,
    }, {
        key: 'DUTY',
        type: 'string',
        title: 'Должность',
        length: 255,
    }, {
        key: 'DEPARTMENT',
        type: 'string',
        title: 'Подразделение',
        length: 255,
    }, {
        key: 'PHONE',
        type: 'string',
        title: 'Телефон городской',
        length: 255,
    }, {
        key: 'PHONE_LOCAL',
        type: 'string',
        title: 'Телефон местный',
        length: 255,
    }, {
        key: 'FAX',
        type: 'string',
        title: 'Факс',
        length: 255,
    }, {
        key: 'E_MAIL',
        type: 'string',
        title: 'E_MAIL',
        length: 255,
    }, {
        key: 'EDS_FLAG',
        type: 'boolean',
        title: 'Требуется ЭП',
    }, {
        key: 'ENCRYPT_FLAG',
        type: 'boolean',
        title: 'Требуется шифрование',
    }, {
        key: 'NOTE',
        type: 'string',
        title: 'Примечание',
        length: 2048,
    }, {
        key: 'MAIL_FORMAT',
        type: 'number',
        title: 'Почтовый формат',
    }, {
        key: 'DUE_EXT_DEPARTMENT',
        type: 'string',
        title: 'DUE_EXT_DEPARTMENT',
    }],
    searchFields: [],
    listFields: ['ISN_CONTACT', 'ISN_ORGANIZ', 'SURNAME', 'DUTY'],
    fullSearchFields: [],
    quickViewFields: ['ISN_CONTACT', 'ISN_ORGANIZ', 'SURNAME', 'DUTY', 'DEPARTMENT'],
    shortQuickViewFields: ['SURNAME', 'DUTY'],
    editFields: [],
    allVisibleFields: []
});
