export class DGTplElement {
    key: string;
    title: string;
    isNotUnique?: boolean;
}
export const DG_TPL_GRP_IDX: DGTplElement = { key: '{1}', title: 'Индекс группы документов' };
export const DG_TPL_NUMBER: DGTplElement = { key: '{2}', title: 'Порядковый номер' };
export const DG_TPL_FOLDER_IDX: DGTplElement = { key: '{3}', title: 'Индекс дела по номенклатуре' };
export const DG_TPL_SIGANTORY_IDX: DGTplElement = { key: '{4}', title: 'Индекс лица, подписавшего документ' };
export const DG_TPL_DEP_IDX: DGTplElement = { key: '{5}', title: 'Индекс подразделения исполнителя' };
export const DG_TPL_PREFIX: DGTplElement = { key: '{6}', title: 'Префикс обращений граждан' };
export const DG_TPL_ACCESS_IDX: DGTplElement = { key: '{7}', title: 'Индекс грифа доступа' };
export const DG_TPL_YEAR: DGTplElement = { key: '{8}', title: 'Год регистрации документа' };
export const DG_TPL_LINK_IDX: DGTplElement = { key: '{9}', title: 'Индекс связки' };
export const DG_TPL_LINKED_DOC_REG_NUMBER: DGTplElement = { key: '{A}', title: 'Рег. № связанного документа' };
export const DG_TPL_LINKED_DOC_NUMBER: DGTplElement = { key: '{B}', title: 'Порядковый номер связанного документа' };
export const DG_TPL_RK_NUMBER: DGTplElement = { key: '{C}', title: 'Порядковый номер в пределах связанной РК' };
export const DG_TPL_NUM_NP: DGTplElement = { key: '{N}', title: 'Номер НП' };
export const DG_TPL_SEPARATOR1: DGTplElement = { key: '-', title: 'Разделитель', isNotUnique: true };
export const DG_TPL_SEPARATOR2: DGTplElement = { key: '/', title: 'Разделитель', isNotUnique: true };
export const DG_TPL_MANUAL_NUMBER: DGTplElement = { key: '{@}', title: 'Свободный номер' };
export const DG_TPL_COMB1: DGTplElement = { key: '{@2}', title: 'Сводобный + порядковый номер' };
export const DG_TPL_COMB2: DGTplElement = { key: '{1#}', title: 'Спец. элемент первичного документа' };
export const DG_TPL_COMB3: DGTplElement = { key: '{2#}', title: 'Спец. элемент повторного документа' };
export const DG_TPL_COMB4: DGTplElement = { key: '{3#}', title: 'Специальный элемент ответов' };
export const DG_TPL_NUM_ORG: DGTplElement = { key: '{E}', title: 'Порядковый номер организации - регистратора' };
export const DG_TPL_INDEX: DGTplElement = { key: '{F}', title: 'Индекс организации - регистратора' };


export const VALID_TEMPLATE_EXPR = /\{2|A|B|C|D|E|2#|3#|@}|@2\}/;
export const VALID_PRJ_TEMPLATE_EXPR = /\{2|@}|@2\}/;
export const SINGLE_TEMPLATE_ITEM_EXPR = /\{@}|2#|3#\}/;
export const ORDER_NUM_TEMPLATE_ITEM_EXPR = /\{2|@2|E\}/;

export const DOC_TEMPLATE_ELEMENTS = [
    DG_TPL_GRP_IDX,
    DG_TPL_NUMBER,
    DG_TPL_FOLDER_IDX,
    DG_TPL_SIGANTORY_IDX,
    DG_TPL_DEP_IDX,
    DG_TPL_PREFIX,
    DG_TPL_ACCESS_IDX,
    DG_TPL_YEAR,
    DG_TPL_LINK_IDX,
    DG_TPL_LINKED_DOC_REG_NUMBER,
    DG_TPL_LINKED_DOC_NUMBER,
    DG_TPL_RK_NUMBER,
    DG_TPL_NUM_NP,
    DG_TPL_SEPARATOR1,
    DG_TPL_SEPARATOR2,
    DG_TPL_MANUAL_NUMBER,
    DG_TPL_COMB1,
    DG_TPL_COMB2,
    DG_TPL_COMB3,
    DG_TPL_COMB4,
    DG_TPL_NUM_ORG,
    DG_TPL_INDEX
];

export const PRJ_TEMPLATE_ELEMENTS = [
    DG_TPL_GRP_IDX,
    DG_TPL_NUMBER,
    DG_TPL_DEP_IDX,
    DG_TPL_ACCESS_IDX,
    DG_TPL_SEPARATOR1,
    DG_TPL_SEPARATOR2,
    DG_TPL_MANUAL_NUMBER,
    DG_TPL_COMB1,
];
