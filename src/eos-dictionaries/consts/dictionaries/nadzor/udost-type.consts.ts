import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';

export const NP_UDOST_TYPE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'udost-type',
    apiInstance: 'NP_UDOST_TYPE_CL',
    title: 'Документы, удостоверяющие личность',
    visible: true,
});
