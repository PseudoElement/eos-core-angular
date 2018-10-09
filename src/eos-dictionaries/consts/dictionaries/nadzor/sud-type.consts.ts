import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';

export const NP_SUD_TYPE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'sud-type',
    apiInstance: 'NP_SUD_TYPE_CL',
    title: 'Типы судебных органов',
    visible: true,
});
