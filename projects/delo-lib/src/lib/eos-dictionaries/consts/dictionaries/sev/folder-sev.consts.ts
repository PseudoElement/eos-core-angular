import { RULES_SEV_DICT } from './sev-rules';
import { COLLISIONS_SEV_DICT } from './sev-collisions';
import { PARTICIPANT_SEV_DICT } from './sev-participant';
import { IDictionaryDescriptor } from '../../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from '../_linear-template';
import { Features } from '../../../../eos-dictionaries/features/features-current.const';
import { BROADCAST_CHANNEL_DICT } from './sev-broadcast-channel';
import { E_DICTIONARY_ID } from '../enum/dictionaryId.enum';

export const SEV_DICTIONARIES = [
    PARTICIPANT_SEV_DICT,
    BROADCAST_CHANNEL_DICT,
    RULES_SEV_DICT,
    COLLISIONS_SEV_DICT,
    // SEV_ASSOCIATION_DICT,
];

export const SEV_FOLDER: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: E_DICTIONARY_ID.SEV_FOLDER,
    isFolder: true,
    title: 'Справочники СЭВ',
    visible: Features.cfg.SEV.isDictsEnabled,
    apiInstance: 'SEV',
    iconName: 'eos-adm-icon-shared-folder-blue'
});
