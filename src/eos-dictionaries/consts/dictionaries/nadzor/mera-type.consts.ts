import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';

export const NP_MERA_TYPE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'mera-type',
    apiInstance: 'NP_MERA_TYPE_CL',
    title: 'Виды мер принуждения',
    visible: true,
});
