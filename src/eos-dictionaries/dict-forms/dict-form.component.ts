import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import { Component, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// import {toNumber} from 'ngx-bootstrap/timepicker/timepicker.utils';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { CanDeactivateGuard } from '../../app/guards/can-deactivate.guard';
import { EosStorageService } from '../../app/services/eos-storage.service';

import { EosDictService } from '../services/eos-dict.service';


import { RECENT_URL } from '../../app/consts/common.consts';

import { CONFIRM_SAVE_ON_LEAVE } from '../consts/confirm.consts';

import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service';
import { EDIT_CARD_MODES } from 'eos-dictionaries/card/card.component';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { IDictFormBase } from './dict-form-base.interface';
@Component({
    selector: 'eos-dict-form',
    templateUrl: 'dict-form.component.html',
    // styleUrls: ['./dict-form.component.scss']
})
export class DictFormComponent implements CanDeactivateGuard, OnDestroy {

    @ViewChild('formElement') formElement: IDictFormBase;

    // isChanged = false;
    fieldsDescription: any = {};

    dictionaryId: string;

    dictDescr: IDictionaryDescriptor;

    closeRedirect: string; /* URL where to redirect after the cross is clicked */

    editMode: boolean;

    selfLink = null;

    disableSave = false;

    dutysList: string[] = [];
    fullNamesList: string[] = [];
    _mode: EDIT_CARD_MODES;


    private nextRoute: string;

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _storageSrv: EosStorageService,
        private _dictSrv: EosDictService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _eaps: EosAccessPermissionsService,
        private _confirmSrv: ConfirmWindowService,
    ) {
        let tabNum = 0;
        this._mode = EDIT_CARD_MODES.edit;
        this._route.params.subscribe((params) => {
            this.dictionaryId = params.dictionaryId;
            this.dictDescr = this._dictSrv.getDescr(params.dictionaryId);
            this.selfLink = this._router.url;
            tabNum = +params.tabNum;
            this._init();
        });

        this._dictSrv.currentList$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((nodes) => {
                // this.nodes = nodes.filter((node) => !node.isDeleted);
            });

        this._dictSrv.currentTab = tabNum;
    }


    @HostListener('window:beforeunload', ['$event'])
    canWndUnload(evt: BeforeUnloadEvent): any {
        if (this.editMode) {
            /* clean link on close or reload */
            /* cann't handle user answer */
            // this._clearEditingCardLink();
        }
        if (this.formElement.hasChanges()) {
            evt.returnValue = CONFIRM_SAVE_ON_LEAVE.body;
            return false;
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

        if (this.editMode) {
            // this._clearEditingCardLink();
        }
    }

    getTitle(): string {
        return this.dictDescr ? this.dictDescr.title : '';
    }

    turnOffSave(val: boolean) {
        this.disableSave = val;
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

    // cancel(): void {
    //     this.isChanged = false;
    //     /* _askForSaving fired on route change */
    //     // this._openNode(this.node, EDIT_CARD_MODES.view);
    // }

    // recordChanged(isChanged: boolean) {
    //     this.isChanged = isChanged;
    //     // this.isChanged = this._dictSrv.isDataChanged(this.nodeData, this._originalData);
    // }

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

    isEditEnabled(): boolean {
        if (this._eaps.isAccessGrantedForDictionary(this.dictionaryId,
            this._dictSrv.treeNodeIdByDict(this._dictSrv.currentDictionary.id)) < APS_DICT_GRANT.readwrite) {
            return false;
        }
    }

    private _init() {
        this.nextRoute = this._router.url;
    }

    private _askForSaving(): Promise<boolean> {
        if (this.formElement.hasChanges()) {
            return this._confirmSrv.confirm(Object.assign({}, CONFIRM_SAVE_ON_LEAVE,
                { confirmDisabled: this.disableSave }))
                .then((doSave) => {
                    // if (doSave) {
                        // const _data = this.cardEditRef.getNewData();
                        // return this._save(_data)
                        //     .then((node) => !!node);
                    // } else {
                        return true;
                    // }
                })
                .catch(() => {
                    // console.log('cancel reason', err);
                    return false;
                });
        } else {
            return Promise.resolve(true);
        }
    }


}
