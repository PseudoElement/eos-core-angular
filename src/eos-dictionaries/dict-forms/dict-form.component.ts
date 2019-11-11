import { Component, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CanDeactivateGuard } from '../../app/guards/can-deactivate.guard';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { EosDictService } from '../services/eos-dict.service';
import { RECENT_URL } from '../../app/consts/common.consts';
import { IDictFormBase } from './dict-form-base.interface';
import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-tooltip.service';
import { MESSAGE_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';
@Component({
    selector: 'eos-dict-form',
    templateUrl: 'dict-form.component.html',
    // styleUrls: ['./dict-form.component.scss']
})
export class DictFormComponent implements CanDeactivateGuard, OnDestroy {

    @ViewChild('formElement') formElement: IDictFormBase;
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    dictionaryId: string;
    editMode: boolean;
    title: string;

    private nextRoute: string;
    private _dictDescr: IDictionaryDescriptor;

    constructor(
        private _storageSrv: EosStorageService,
        private _dictSrv: EosDictService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
        this._route.params.subscribe((params) => {
            this.dictionaryId = params.dictionaryId;
            this._dictDescr = this._dictSrv.getDescr(params.dictionaryId);
            this.title = this._dictDescr ? this._dictDescr.title : '';
            this._init();
        });

    }


    @HostListener('window:beforeunload', ['$event'])
    canWndUnload(evt: BeforeUnloadEvent): any {
        if (this.editMode) {
            /* clean link on close or reload */
            /* cann't handle user answer */
            // this._clearEditingCardLink();
        }
        if (this.formElement.hasChanges()) {
            evt.returnValue = MESSAGE_SAVE_ON_LEAVE;
            return false;
        }
    }

    ngOnDestroy() {
    }

    close() {
        const url = this._storageSrv.getItem(RECENT_URL);
        if (url) {
            this.goTo(url);
        } else {
            const backUrl = ['spravochniki'];
            this._router.navigate(backUrl);
        }
    }

    goTo(url: string): void {
        if (url) {
            this._router.navigateByUrl(url);
        } else {
            this._router.navigate([this.nextRoute]);
        }
    }

    canDeactivate(_nextState?: any): boolean | Promise<boolean> {
        return this._askForSaving();
    }

    private _init() {
        this.nextRoute = this._router.url;
    }

    private _askForSaving(): Promise<boolean> {
        if (this.formElement.hasChanges()) {
            return new Promise((res, rej) => {
                if (confirm(MESSAGE_SAVE_ON_LEAVE)) {
                    return res(true);
                } else {
                    return res(false);
                }
            });
        } else {
            return Promise.resolve(true);
        }
    }
    // private _askForSaving(): Promise<boolean> {
    //     if (this.formElement.hasChanges()) {
    //         return this._confirmSrv.confirm2(Object.assign({}, CONFIRM_SAVE_ON_LEAVE2,
    //             { confirmDisabled: false }))
    //             .then((doSave) => {
    //                 if (doSave === null) {
    //                     return false;
    //                 }
    //                 if (doSave.result === 1) {
    //                     return this.formElement.doSave();
    //                 } else {
    //                     return true;
    //                 }
    //             })
    //             .catch(() => {
    //                 return false;
    //             });
    //     } else {
    //         return Promise.resolve(true);
    //     }
    // }


}
