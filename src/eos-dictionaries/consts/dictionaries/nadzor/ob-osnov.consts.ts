import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';

export const NP_OB_OSNOV_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'ob-osnov',
    apiInstance: 'NP_OB_OSNOV_CL',
    title: 'Основания принесения',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields, {
        key: 'USE_C',
        title: 'Кассации',
        type: 'boolean',
        length: 20,
    }, {
        key: 'USE_A',
        title: 'Апелляции',
        type: 'boolean',
        length: 20,
    }, {
        key: 'USE_N',
        title: 'Надзорной инстанции',
        type: 'boolean',
        length: 20,
    }, {
        key: 'USE_VP',
        title: 'Обжалование вступивших в силу постановлений',
        type: 'boolean',
        length: 20,
    }, {
        key: 'USE_NP',
        title: 'Обжалование не вступивших в силу постановлений',
        type: 'boolean',
        length: 20,
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'string',
        length: 500,
    }],
    editFields: [...NADZOR_TEMPLATE.editFields, 'USE_C', 'USE_A', 'USE_N', 'USE_VP', 'USE_NP'],
});
