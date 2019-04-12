import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';
import { COMMON_FIELD_NAME } from '../_common';

export const NP_SPOSOB_UKR_PR_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'sposob-ukr-pr',
    apiInstance: 'NP_SPOSOB_UKR_PR_CL',
    title: 'Способы укрытия преступлений',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            length: 100,
        }),
    {
        key: 'ISP_OTKAZ',
        title: 'Использовать в отказном материале',
        type: 'boolean',
        length: 20,
    }, {
        key: 'ISP_ISTOCH',
        title: 'Использовать в иных источниках',
        type: 'boolean',
        length: 20,
    }],
    editFields: [...NADZOR_TEMPLATE.editFields, 'ISP_OTKAZ', 'ISP_ISTOCH'],
});
