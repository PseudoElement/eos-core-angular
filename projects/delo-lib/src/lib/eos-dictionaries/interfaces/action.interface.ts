import { APS_DICT_GRANT } from '../../eos-dictionaries/services/eos-access-permissions.service';
export enum E_RECORD_ACTIONS {
    add,
    edit,
    view,
    remove,
    removeHard,
    showDeleted,
    userOrder,
    userOrderCut,
    userOrderPaste,
    sevSyncDicts,
    sevClearIdentityCodes,
    moveUp,
    moveDown,
    import,
    export,
    markRecords,
    unmarkRecords,
    navigateUp,
    navigateDown,
    restore,
    importPhotos,
    createRepresentative,
    tableCustomization,
    showAllSubnodes,
    additionalFields,
    counterDepartmentMain,
    counterDepartment,
    counterDepartmentRK,
    counterDepartmentRKPD,
    counterDocgroup,
    counterDocgroupRKPD,
    CloseSelected,
    OpenSelected,
    AdvancedCardRK,
    prjDefaultValues,
    copyPropertiesFromParent,
    copyProperties,
    copyNodes,
    pasteNodes,
    certifUC,
    downloadFile,
    departmentCalendar,
    importEDS,
    cut,
    combine,
    uncheckNewEntry,
    dopRequisites,
    defaultCollision,
    protViewSecurity,
    uniqueIndexDel,
    paste,
    copy,
    printNomenc,
    renameBaseDepartment,
    // createRepresentative,
    // slantForForms,
    /* to be extended */
}

export enum E_ACTION_GROUPS {
    common,
    item,
    group
}

export interface IAction {
    type: E_RECORD_ACTIONS;
    group: E_ACTION_GROUPS;
    title: string;
    hint: string;
    iconClass: string;
    disabledIconClass: string;
    hoverIconClass: string;
    activeIconClass: string;
    buttonClass: string;
    accessNeed: APS_DICT_GRANT;
    iconText?: string; // Дополнительный текст к иконке (часть кнопки)

}

export interface IActionButton extends IAction {
    isActive: boolean;  // нажата \ отжата
    enabled: boolean;   // доступна для нажатия
    show: boolean;      // видимость
}

export interface IActionUpdateOptions {
    // markList: EosDictionaryNode[];
    listHasItems: boolean;
    listHasOnlyOne: boolean;
    listHasDeleted: boolean;
    listHasSelected: boolean;
    dictGrant: APS_DICT_GRANT;
}

export interface IActionEvent {
    action: E_RECORD_ACTIONS;
    params?: any;
}
