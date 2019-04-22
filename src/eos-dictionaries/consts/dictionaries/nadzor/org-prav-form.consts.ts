import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';
import {COMMON_FIELD_CODE, COMMON_FIELD_NAME } from '../_common';

export const NP_OPF_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'org-prav-form',
    apiInstance: 'NP_OPF_CL',
    title: 'Организационно-правовые формы',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_CODE, {
            length: 20,
            required: true,
        }),
        Object.assign({}, COMMON_FIELD_NAME, {
            length: 250,
            required: true,
        }),
        ],
    editFields: ['CODE', 'CLASSIF_NAME', 'NOTE']
 });
