import { E_DICT_TYPE, ITreeDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { SEARCH_TYPES } from '../search-types';
/*
*/
export const RUBRICATOR_DICT: ITreeDictionaryDescriptor = {
    id: 'rubricator',
    apiInstance: 'RUBRIC_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Рубрикатор',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard'],
    itemActions: ['edit', 'view', 'moveUp', 'moveDown', 'navigateUp', 'navigateDown'],
    groupActions: ['remove', 'removeHard', 'userOrder', 'showDeleted'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    fields: [{
        key: 'DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    }, {
        key: 'RUBRIC_CODE',
        title: 'Код',
        type: 'string',
        required: true,
        length: 248,
        pattern: NOT_EMPTY_STRING,
        /* tslint:disable:max-line-length */
        invalidMessage: 'Обязательное поле. Максимальная длина 248 символов. Пробелы в начале и в конце строки запрещены. Должно быть уникальным в пределах справочника',
        /* tslint:enable:max-line-length */
        isUnic: true,
        unicInDict: true,
    }, {
        key: 'CLASSIF_NAME',
        title: 'Краткое наименование',
        type: 'text',
        length: 2000,
        required: true,
        pattern: NOT_EMPTY_STRING,
        /* tslint:disable:max-line-length */
        invalidMessage: 'Обязательное поле. Максимальная длина 2000 символов. Пробелы в начале и в конце строки запрещены. Должно быть уникальным в пределах справочника',
        /* tslint:enable:max-line-length */
        isUnic: true,
        unicInDict: true,
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
        length: 255,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Максимальная длина 255 символов. Пробелы в начале и в конце строки запрещены.'
    }, {
        key: 'CODE',
        title: 'Code',
        type: 'string',
        length: 64,
        invalidMessage: 'Максимальная длина 64 символа. Пробелы в начале и в конце строки запрещены.'
    }, {
        key: 'DELETED',
        title: 'DELETED',
        type: 'number'
    }, {
        key: 'ISN_HIGH_NODE',
        title: 'ISN_HIGH_NODE',
        type: 'number'
    }, {
        key: 'ISN_NODE',
        title: 'ISN_NODE',
        type: 'number'
    }, {
        key: 'IS_NODE',
        title: 'IS_NODE',
        type: 'number'
    }, {
        key: 'PARENT_DUE',
        title: 'PARENT_DUE',
        type: 'string'
    }, {
        key: 'PROTECTED',
        title: 'PROTECTED',
        type: 'number'
    }, {
        key: 'WEIGHT',
        title: 'WEIGHT',
        type: 'number'
    }, {
        key: 'FULLNAME',
        title: 'Полное наименование',
        type: 'text',
        length: 2000,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Максимальная длина 248 символов. Пробелы в начале и в конце строки запрещены.'
    }, {
        key: 'sev',
        title: 'Индекс СЭВ',
        type: 'dictionary',
    }],
    editFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE', 'FULLNAME', 'sev'],
    searchFields: ['RUBRIC_CODE', 'CLASSIF_NAME'/*, 'NOTE'*/],
    fullSearchFields: ['RUBRIC_CODE', 'CLASSIF_NAME'/*, 'NOTE', 'fullTitle'*/],
    quickViewFields: ['FULLNAME', 'NOTE'],  // CLASSIF_NAME is in shortQuickViewFields
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['RUBRIC_CODE', 'CLASSIF_NAME'],
    allVisibleFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE', 'FULLNAME'],
};
