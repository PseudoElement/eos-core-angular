import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';

export const NP_OB_OTZIV_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'ob-otziv',
    apiInstance: 'NP_OB_OTZIV_CL',
    title: 'Причины отзыва',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields, {
        key: 'USE_C',
        title: 'Кассации',
        type: 'boolean',
    }, {
        key: 'USE_A',
        title: 'Апелляции',
        type: 'boolean',
    }, {
        key: 'USE_N',
        title: 'Надзорной инстанции',
        type: 'boolean',
    }, {
        key: 'USE_VP',
        title: 'Обжалование вступивших в силу постановлений',
        type: 'boolean',
    }, {
        key: 'USE_NP',
        title: 'Обжалование не вступивших в силу постановлений',
        type: 'boolean',
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
        length: 500,
    }],
    editFields: [...NADZOR_TEMPLATE.editFields, 'USE_C', 'USE_A', 'USE_N', 'USE_VP', 'USE_NP'],
});
