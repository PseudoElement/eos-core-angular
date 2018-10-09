import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';

export const NP_SUDIM_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'sudim',
    apiInstance: 'NP_SUDIM_CL',
    title: 'Судимости',
    visible: true,
});
