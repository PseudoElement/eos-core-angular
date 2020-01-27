import { RULES_SEV_DICT } from './sev-rules';
import { COLLISIONS_SEV_DICT } from './sev-collisions';
import { PARTICIPANT_SEV_DICT } from './sev-participant';
import { BROADCAST_CHANNEL_DICT } from './broadcast-channel';

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

// export const NADZOR: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
//     id: 'nadzor',
//     title: 'Справочники Надзора',
//     visible: false,
//     apiInstance: 'nadzor',
//     iconName: 'eos-icon-review-blue'
// });
