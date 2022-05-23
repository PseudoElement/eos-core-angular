import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';


export interface IConfirmButton {
    title: string;
    result: number;
    isDefault?: boolean;
}

export interface IConfirmWindow2 {
    title: string;
    body: string;
    bodyBeforeList?: string;
    bodyList?: string[]; // if set, add <ul>/<li> list with array of string
    bodyAfterList?: string;
    buttons: IConfirmButton[];
    confirmDisabled?: boolean;
    manualCR?: boolean;
    typeIcon?: string;
}

export interface IConfirmWindow2Content extends IConfirmWindow2 {
    readonly confirmEvent: EventEmitter<IConfirmButton>;
}

@Component({
    templateUrl: 'confirm-window2.component.html',
})

export class ConfirmWindow2Component implements IConfirmWindow2Content {

    buttons: IConfirmButton [];
    title: string;
    body: string;
    bodyList?: string[];
    bodyBeforeList?: string;
    bodyAfterList?: string;
    okTitle: string;
    cancelTitle: string;
    manualCR?: boolean;
    confirmDisabled: boolean;
    typeIcon?: string;

    readonly confirmEvent: EventEmitter<IConfirmButton> = new EventEmitter<IConfirmButton>();

    constructor(public modalRef: BsModalRef, private modalService: BsModalService) {
        this.modalService.onHide.subscribe((_evt) => {
           this.confirmEvent.emit(undefined);
        });
    }

    getColor() {
        switch (this.typeIcon) {
            case 'success':
                return '#8bc34a';
            case 'warning':
                return '#fdc309';
            case 'danger':
                return '#f44336';
            default:
                return '#fdc309';
        }
    }
    getIcon() {
        switch (this.typeIcon) {
            case 'success':
                return 'eos-icon-checkbox-white';
            case 'warning':
                return 'eos-icon-alert-white';
            case 'danger':
                return 'eos-icon-close-white';
            default:
                return 'eos-icon-alert-white';
        }
    }
    click(button: IConfirmButton) {
        this.confirmEvent.emit(button);
        this._hide();
    }

    close() {
        this.confirmEvent.emit(null);
        this._hide();
    }

    private _hide() {
        if (this.modalRef) {
            this.modalRef.hide();
        }
    }
}
