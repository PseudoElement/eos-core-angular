import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';
import { COMMON_FIELD_NAME } from '../_common';

export const NP_NARUSHEN_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'narushen',
    apiInstance: 'NP_NARUSHEN_CL',
    title: 'Нарушения',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            length: 100,
        }),
    ],
});
