import { RULES_SEV_DICT } from './sev-rules';
import { COLLISIONS_SEV_DICT } from './sev-collisions';
import { PARTICIPANT_SEV_DICT } from './sev-participant';
import { BROADCAST_CHANNEL_DICT } from './broadcast-channel';
import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const SEV_DICTIONARIES = [
    RULES_SEV_DICT,
    COLLISIONS_SEV_DICT,
    PARTICIPANT_SEV_DICT,
    BROADCAST_CHANNEL_DICT,
];

// export const NADZORDICTIONARIES_TREE = [
//     NP_SUD_RESHEN_TYPE_CL,
//     NP_RESHEN_CL,
//     NP_OSN_PRED_DELA_CL,
// ];

// export const NADZORDICTIONARIES = NADZORDICTIONARIES_LINEAR . concat(NADZORDICTIONARIES_TREE);

export const SEV_FOLDER: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'SEV_FOLDER',
    title: 'Справочники СЭВ',
    visible: false,
    apiInstance: 'sev_folder',
    iconName: 'eos-icon-review-blue'
});
