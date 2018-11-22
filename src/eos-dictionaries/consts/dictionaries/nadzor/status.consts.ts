import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';

export const NP_STATUS_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'status',
    apiInstance: 'NP_STATUS_CL',
    title: 'Статусы надзорных производств',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields, {
        key: 'CLEAR_CABINET',
        title: 'Удалять из кабинета',
        type: 'boolean',
        length: 20,
    }],
    editFields: [...NADZOR_TEMPLATE.editFields, 'CLEAR_CABINET'],
    // TODO : скрывать из кабинетов с пометкой выгрузка в архив
});
