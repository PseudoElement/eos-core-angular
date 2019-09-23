import { E_DICT_TYPE, IFormDictionaryDescriptor } from 'eos-dictionaries/interfaces';

export const CALENDAR_DICT: IFormDictionaryDescriptor = {
    id: 'calendar',
    apiInstance: 'CALENDAR_CL',
    title: 'Ведение календаря',
    visible: true,
    iconName: 'eos-icon-calendar-blue',
    defaultOrder: '',
    actions: [],
    // keyField: 'DUE',
    searchConfig: [],
    treeFields: [],
    fields: [],
    keyField: 'ISN_CALENDAR',
    editFields: [],
    searchFields: [],
    fullSearchFields: [],
    quickViewFields: [],
    shortQuickViewFields: [],
    listFields: [],
    allVisibleFields: [],
    dictType: E_DICT_TYPE.form,
};
