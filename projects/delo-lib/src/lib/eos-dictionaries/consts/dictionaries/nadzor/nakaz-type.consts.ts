import { IDictionaryDescriptor } from '../../../../eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from './nadzor-template';
import { COMMON_FIELD_NAME } from '../_common';

export const NP_NAKAZ_TYPE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'nakaz-type',
    apiInstance: 'NP_NAKAZ_TYPE_CL',
    title: 'Наказания',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            isUnique: true,
            uniqueInDict: true,
        }),
    ],
});
