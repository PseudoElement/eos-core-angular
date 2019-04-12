import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import { NADZOR_TEMPLATE } from '../nadzor-template';
import { COMMON_FIELD_NAME } from '../_common';

export const NP_ADDRESS_VID_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'address-vid',
    apiInstance: 'NP_ADDRESS_VID_CL',
    title: 'Типы адреса',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            length: 64,
        }),
    ],
});
