import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import {NADZOR_TEMPLATE} from '../nadzor-template';

export const NP_SPEC_SUBJECT_CL: IDictionaryDescriptor = Object.assign({}, NADZOR_TEMPLATE, {
    id: 'spec-subject',
    apiInstance: 'NP_SPEC_SUBJECT_CL',
    title: 'Специальные субъекты',
    visible: true,
});
