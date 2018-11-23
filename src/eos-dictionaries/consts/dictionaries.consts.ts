import { CITSTATUS_DICT } from './dictionaries/citstatus.consts';
import { DEPARTMENTS_DICT } from './dictionaries/department.consts';
import { REGION_DICT } from './dictionaries/region.consts';
import { RUBRICATOR_DICT } from './dictionaries/rubricator.consts';

import { ADDR_CATEGORY_DICT } from './dictionaries/addr-category.consts';
import { CABINET_DICT } from './dictionaries/cabinet.consts';
import { CONTACT_DICT } from './dictionaries/contact.consts';
import { DELIVERY_DICT } from './dictionaries/delivery.consts';
import { DOCGROUP_DICT } from './dictionaries/docgroup.consts';
import { ORG_TYPE_DICT } from './dictionaries/org-type.consts';
import { ORGANIZ_DICT } from './dictionaries/organiz.consts';
import { RESOLUTION_CATEGORY_DICT } from './dictionaries/resolution-category.consts';
import { RESPRJ_PRIORITY_DICT } from './dictionaries/resprj-priority.consts';
import { RESPRJ_STATUS_DICT } from './dictionaries/resprj-status.consts';
import { SECURITY_DICT } from './dictionaries/security.consts';
import { SIGN_KIND_DICT } from './dictionaries/sign-kind.consts';
import { STATUS_EXEC_DICT } from './dictionaries/status-exec.consts';
import { STATUS_REPLY_DICT } from './dictionaries/status-reply.consts';
import { VISA_TYPE_DICT } from './dictionaries/visa-type.consts';
import { RULES_SEV_DICT } from './dictionaries/sev-rules';
import { COLLISIONS_SEV_DICT } from './dictionaries/sev-collisions';
import { PARTICIPANT_SEV_DICT } from './dictionaries/sev-participant';
import { BROADCAST_CHANNEL_DICT } from './dictionaries/broadcast-channel';
import { NADZOR } from './dictionaries/nadzor.consts';
import { REESTRTYPE_DICT } from './dictionaries/reestrtype.consts';
import {CITIZENS_DICT} from './dictionaries/citizens.const';
import {NOMENKL_CL} from './dictionaries/nomenkl.const';

export const DICTIONARIES = [
    /* tree dictionaries */
    CITSTATUS_DICT,
    DEPARTMENTS_DICT,
    REGION_DICT,
    RUBRICATOR_DICT,
    /* linear dictionaries */
    ADDR_CATEGORY_DICT,
    CABINET_DICT,
    CONTACT_DICT,
    DELIVERY_DICT,
    DOCGROUP_DICT,
    ORG_TYPE_DICT,
    ORGANIZ_DICT,
    RESOLUTION_CATEGORY_DICT,
    RESPRJ_PRIORITY_DICT,
    RESPRJ_STATUS_DICT,
    SECURITY_DICT,
    SIGN_KIND_DICT,
    STATUS_EXEC_DICT,
    STATUS_REPLY_DICT,
    VISA_TYPE_DICT,
    CITIZENS_DICT,
    NOMENKL_CL,
    // SEV
    RULES_SEV_DICT,
    COLLISIONS_SEV_DICT,
    PARTICIPANT_SEV_DICT,
    BROADCAST_CHANNEL_DICT,

    REESTRTYPE_DICT,

    NADZOR,
];
