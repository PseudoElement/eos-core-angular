import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';
import { E_DICT_TYPE, IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';

/* tslint:disable:max-line-length */
export const PRINT_INFO_DICT: IDictionaryDescriptor = {
    id: E_DICTIONARY_ID.PRINT_INFO,
    apiInstance: 'CB_PRINT_INFO',
    dictType: E_DICT_TYPE.linear,
    defaultOrder: 'PRINT_DEPARTMENT',
    title: '',
    visible: false,
    iconName: 'eos-adm-icon-dept-blue',
    actions: ['add', 'edit', 'remove', 'removeHard'],
    keyField: 'ISN_OWNER',
    parentField: 'PARENT_DUE',
    searchConfig: [],
    fields: [{
        key: 'ISN_OWNER',
        title: 'ISN владельца',
        type: 'number'
    }, {
        key: 'OWNER_KIND',
        title: 'Вид владельца',
        type: 'number'
    }, {
        key: 'PRINT_SURNAME',
        title: 'И.О. Фамилия',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'PRINT_SURNAME_DP',
        title: 'Фамилия И.О. в дательном падеже',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'PRINT_DUTY',
        title: 'Должность',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 255,
    }, {
        key: 'PRINT_DEPARTMENT',
        title: 'Подразделение',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 255,
    }, {
        key: 'DEPARTMENT_RP',
        title: 'Наименование в родительном падеже (чего?)',
        type: 'string',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'NOT_USE_IN_DUTY',
        title: 'Не использовать подразделение в названии должности',
        type: 'boolean',
    }, {
        key: 'SURNAME',
        title: 'Фамилия',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'NAME',
        title: 'Имя',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'PATRON',
        title: 'Отчество',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'SURNAME_RP',
        title: 'Фамилия',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'NAME_RP',
        title: 'Имя',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'PATRON_RP',
        title: 'Отчество',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'SURNAME_DP',
        title: 'Фамилия',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'NAME_DP',
        title: 'Имя',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'PATRON_DP',
        title: 'Отчество',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'SURNAME_VP',
        title: 'Фамилия',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'NAME_VP',
        title: 'Имя',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'PATRON_VP',
        title: 'Отчество',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'SURNAME_TP',
        title: 'Фамилия',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'NAME_TP',
        title: 'Имя',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'PATRON_TP',
        title: 'Отчество',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'SURNAME_PP',
        title: 'Фамилия',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'NAME_PP',
        title: 'Имя',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'PATRON_PP',
        title: 'Отчество',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'GENDER',
        title: 'Пол',
        type: 'string',
    }, {
        key: 'DUTY_RP',
        title: 'Родительный падеж (кого, чего)',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 255,
    }, {
        key: 'DUTY_DP',
        title: 'Дательный падеж (кому, чему?)',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 255,
    }, {
        key: 'DUTY_VP',
        title: 'Винительный падеж (кого, что?)',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 255,
    }],
    treeFields: [],
    searchFields: [],
    listFields: [],
    fullSearchFields: [],
    quickViewFields: [],
    shortQuickViewFields: [],
    editFields: ['PRINT_SURNAME_DP', 'PRINT_DUTY', 'PRINT_DEPARTMENT', 'DEPARTMENT_RP', 'NOT_USE_IN_DUTY', 'SURNAME', 'NAME', 'PATRON',
        'SURNAME_RP', 'NAME_RP', 'PATRON_RP', 'SURNAME_DP', 'NAME_DP', 'PATRON_DP', 'SURNAME_VP', 'NAME_VP', 'PATRON_VP',
        'SURNAME_TP', 'NAME_TP', 'PATRON_TP', 'SURNAME_PP', 'NAME_PP', 'PATRON_PP', 'GENDER', 'DUTY_RP', 'DUTY_DP', 'DUTY_VP'],
    allVisibleFields: [],
};
/* tslint:enable:max-line-length */
