export interface BtnAction {
    buttons: BtnActionFields[];
    moreButtons: BtnActionFields[];
    moreButtonCheck: BtnMoreAction;
}

export interface BtnActionFields {
    name: string;
    title: string;
    disabledClass: string;
    enableClass: string;
    tooltip?: string;
    disabled: boolean;
    activeClass?: string;
    activeBtnClass: string;
    isActive: boolean;
}

export interface BtnMoreAction {
    check: boolean;
    activeClass: string;
    notActiveClass: string;
}
