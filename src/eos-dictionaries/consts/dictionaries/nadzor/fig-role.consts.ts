import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import { NADZOR_TEMPLATE } from '../nadzor-template';

export const NP_FIG_ROLE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'fig-role',
    apiInstance: 'NP_FIG_ROLE_CL',
    title: 'Роли фигурантов',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields, {
        key: 'ARH_FLAG',
        title: 'Выгрузка в архив',
        type: 'boolean',
        length: 20,
    }],
    editFields: [...NADZOR_TEMPLATE.editFields, 'ARH_FLAG'],
});
