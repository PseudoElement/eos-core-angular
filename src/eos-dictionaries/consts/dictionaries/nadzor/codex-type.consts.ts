import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';

export const NP_CODEX_TYPE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'codex-type',
    apiInstance: 'NP_CODEX_TYPE_CL',
    title: 'Типы кодексов',
    visible: true,
});
