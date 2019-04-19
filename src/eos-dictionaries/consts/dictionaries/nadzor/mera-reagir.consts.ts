import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';
import { COMMON_FIELD_NAME } from '../_common';

export const NP_MERA_REAGIR_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'mera-reagir',
    apiInstance: 'NP_MERA_REAGIR_CL',
    title: 'Меры реагирования',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            length: 100,
        }),
    ],
});
