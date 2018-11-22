import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';

export const NP_NAKAZ_TYPE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'nakaz-type',
    apiInstance: 'NP_NAKAZ_TYPE_CL',
    title: 'Наказания',
    visible: true,
});
