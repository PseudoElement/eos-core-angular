import { IDictionaryDescriptor } from '../../../../eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from './nadzor-template';
import { COMMON_FIELD_NAME } from '../_common';

export const NP_OB_TYPE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'ob-type',
    apiInstance: 'NP_OB_TYPE_CL',
    title: 'Виды обжалований',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            isUnique: true,
            uniqueInDict: true,
        }),
        {
        key: 'USE_C',
        title: 'Кассации',
        type: 'boolean',
        length: 20,
    }, {
        key: 'USE_A',
        title: 'Апелляции',
        type: 'boolean',
        length: 20,
    }, {
        key: 'USE_N',
        title: 'Надзорной инстанции',
        type: 'boolean',
        length: 20,
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
        length: 500,
    }],
    editFields: [...NADZOR_TEMPLATE.editFields, 'USE_C', 'USE_A', 'USE_N'],
});
