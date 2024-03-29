import {NP_UDOST_TYPE_CL} from './udost-type.consts';
import {NP_ADDRESS_VID_CL} from './address-vid.consts';
import {NP_CODEX_TYPE_CL} from './codex-type.consts';
import {NP_FIG_ROLE_CL} from './fig-role.consts';
import {NP_MERA_OSNOV_CL} from './mera-osnov.consts';
import {NP_MERA_REAGIR_CL} from './mera-reagir.consts';
import {NP_MERA_TYPE_CL} from './mera-type.consts';
import {NP_NAKAZ_TYPE_CL} from './nakaz-type.consts';
import {NP_NARUSHEN_CL} from './narushen.consts';
import {NP_NEZ_METOD_RASSLED_CL} from './nez-metod-rassled.consts';
import {NP_OB_MOTIV_CL} from './ob-motiv.consts';
import {NP_OB_NOMOVE_CL} from './ob-nomove.consts';
import {NP_OB_OSNOV_CL} from './ob-osnov.consts';
import {NP_OB_OTZIV_CL} from './ob-otziv.consts';
import {NP_OB_RETURN_CL} from './ob-return.consts';
import {NP_OB_TYPE_CL} from './ob-type.consts';
import {NP_OB_VOSST_CL} from './ob-vosst.consts';
import {NP_OB_WHAT_CL} from './ob-what.consts';
import {NP_OPF_CL} from './org-prav-form.consts';
import {NP_OSN_OSVOB_CL} from './osn-osvob.consts';
import {NP_OSN_PRIN_RESH_CL} from './osn-prin-resh.consts';
import {NP_OSNZADER_CL} from './osnzader.consts';
import {NP_RESULT_RASSLED_CL} from './result-rassled.consts';
import {NP_SPEC_SUBJECT_CL} from './spec-subject.consts';
import {NP_SPOSOB_UKR_PR_CL} from './sposob-ukr-pr.consts';
import {NP_STATUS_CL} from './status.consts';
import {NP_SUD_TYPE_CL} from './sud-type.consts';
import {NP_SUDIM_CL} from './sudim.consts';
import {IDictionaryDescriptor} from '../../../interfaces';
import {LINEAR_TEMPLATE} from '../_linear-template';
import {NP_SUD_RESHEN_TYPE_CL} from './reshen-suda.const';
import {NP_RESHEN_CL} from './reshen.consts';
import {NP_OSN_PRED_DELA_CL} from './osn-pred-dela';
import { Features } from '../../../../eos-dictionaries/features/features-current.const';
import { EOSDICTS_VARIANT } from '../../../../eos-dictionaries/features/features.interface';



export const NADZORDICTIONARIES_LINEAR = [
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
];

export const NADZORDICTIONARIES_TREE = [
    NP_SUD_RESHEN_TYPE_CL,
    NP_RESHEN_CL,
    NP_OSN_PRED_DELA_CL,
];

export const NADZOR_DICTIONARIES = NADZORDICTIONARIES_LINEAR . concat(NADZORDICTIONARIES_TREE);

export const NADZOR_FOLDER: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'nadzor',
    isFolder: true,
    title: 'Справочники Надзора',
    visible: Features.cfg.variant === EOSDICTS_VARIANT.Nadzor,
    apiInstance: 'nadzor',
    iconName: 'eos-icon-review-blue'
});
