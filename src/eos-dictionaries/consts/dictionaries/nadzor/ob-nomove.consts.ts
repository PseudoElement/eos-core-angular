import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';

export const NP_OB_NOMOVE_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'ob-nomove',
    apiInstance: 'NP_OB_NOMOVE_CL',
    title: 'Причины оставления без движения',
    visible: true,
});
