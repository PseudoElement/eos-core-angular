export interface BtnAction {
    buttons: BtnActionFields[];
    moreButtons: BtnActionFields[];
}

export interface BtnActionFields {
    name: string;
    title: string;
    disabledClass: string;
    enableClass: string;
    tooltip?: string;
    disabled: boolean;
    activeClass?: string;
}
