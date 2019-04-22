import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';

export interface IConfirmWindow {
    title: string;
    body: string;
    okTitle: string;
    cancelTitle: string;
    confirmDisabled?: boolean;
}

export interface IConfirmWindowContent extends IConfirmWindow {
    readonly confirmEvt: EventEmitter<boolean>;
}

@Component({
    templateUrl: 'confirm-window.component.html',
})
export class ConfirmWindowComponent implements IConfirmWindowContent {
    title: string;
    body: string;
    okTitle: string;
    cancelTitle: string;
    manualCR?: boolean;
    confirmDisabled: boolean;

    readonly confirmEvt: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public modalRef: BsModalRef, private modalService: BsModalService) {
        this.modalService.onHide.subscribe((_evt) => {
            this.confirmEvt.emit(undefined);
        });
    }

    confirm() {
        this.confirmEvt.emit(true);
        this._hide();
    }

    cancel() {
        this.confirmEvt.emit(false);
        this._hide();
    }

    close() {
        this.confirmEvt.emit(false);
        this._hide();
    }

    private _hide() {
        if (this.modalRef) {
            this.modalRef.hide();
        }
    }
}
