import { IDictionaryDescriptor, E_DICT_TYPE } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import {COMMON_FIELD_NAME, COMMON_FIELD_NOTE} from './_common';

export const NADZOR_TEMPLATE: IDictionaryDescriptor = {
    id: '',
    iconName: '',
    apiInstance: '',
    dictType: E_DICT_TYPE.linear,
    defaultOrder: 'CLASSIF_NAME',
    title: 'Cправочник Надзора',
    actions: [
        'add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'restore',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard',
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
    },
    Object.assign({}, COMMON_FIELD_NAME, {
        length: 250,
    }),
    Object.assign({}, COMMON_FIELD_NOTE, {
            length: 500,
    })],
    treeFields: ['CLASSIF_NAME'],
    editFields: ['CLASSIF_NAME', 'NOTE'],
    searchFields: ['CLASSIF_NAME', 'NOTE'],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME', ],
    listFields: ['CLASSIF_NAME', 'NOTE'],
    allVisibleFields: [],
};
