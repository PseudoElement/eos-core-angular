import { DGTplElement, DGTplElementPosition } from '../../../eos-dictionaries/helpers/numcreation-template.interface';


const BASE_ENABLE_EXP = /^((?!(\{(@2|@|2#|3#|1#)\})).)*$/; // если не содержит {@2}, {@}, {2#}, {3#}
const ONLY_IF_EMPTY = /^$/; // только в пустой шаблон

export const DG_TPL_GRP_IDX: DGTplElement = { key: '{1}', title: 'Индекс группы документов', enabledMask: BASE_ENABLE_EXP };
export const DG_TPL_NUMBER: DGTplElement = { key: '{2}', title: 'Порядковый номер', enabledMask: BASE_ENABLE_EXP };
export const DG_TPL_FOLDER_IDX: DGTplElement = { key: '{3}', title: 'Индекс дела по номенклатуре', enabledMask: BASE_ENABLE_EXP };
export const DG_TPL_SIGANTORY_IDX: DGTplElement = { key: '{4}', title: 'Индекс лица, подписавшего документ', possibleRKType: /^[3]$/, enabledMask: BASE_ENABLE_EXP};
export const DG_TPL_DEP_IDX: DGTplElement = { key: '{5}', title: 'Индекс подразделения исполнителя', possibleRKType: /^[3]$/, enabledMask: BASE_ENABLE_EXP};
export const DG_TPL_PREFIX: DGTplElement = { key: '{6}', title: 'Префикс обращений граждан', possibleRKType: /^[2]$/, enabledMask: BASE_ENABLE_EXP};
export const DG_TPL_ACCESS_IDX: DGTplElement = { key: '{7}', title: 'Индекс грифа доступа', enabledMask: BASE_ENABLE_EXP};
export const DG_TPL_YEAR: DGTplElement = { key: '{8}', title: 'Год регистрации документа', enabledMask: BASE_ENABLE_EXP };
export const DG_TPL_LINK_IDX: DGTplElement = { key: '{9}', title: 'Индекс связки', enabledMask: BASE_ENABLE_EXP, };
export const DG_TPL_LINK_IDX_WL: DGTplElement = Object.assign({}, DG_TPL_LINK_IDX, {
    infoR: true,
    additionalControls: [{
        key: '',
        title: 'Связки',
        type: 'link-list',
        class: '',
        storeInInfo: 'L',
    }],
});
export const DG_TPL_LINKED_DOC_REG_NUMBER: DGTplElement = { key: '{A}', title: 'Рег. № связанного документа', enabledMask: BASE_ENABLE_EXP, };
export const DG_TPL_LINKED_DOC_REG_NUMBER_WRL: DGTplElement = Object.assign({}, DG_TPL_LINKED_DOC_REG_NUMBER, {
    infoR: true,
    infoL: true,
    additionalControls: [{
        key: '',
        title: 'Признак обязательности',
        // isToggleR: true,
        type: 'checkbox',
        class: 'checkbox checkbox-inline',
        storeInInfo: 'R',
    },
    {
        key: '',
        title: 'Связки',
        type: 'link-list',
        class: '',
        storeInInfo: 'L',
    }
    ],
});
export const DG_TPL_LINKED_DOC_NUMBER: DGTplElement = {key: '{B}', title: 'Порядковый номер связанного документа', enabledMask: BASE_ENABLE_EXP, };
export const DG_TPL_LINKED_DOC_NUMBER_WRL: DGTplElement = Object.assign({}, DG_TPL_LINKED_DOC_NUMBER, {

    infoR: true,
    infoL: true,
    additionalControls: [{
        key: '',
        title: 'Признак обязательности',
        // isToggleR: true,
        type: 'checkbox',
        class: 'checkbox checkbox-inline',
        storeInInfo: 'R',
    },
    {
        key: '',
        title: 'Связки',
        type: 'link-list',
        class: '',
        storeInInfo: 'L',
    }
    ],
});
export const DG_TPL_RK_NUMBER: DGTplElement = { key: '{C}', title: 'Порядковый номер в пределах связанной РК', enabledMask: BASE_ENABLE_EXP };
export const DG_TPL_RK_NUMBER_WRL: DGTplElement = Object.assign({}, DG_TPL_RK_NUMBER, {

    infoR: true,
    infoL: true,
    additionalControls: [{
        key: '',
        title: 'Признак обязательности',
        // isToggleR: true,
        type: 'checkbox',
        class: 'checkbox checkbox-inline',
        storeInInfo: 'R',
    },
    {
        key: '',
        title: 'Связки',
        type: 'link-list',
        class: '',
        storeInInfo: 'L',
    }
    ],
});
export const DG_TPL_D: DGTplElement = { key: '{D}', title: 'Исх. № корреспондента', enabledMask: BASE_ENABLE_EXP };
export const DG_TPL_NUM_NP: DGTplElement = { key: '{N}', title: 'Номер НП', possibleRKType: /^[3]$/, enabledMask: BASE_ENABLE_EXP };
export const DG_TPL_SEPARATOR: DGTplElement = { key: '-', title: 'Разделитель', isNotUnique: true, enabledMask: BASE_ENABLE_EXP };
export const DG_TPL_SEPARATOR2: DGTplElement = { key: '/', title: 'Разделитель', isNotUnique: true, enabledMask: BASE_ENABLE_EXP };
export const DG_TPL_MANUAL_NUMBER: DGTplElement = { key: '{@}', title: 'Свободный номер', enabledMask: ONLY_IF_EMPTY, };
export const DG_TPL_MANUAL_NUMBER_DOCCB: DGTplElement = Object.assign({}, DG_TPL_MANUAL_NUMBER, {
    additionalControls: [{
        key: 'COPY_NUMBER_FLAG',
        title: 'Копировать №',
        type: 'checkbox',
        class: 'checkbox checkbox-inline',
        valueIfUnused: 0,
        storeInInfo: 'R',
}], });
export const DG_TPL_MANUAL_NUMBER_PRJCB = Object.assign({}, DG_TPL_MANUAL_NUMBER, {
    additionalControls: [{
        key: 'COPY_NUMBER_FLAG_PRJ',
        title: 'Копировать №',
        type: 'checkbox',
        class: 'checkbox checkbox-inline',
        valueIfUnused: 0,
        storeInInfo: 'R',
    }],
});

export const DG_TPL_COMB1: DGTplElement = { key: '{@2}', title: 'Свободный + порядковый номер', enabledMask: ONLY_IF_EMPTY };

export const DG_TPL_COMB2: DGTplElement = {
    key: '{1#}',
    title: 'Спец. элемент первичного документа',
    enabledMask: BASE_ENABLE_EXP,
    onlyPos: DGTplElementPosition.last,
};
export const DG_TPL_COMB3: DGTplElement = { key: '{2#}', title: 'Спец. элемент повторного документа', enabledMask: ONLY_IF_EMPTY };
export const DG_TPL_COMB4: DGTplElement = { key: '{3#}', title: 'Специальный элемент ответов', enabledMask: ONLY_IF_EMPTY };
export const DG_TPL_NUM_ORG: DGTplElement = { key: '{E}', title: 'Порядковый номер организации - регистратора', enabledMask: BASE_ENABLE_EXP };
export const DG_TPL_INDEX: DGTplElement = { key: '{F}', title: 'Индекс организации - регистратора', enabledMask: BASE_ENABLE_EXP };
