import { EventEmitter } from '@angular/core';

export interface IConfirmWindow {
    title: string;
    body: string;
    okTitle: string;
    cancelTitle: string;
    manualCR?: boolean;
}

export interface IConfirmWindowContent extends IConfirmWindow {
    readonly confirmEvt: EventEmitter<boolean>;
}
