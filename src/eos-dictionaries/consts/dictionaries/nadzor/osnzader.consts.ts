import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';
import {NP_CODEX_TYPE_CL} from './codex-type.consts';

export const NP_OSNZADER_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'osnzader',
    apiInstance: 'NP_OSNZADER_CL',
    title: 'Основания задержаний',
    visible: true,
    fields: [...NADZOR_TEMPLATE.fields, {
        key: 'ISN_CODEX_TYPE',
        type: 'select',
        title: 'Тип кодекса',
        dictionaryId: NP_CODEX_TYPE_CL.apiInstance,
        options: [],
    }],
    editFields: [...NADZOR_TEMPLATE.editFields, 'ISN_CODEX_TYPE']
});
