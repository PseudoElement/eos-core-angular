import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { EDS_CATEGORY_CL } from './category-eds.consts';

export const CA_CATEGORY_CL: IDictionaryDescriptor =
    Object.assign({}, LINEAR_TEMPLATE, {
    id: 'ca-category',
    folder: EDS_CATEGORY_CL.id,
    apiInstance: 'CA_CATEGORY',
    title: 'Корневые сертификаты УЦ',
    keyField: 'ISN_CA_CATEGORY',
    defaultOrder: 'CA_SERIAL',
    actions: [
        'add',
        'markRecords',
        'removeHard',
        'edit',
    ],
    searchConfig: [],
    visible: false,
    iconName: 'eos-icon-electronic-signature-blue',
    fields: [
        {
            key: 'ISN_CA_CATEGORY',
            title: 'isn',
            type: 'number'
        }, {
            key: 'CA_SERIAL',
            title: 'Серийный номер',
            type: 'string',
            length: 255,
            required: true,
            pattern: /[^\s]$/,
        }, {
            key: 'CA_SUBJECT',
            title: 'Описание',
            type: 'text',
            length: 500,
            pattern: /[^\s]$/,
            required: true,
        }, {
            key: 'ISN_EDS_CATEGORY',
            title: 'Категория ЭП',
            type: 'select',
            options: [],
            dictionaryId: EDS_CATEGORY_CL.apiInstance,
            dictionaryLink: {
                pk: 'ISN_LCLASSIF',
                fk: 'ISN_EDS_CATEGORY',
                label: 'CLASSIF_NAME',
            },
            default: null,
            required: true,
        }
    ],
    treeFields: ['CA_SERIAL'],
    quickViewFields: ['CA_SERIAL', 'CA_SUBJECT', 'ISN_EDS_CATEGORY'],
    listFields: ['ISN_EDS_CATEGORY', 'CA_SERIAL', 'CA_SUBJECT', ],
    allVisibleFields: [],
    editFields: ['CA_SERIAL', 'CA_SUBJECT', 'ISN_EDS_CATEGORY']

});
