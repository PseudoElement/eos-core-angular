import { IDictionaryDescriptor } from '../../../../eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from './nadzor-template';
import {NP_CODEX_TYPE_CL} from './codex-type.consts';
import { COMMON_FIELD_NAME } from '../_common';

export const NP_OSNZADER_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'osnzader',
    apiInstance: 'NP_OSNZADER_CL',
    title: 'Основания задержаний',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            isUnique: true,
            uniqueInDict: true,
        }), {
        key: 'ISN_CODEX_TYPE',
        type: 'select',
        title: 'Тип кодекса',
        dictionaryId: NP_CODEX_TYPE_CL.apiInstance,
        dictionaryLink: {
            pk: 'ISN_LCLASSIF',
            fk: 'ISN_CODEX_TYPE',
            label: 'CLASSIF_NAME_SHORT',
        },


        options: [],
    }],
    editFields: [...NADZOR_TEMPLATE.editFields, 'ISN_CODEX_TYPE'],
    allVisibleFields: ['ISN_CODEX_TYPE'],

});
