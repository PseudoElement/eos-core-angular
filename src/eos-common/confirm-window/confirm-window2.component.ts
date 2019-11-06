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
    buttons: IConfirmButton [];
    confirmDisabled?: boolean;
    manualCR?: boolean;
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

    readonly confirmEvent: EventEmitter<IConfirmButton> = new EventEmitter<IConfirmButton>();

    constructor(public modalRef: BsModalRef, private modalService: BsModalService) {
        this.modalService.onHide.subscribe((_evt) => {
           this.confirmEvent.emit(undefined);
        });
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
