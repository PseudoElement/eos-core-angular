import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';

export const NP_OB_WHAT_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'ob-what',
    apiInstance: 'NP_OB_WHAT_CL',
    title: 'Подлежит обжалованию',
    visible: true,
});
