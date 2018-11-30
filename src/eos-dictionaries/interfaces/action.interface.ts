export enum E_RECORD_ACTIONS {
    add,
    edit,
    view,
    remove,
    removeHard,
    showDeleted,
    userOrder,
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
    additionalFields
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
}

export interface IActionButton extends IAction {
    isActive: boolean;
    enabled: boolean;
    show: boolean;
}

export interface IActionEvent {
    action: E_RECORD_ACTIONS;
    params?: any;
}
