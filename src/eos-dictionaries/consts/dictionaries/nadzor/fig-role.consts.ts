import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import { NADZOR_TEMPLATE } from '../nadzor-template';
import { COMMON_FIELD_NAME } from '../_common';

export const NP_FIG_ROLE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'fig-role',
    apiInstance: 'NP_FIG_ROLE_CL',
    title: 'Роли фигурантов',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            length: 64,
        }),
    {
        key: 'ARH_FLAG',
        title: 'Выгрузка в архив',
        type: 'boolean',
        length: 20,
    }],
    editFields: [...NADZOR_TEMPLATE.editFields, 'ARH_FLAG'],
});
