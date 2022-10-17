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
import { RESOL_CATEGORY_DICT } from './dictionaries/resolution-category.consts';
import { RESPRJ_PRIORITY_DICT } from './dictionaries/resprj-priority.consts';
import { SECURITY_DICT } from './dictionaries/security.consts';
import { SIGN_KIND_DICT } from './dictionaries/sign-kind.consts';
import { STATUS_EXEC_DICT } from './dictionaries/status-exec.consts';
import { LINK_DICT } from './dictionaries/link.consts';
import { STATUS_REPLY_DICT } from './dictionaries/status-reply.consts';
import { VISA_TYPE_DICT } from './dictionaries/visa-type.consts';
import { REESTRTYPE_DICT } from './dictionaries/reestrtype.consts';
import {NOMENKL_DICT} from './dictionaries/nomenkl.const';
import {EDS_CATEGORY_CL} from './dictionaries/category-eds.consts';
import { CALENDAR_DICT } from './dictionaries/calendar.consts';
import {Templates} from './dictionaries/templates.consts';
import { CA_CATEGORY_CL } from './dictionaries/ca-category.consts';
import {CITIZENS_DICT} from './dictionaries/citizens.const';
import { Features } from 'eos-dictionaries/features/features-current.const';
import { EOSDICTS_VARIANT } from 'eos-dictionaries/features/features.interface';
import { NADZOR_FOLDER } from './dictionaries/nadzor/nadzor.consts';
import { SEV_FOLDER } from './dictionaries/sev/folder-sev.consts';
import { TYPE_DOCUM_DICT } from './dictionaries/type-docum.const';
import { FILE_TYPE_DICT } from './dictionaries/file-type.const';
import { FILE_CATEGORIES_DICT } from './dictionaries/file-categories.consts';
import { FORMAT_DICT } from './dictionaries/format.const';
import { MEDO_NODE_DICT } from './dictionaries/medo-node.const';

export const DICTIONARIES = [

    /* tree dictionaries */
    CITSTATUS_DICT,
    DEPARTMENTS_DICT,
    REGION_DICT,
    RUBRICATOR_DICT,
    CALENDAR_DICT,

    /* linear dictionaries */
    ADDR_CATEGORY_DICT,
    CABINET_DICT,
    CONTACT_DICT,
    DELIVERY_DICT,
    DOCGROUP_DICT,
    ORG_TYPE_DICT,
    ORGANIZ_DICT,
    RESOL_CATEGORY_DICT,
    RESPRJ_PRIORITY_DICT,
    SECURITY_DICT,
    CA_CATEGORY_CL,
    SIGN_KIND_DICT,
    STATUS_EXEC_DICT,
    STATUS_REPLY_DICT,
    VISA_TYPE_DICT,
    NOMENKL_DICT,
    EDS_CATEGORY_CL,
    LINK_DICT,
    Templates,
    TYPE_DOCUM_DICT,
    FILE_TYPE_DICT,
    MEDO_NODE_DICT,
    // @stub157113 открыть при наличии бэка
    FILE_CATEGORIES_DICT,
    FORMAT_DICT,
    ... Features.cfg.variant === EOSDICTS_VARIANT.Nadzor ? [NADZOR_FOLDER, ] : [CITIZENS_DICT, ],
    ... Features.cfg.SEV.isDictsEnabled ? [SEV_FOLDER] : [],
    REESTRTYPE_DICT,
];
