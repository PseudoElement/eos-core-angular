import {NP_UDOST_TYPE_CL} from './nadzor/udost-type.consts';
import {NP_ADDRESS_VID_CL} from './nadzor/address-vid.consts';
import {NP_CODEX_TYPE_CL} from './nadzor/codex-type.consts';
import {NP_FIG_ROLE_CL} from './nadzor/fig-role.consts';
import {NP_MERA_OSNOV_CL} from './nadzor/mera-osnov.consts';
import {NP_MERA_REAGIR_CL} from './nadzor/mera-reagir.consts';
import {NP_MERA_TYPE_CL} from './nadzor/mera-type.consts';
import {NP_NAKAZ_TYPE_CL} from './nadzor/nakaz-type.consts';
import {NP_NARUSHEN_CL} from './nadzor/narushen.consts';
import {NP_NEZ_METOD_RASSLED_CL} from './nadzor/nez-metod-rassled.consts';
import {NP_OB_MOTIV_CL} from './nadzor/ob-motiv.consts';
import {NP_OB_NOMOVE_CL} from './nadzor/ob-nomove.consts';
import {NP_OB_OSNOV_CL} from './nadzor/ob-osnov.consts';
import {NP_OB_OTZIV_CL} from './nadzor/ob-otziv.consts';
import {NP_OB_RETURN_CL} from './nadzor/ob-return.consts';
import {NP_OB_TYPE_CL} from './nadzor/ob-type.consts';
import {NP_OB_VOSST_CL} from './nadzor/ob-vosst.consts';
import {NP_OB_WHAT_CL} from './nadzor/ob-what.consts';
import {NP_OPF_CL} from './nadzor/org-prav-form.consts';
import {NP_OSN_OSVOB_CL} from './nadzor/osn-osvob.consts';
import {NP_OSN_PRIN_RESH_CL} from './nadzor/osn-prin-resh.consts';
import {NP_OSNZADER_CL} from './nadzor/osnzader.consts';
import {NP_RESULT_RASSLED_CL} from './nadzor/result-rassled.consts';
import {NP_SPEC_SUBJECT_CL} from './nadzor/spec-subject.consts';
import {NP_SPOSOB_UKR_PR_CL} from './nadzor/sposob-ukr-pr.consts';
import {NP_STATUS_CL} from './nadzor/status.consts';
import {NP_SUD_TYPE_CL} from './nadzor/sud-type.consts';
import {NP_SUDIM_CL} from './nadzor/sudim.consts';
import {IDictionaryDescriptor} from '../../interfaces';
import {LINEAR_TEMPLATE} from './_linear-template';
import {NP_SUD_RESHEN_TYPE_CL} from './nadzor/reshen-suda.const';
import {NP_RESHEN_CL} from './nadzor/reshen.consts';
import {NP_OSN_PRED_DELA_CL} from './nadzor/osn-pred-dela';

export const NADZORDICTIONARIES = [
    NP_ADDRESS_VID_CL,
    NP_CODEX_TYPE_CL,
    NP_FIG_ROLE_CL,
    NP_MERA_OSNOV_CL,
    NP_MERA_REAGIR_CL,
    NP_MERA_TYPE_CL,
    NP_NAKAZ_TYPE_CL,
    NP_NARUSHEN_CL,
    NP_NEZ_METOD_RASSLED_CL,
    NP_OB_MOTIV_CL,
    NP_OB_NOMOVE_CL,
    NP_OB_OSNOV_CL,
    NP_OB_OTZIV_CL,
    NP_OB_RETURN_CL,
    NP_OB_TYPE_CL,
    NP_OB_VOSST_CL,
    NP_OB_WHAT_CL,
    NP_OPF_CL,
    NP_OSN_OSVOB_CL,
    NP_OSN_PRIN_RESH_CL,
    NP_OSNZADER_CL,
    NP_RESULT_RASSLED_CL,
    NP_SPEC_SUBJECT_CL,
    NP_SPOSOB_UKR_PR_CL,
    NP_STATUS_CL,
    NP_SUD_TYPE_CL,
    NP_SUDIM_CL,
    NP_UDOST_TYPE_CL,
    NP_SUD_RESHEN_TYPE_CL,
    NP_RESHEN_CL,
    NP_OSN_PRED_DELA_CL,
];

export const NADZOR: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'nadzor',
    title: 'Надзор',
    visible: true,
    apiInstance: 'nadzor',
    iconName: 'eos-icon-review-blue'
});
