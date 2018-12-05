import {E_DICT_TYPE, IDictionaryDescriptor} from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';
import {SEARCH_TYPES} from '../../search-types';
import {COMMON_FIELD_NAME, COMMON_FIELD_NOTE} from '../_common';

export const NP_CODEX_TYPE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'codex-type',
    apiInstance: 'NP_CODEX_TYPE_CL',
    title: 'Типы кодексов',
    visible: true,
    dictType: E_DICT_TYPE.linear,
    defaultOrder: 'CLASSIF_NAME_SHORT',
    actions: [
        'add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'restore',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard', 'tableCustomization',
        'edit', 'view', 'remove', 'removeHard', 'userOrder'],
    keyField: 'ISN_LCLASSIF',
    searchConfig: [SEARCH_TYPES.quick],
    fields: [{
        key: 'DELETED',
        title: 'Признак удаления',
        type: 'boolean'
    }, {
        key: 'PROTECTED',
        title: 'Защищен',
        type: 'number'
    }, {
        key: 'WEIGHT',
        title: 'Вес',
        type: 'number'
    }, {
        key: 'ISN_LCLASSIF',
        type: 'number',
        title: 'ID',
    }, {
        key: 'CLASSIF_NAME_FULL',
        type: 'string',
        title: 'Полное наименование',
        length: 200,
    },
        Object.assign({}, COMMON_FIELD_NAME, {
            key: 'CLASSIF_NAME_SHORT',
            length: 200,
        }),
        Object.assign({}, COMMON_FIELD_NOTE, {
            length: 500,
        })],
    treeFields: ['CLASSIF_NAME_SHORT'],
    editFields: ['CLASSIF_NAME_SHORT', 'CLASSIF_NAME_FULL', 'NOTE'],
    searchFields: ['CLASSIF_NAME_SHORT', 'NOTE'],
    fullSearchFields: ['CLASSIF_NAME_SHORT', 'NOTE'],
    quickViewFields: ['NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME_SHORT', ],
    listFields: ['CLASSIF_NAME_SHORT'],
    allVisibleFields: ['CLASSIF_NAME_FULL', 'NOTE'],

});
