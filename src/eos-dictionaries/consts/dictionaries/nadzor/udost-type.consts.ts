import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';
import { COMMON_FIELD_NAME } from '../_common';

export const NP_UDOST_TYPE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'udost-type',
    apiInstance: 'NP_UDOST_TYPE_CL',
    title: 'Документы, удостоверяющие личность',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            length: 64,
        }),
    ],
});
