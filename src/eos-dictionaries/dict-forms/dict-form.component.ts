import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces/index';
import { Component, HostListener, OnDestroy } from '@angular/core';
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
// import { UUID } from 'angular2-uuid';


@Component({
    selector: 'eos-dict-form',
    templateUrl: 'dict-form.component.html',
    // styleUrls: ['./dict-form.component.scss']
})
export class DictFormComponent implements CanDeactivateGuard, OnDestroy {
    isChanged = false;
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
            // this.nodeId = params.nodeId;
            this.selfLink = this._router.url;
            // tabNum = (toNumber(params.tabNum));
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
        if (this.isChanged) {
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

    // forceView() {
    //     if (this._mode === EDIT_CARD_MODES.edit) {
    //         this._openNode(this.node, EDIT_CARD_MODES.view);
    //     }
    // }

    // edit() {
    //     const _canEdit = this._preventMultiEdit() && this._preventDeletedEdit();
    //     if (_canEdit) {
    //         this._openNode(this.node, EDIT_CARD_MODES.edit);
    //     }
    // }

    close() {
        const url = this._storageSrv.getItem(RECENT_URL);
        if (url) {
            this.goTo(url);
        } else {
            const backUrl = ['spravochniki'];
            this._router.navigate(backUrl);
        }
    }


    cancel(): void {
        this.isChanged = false;
        /* _askForSaving fired on route change */
        // this._openNode(this.node, EDIT_CARD_MODES.view);
    }

    recordChanged(isChanged: boolean) {
        this.isChanged = isChanged;
        // this.isChanged = this._dictSrv.isDataChanged(this.nodeData, this._originalData);
    }

    // next() {
    //     if (this.nodeIndex < this.nodes.length - 1) {
    //         this.nodeIndex++;
    //         this._openNode(this.nodes[this.nodeIndex]);
    //     }
    // }

    // prev() {
    //     if (this.nodeIndex > 0) {
    //         this.nodeIndex--;
    //         this._openNode(this.nodes[this.nodeIndex]);
    //     }
    // }

    // save(): void {
    //     const _data = this.cardEditRef.getNewData();
    //     this._confirmSave(_data)
    //         .then((res: boolean) => {
    //             if (res) {
    //                 this.disableSave = true;
    //                 this._save(_data)
    //                     .then((node: EosDictionaryNode) => this._afterSaving(node));
    //             }
    //          });
    // }

    // disManager(mod: boolean, tooltip: any): boolean {
    //     if (mod) {
    //         if (this.isFirst || !this.node.parent) {
    //             tooltip.hide();
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     } else {
    //         if (this.isLast || !this.node.parent) {
    //             tooltip.hide();
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
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

        // if (this._dictSrv.currentDictionary.descriptor.editOnlyNodes !== undefined) {
        //     if (this._dictSrv && this.node) {
        //         if (!(this._dictSrv.currentDictionary.descriptor.editOnlyNodes && this.node && this.node.isNode)) {
        //             return false;
        //         }
        //     }
        // }
        // return (this.node && !this.node.updating);
    }

    private _init() {
        this.nextRoute = this._router.url;
    }



    private _askForSaving(): Promise<boolean> {
        if (this.isChanged) {
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

    // private _confirmSave(data): Promise<boolean> {
    //     // return this._dictSrv.currentDictionary.descriptor.confirmSave(data, this._confirmSrv);
    // }

    // private _save(data: any): Promise<any> {
    //     return this._dictSrv.updateNode(this.node, data)
    //         .then((node) => this._afterUpdating(node))
    //         .catch((err) => {
    //             if (err === 'cancel' && this.cardEditRef.dictionaryId === 'reestrtype') {
    //                 const oldDelivery = this.cardEditRef.data.rec._orig['ISN_DELIVERY'];
    //                 this.cardEditRef.inputs['rec.ISN_DELIVERY'].value = oldDelivery;
    //                 this.cardEditRef.newData.rec['ISN_DELIVERY'] = oldDelivery;
    //                 this.cardEditRef.form.controls['rec.ISN_DELIVERY'].setValue(oldDelivery, this.cardEditRef.inputs['rec.ISN_DELIVERY'].options);
    //                 return null;
    //             } else if (err === 'cancel') {
    //                 return null;
    //             }
    //             this._errHandler(err);
    //         });
    // }

    // private _afterSaving(node: EosDictionaryNode) {
    //     if (node) {
    //         this._initNodeData(node);
    //         this.cancel();
    //     }
    //     this.disableSave = false;
    // }

    // private _afterUpdating(node: EosDictionaryNode): EosDictionaryNode {
    //     if (node) {
    //         node.data['updateTrules'] = [];
    //         this.recordChanged(node.data);
    //         this.isChanged = false;
    //         this._msgSrv.addNewMessage(SUCCESS_SAVE);
    //         this._deskSrv.addRecentItem({
    //             url: this._router.url,
    //             title: node.title,
    //             iconName: '',
    //         });
    //         this._clearEditingCardLink();
    //     } else {
    //         this._msgSrv.addNewMessage(WARN_SAVE_FAILED);
    //     }
    //     return node;
    // }


    // private _setEditingCardLink() {
    //     this.getLastEditedCard();
    //     if (!this.lastEditedCard) {
    //         this.lastEditedCard = {
    //             'id': this.nodeId,
    //             'title': this.nodeName,
    //             'link': this._makeUrl(this.nodeId, EDIT_CARD_MODES.edit),
    //             // uuid: this._uuid
    //         };
    //         // console.log('this.nodeId', this.nodeId);
    //         this._storageSrv.setItem(LS_EDIT_CARD, this.lastEditedCard, true);
    //     }
    // }

    // private _clearEditingCardLink(): void {
    //     if (this.lastEditedCard && this.lastEditedCard.id === this.nodeId) {
    //         this.lastEditedCard = null;
    //         this._storageSrv.removeItem(LS_EDIT_CARD);
    //     }
    // }

    // private getLastEditedCard() {
    //     this.lastEditedCard = this._storageSrv.getItem(LS_EDIT_CARD);
    // }

    // private _errHandler(err) {
    //     const errMessage = err.message ? err.message : err;
    //     this._msgSrv.addNewMessage({
    //         type: 'danger',
    //         title: 'Ошибка операции',
    //         msg: errMessage
    //     });
    //     return null;
    // }

}
