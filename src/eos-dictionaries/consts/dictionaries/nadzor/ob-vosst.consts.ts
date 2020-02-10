import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from './nadzor-template';
import { COMMON_FIELD_NAME } from '../_common';

export const NP_OB_VOSST_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'ob-vosst',
    apiInstance: 'NP_OB_VOSST_CL',
    title: 'Причины восстановления сроков обжалования',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            isUnique: true,
            uniqueInDict: true,
        }),
    ],
});
