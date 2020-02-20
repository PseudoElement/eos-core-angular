import { DGTplElement } from 'eos-dictionaries/helpers/numcreation-template.interface';
import {
    DG_TPL_GRP_IDX, DG_TPL_NUMBER, DG_TPL_FOLDER_IDX, DG_TPL_SIGANTORY_IDX, DG_TPL_DEP_IDX,
    DG_TPL_PREFIX, DG_TPL_ACCESS_IDX, DG_TPL_YEAR,
    DG_TPL_RK_NUMBER, DG_TPL_D, DG_TPL_NUM_NP, DG_TPL_SEPARATOR1, DG_TPL_SEPARATOR2, DG_TPL_COMB1,
    DG_TPL_COMB2, DG_TPL_COMB3, DG_TPL_COMB4, DG_TPL_NUM_ORG, DG_TPL_INDEX, DG_TPL_MANUAL_NUMBER_DOCCB, DG_TPL_MANUAL_NUMBER_PRJCB, DG_TPL_LINKED_DOC_REG_NUMBER_WRL, DG_TPL_LINK_IDX_WL, DG_TPL_LINKED_DOC_NUMBER_WRL
} from '../docgroups/docgroup-template-base.consts';

export const DOC_TEMPLATE_ELEMENTS_CB: DGTplElement[] = [
    DG_TPL_GRP_IDX,
    DG_TPL_NUMBER,
    DG_TPL_FOLDER_IDX,
    DG_TPL_SIGANTORY_IDX,
    DG_TPL_DEP_IDX,
    DG_TPL_PREFIX,
    DG_TPL_ACCESS_IDX,
    DG_TPL_YEAR,
    DG_TPL_LINK_IDX_WL,
    DG_TPL_LINKED_DOC_REG_NUMBER_WRL,
    DG_TPL_LINKED_DOC_NUMBER_WRL,
    DG_TPL_RK_NUMBER,
    DG_TPL_D,
    DG_TPL_NUM_NP,
    DG_TPL_SEPARATOR1,
    DG_TPL_SEPARATOR2,
    DG_TPL_MANUAL_NUMBER_DOCCB,
    DG_TPL_COMB1,
    DG_TPL_COMB2,
    DG_TPL_COMB3,
    DG_TPL_COMB4,
    DG_TPL_NUM_ORG,
    DG_TPL_INDEX,
].filter(el => (-1 !== [
    '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}', '{9}', '{A}',
    '{B}', '{C}', '{D}', /*'{N}',*/ '-', '/', '{@}', '{@2}', '{1#}', '{2#}', '{3#}',
    /*'{E}', '{F}',*/
].findIndex(str => el.key === str)));

export const PRJ_TEMPLATE_ELEMENTS_CB: DGTplElement[] = [
    DG_TPL_GRP_IDX,
    DG_TPL_NUMBER,
    DG_TPL_DEP_IDX,
    DG_TPL_ACCESS_IDX,
    DG_TPL_SEPARATOR1,
    DG_TPL_SEPARATOR2,
    DG_TPL_MANUAL_NUMBER_PRJCB,
    DG_TPL_COMB1,
    DG_TPL_NUM_ORG,
    DG_TPL_INDEX,
].filter(el => (-1 !== [
    '{1}', '{2}', '{5}', '{7}', '-', '/', '{@}', '{@2}', /*'{E}', '{F}'*/
].findIndex(str => el.key === str)));





