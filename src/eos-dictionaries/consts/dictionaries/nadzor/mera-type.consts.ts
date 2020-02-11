import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import { COMMON_FIELD_NAME } from '../_common';
import { NADZOR_TEMPLATE } from './nadzor-template';

export const NP_MERA_TYPE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'mera-type',
    apiInstance: 'NP_MERA_TYPE_CL',
    title: 'Виды мер принуждения',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            isUnique: true,
            uniqueInDict: true,
        }),
    ],
});
