import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';

export interface IConfirmWindow {
    title: string;
    body: string;
    okTitle: string;
    cancelTitle: string;
    confirmDisabled?: boolean;
    typeIcon?: string;
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
    typeIcon?: string;

    readonly confirmEvt: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public modalRef: BsModalRef, private modalService: BsModalService) {
        this.modalService.onHide.subscribe((_evt) => {
            this.confirmEvt.emit(undefined);
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
