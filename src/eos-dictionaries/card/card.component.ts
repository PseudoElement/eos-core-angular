import { Component, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';
// import {toNumber} from 'ngx-bootstrap/timepicker/timepicker.utils';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { CanDeactivateGuard } from '../../app/guards/can-deactivate.guard';
import { EosStorageService } from '../../app/services/eos-storage.service';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';

import { RECENT_URL } from '../../app/consts/common.consts';

import {
    DANGER_NAVIGATE_TO_DELETED_ERROR,
    DANGER_EDIT_DELETED_ERROR,
    SUCCESS_SAVE,
    WARN_SAVE_FAILED
} from '../consts/messages.consts';
import { NAVIGATE_TO_ELEMENT_WARN } from '../../app/consts/messages.consts';
import { CONFIRM_SAVE_ON_LEAVE } from '../consts/confirm.consts';
import { LS_EDIT_CARD } from '../consts/common';

import { CardEditComponent } from 'eos-dictionaries/card-views/card-edit.component';
import { EosDepartmentsService } from '../services/eos-department-service';
import {EosUtils} from '../../eos-common/core/utils';
import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';
import { CONFIRM_SAVE_INVALID } from 'app/consts/confirms.const';
// import { UUID } from 'angular2-uuid';

export enum EDIT_CARD_MODES {
    edit,
    view,
}

/* Object that stores info about the last edited card in the LocalStorage */
export class EditedCard {
    id: string;
    title: string;
    link: string;
    // uuid: string;
}

@Component({
    selector: 'eos-card',
    templateUrl: 'card.component.html',
})
export class CardComponent implements CanDeactivateGuard, OnDestroy {
    node: EosDictionaryNode;
    nodes: EosDictionaryNode[];

    nodeData: any = {};
    isChanged = false;
    fieldsDescription: any = {};

    dictionaryId: string;
    isFirst: boolean;
    isLast: boolean;

    lastEditedCard: EditedCard;
    closeRedirect: string; /* URL where to redirect after the cross is clicked */

    editMode: boolean;

    selfLink = null;

    disableSave = false;

    dutysList: string[] = [];
    fullNamesList: string[] = [];

    @ViewChild('onlyEdit') modalOnlyRef: ModalDirective;
    @ViewChild('cardEditEl') cardEditRef: CardEditComponent;
    /* todo: check tasks for reson
    @HostListener('document:blur')
    private _blur(): boolean {
        return this.canDeactivate();
    }
    */

    get nodeName() {
        let _nodeName = '';
        if (this.node) {
            this.node.getTreeView()
                .forEach((_f) => {
                    _nodeName += _f.value;
                });
        }
        return _nodeName;
    }

    /* private _originalData: any = {}; */
    private nodeId: string;
    // private _uuid: string;

    private _urlSegments: string[];
    private nodeIndex: number = -1;

    private nextRoute: string;

    private _mode: EDIT_CARD_MODES;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _storageSrv: EosStorageService,
        private _confirmSrv: ConfirmWindowService,
        private _dictSrv: EosDictService,
        private _deskSrv: EosDeskService,
        private _msgSrv: EosMessageService,
        private _route: ActivatedRoute,
        private _router: Router,
        private departmentsSrv: EosDepartmentsService,
        private _eaps: EosAccessPermissionsService,
    ) {
        let tabNum = 0;

        this._route.params.subscribe((params) => {
            this.dictionaryId = params.dictionaryId;
            this.nodeId = params.nodeId;
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
                this.nodes = nodes.filter((node) => !node.isDeleted && node.isMarked);
            });

        this._dictSrv.currentTab = tabNum;
    }

    @HostListener('window:beforeunload', ['$event'])
    canWndUnload(evt: BeforeUnloadEvent): any {
        if (this.editMode) {
            /* clean link on close or reload */
            /* cann't handle user answer */
            this._clearEditingCardLink();
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
            this._clearEditingCardLink();
        }
    }

    turnOffSave(val: boolean) {
        this.disableSave = val;
    }

    forceView() {
        if (this._mode === EDIT_CARD_MODES.edit) {
            this._openNode(this.node, EDIT_CARD_MODES.view);
        }
    }

    edit() {
        const _canEdit = this._preventMultiEdit() && this._preventDeletedEdit();
        if (_canEdit) {
            this._dictSrv.editFromForm = true;
            this._openNode(this.node, EDIT_CARD_MODES.edit);
        }
    }

    close() {
        const url = this._storageSrv.getItem(RECENT_URL);
        this._dictSrv.editFromForm = false;
        if (url) {
            this.goTo(url);
        } else {
            const backUrl = (this.node.parent || this.node).getPath();
            if (this.node.dictionaryId === 'cabinet') { // hardcode because of cabinets. sorry :(
                backUrl[1] = 'departments';
                backUrl[2] = this.node.data.rec.DUE;
            }
            this._router.navigate(backUrl);
        }
    }

    getCardTitle() {
        const cardtitle = (this.cardEditRef ? this.cardEditRef.getCardTitle() : '');
        if (cardtitle) {
            return cardtitle;
        } else {
            return this.nodeName;
        }
    }

    cancel(): void {
        this.isChanged = false;

        if (this._dictSrv.editFromForm || (this.nodes && this.nodes.length > 1)) {
            this._openNode(this.node, EDIT_CARD_MODES.view);
        } else {
            this.close();
        }
    }

    recordChanged(isChanged: boolean) {
        this.isChanged = isChanged;
        // this.isChanged = this._dictSrv.isDataChanged(this.nodeData, this._originalData);
    }

    next() {
        if (this.nodeIndex < this.nodes.length - 1) {
            this.nodeIndex++;
            this._openNode(this.nodes[this.nodeIndex]);
        }
    }

    prev() {
        if (this.nodeIndex > 0) {
            this.nodeIndex--;
            this._openNode(this.nodes[this.nodeIndex]);
        }
    }

    save(): void {
        if (this.isSaveDisabled()) {
            this._windowInvalidSave();
            return;
        }
        const _data = this.cardEditRef.getNewData();
        this._confirmSave(_data)
            .then((res: boolean) => {
                if (res) {
                    this.disableSave = true;
                    this._save(_data)
                        .then((node: EosDictionaryNode) => this._afterSaving(node));
                }
             });
    }

    disManager(mod: boolean, tooltip: any): boolean {
        if (mod) {
            if (this.isFirst || !this.node.parent) {
                tooltip.hide();
                return true;
            } else {
                return false;
            }
        } else {
            if (this.isLast || !this.node.parent) {
                tooltip.hide();
                return true;
            } else {
                return false;
            }
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

    isEditEnabled(): boolean {

        if (this._eaps.isAccessGrantedForDictionary(this.dictionaryId,
            this._dictSrv.treeNodeIdByDict(this._dictSrv.currentDictionary.id)) < APS_DICT_GRANT.readwrite) {
            return false;
        }

        if (this._dictSrv.currentDictionary.descriptor.editOnlyNodes !== undefined) {
            if (this._dictSrv && this.node) {
                if (!(this._dictSrv.currentDictionary.descriptor.editOnlyNodes && this.node && this.node.isNode)) {
                    return false;
                }
            }
        }
        return (this.node && !this.node.updating);
    }

    isSaveDisabled(): boolean {
        return /*!this.isChanged ||*/ this.disableSave;
    }

    private _init() {
        this.nextRoute = this._router.url;
        this._urlSegments = this._router.url.split('/');
        this._mode = EDIT_CARD_MODES[this._urlSegments[this._urlSegments.length - 2]];
        this._getNode();
    }

    private _getNode() {
        // console.log('_getNode', this.dictionaryId, this.nodeId);
        return this._dictSrv.getFullNode(this.dictionaryId, this.nodeId)
            .then((node) => {
                if (node) {
                    this._update(node);
                } else if (node === null) {
                    const segments: Array<string> = this._router.url.split('/');
                    this._router.navigate(['spravochniki/' + segments[2]]);
                    this._msgSrv.addNewMessage(NAVIGATE_TO_ELEMENT_WARN);
                }
            });
        // .catch((err) => console.log('getNode error', err));
    }

    private _initNodeData(node: EosDictionaryNode) {
        this.node = node;

        if (this.node) {
            this.fieldsDescription = this.node.getEditFieldsDescription();
            if (this.node.data && this.node.data.printInfo && this.node.data.printInfo._orig) {
                EosUtils.deepUpdate(this.node.data.printInfo._orig, this.node.data.printInfo);
            }
            if (this.node.data && this.node.data.sev && this.node.data.sev._orig) {
                EosUtils.deepUpdate(this.node.data.sev._orig, this.node.data.sev);
            }
            if (this.node.data && this.node.data.CONTACT_List) {
                this.node.data.contact = [];
                for (let i = 0; i < this.node.data.CONTACT_List.length; i++) {
                    const contact = Object.assign({}, node.data.CONTACT_List[i]);
                    contact._orig = {};
                    EosUtils.deepUpdate(contact._orig, node.data.CONTACT_List[i]);
                    // contact._orig.__metadata = node.data.CONTACT_List[i].__metadata;
                    node.data.contact.push(contact);
                }
            }
            this.nodeData = this.node.data; // getEditData();
            // console.log('recived description', this.nodeData);

            if (this.dictionaryId === 'departments' && this.node.data && this.node.data.rec && this.node.data.rec.IS_NODE) {
                this.dutysList = this.departmentsSrv.dutys;
                this.fullNamesList = this.departmentsSrv.fullnames;
            }
        } else {
            this.nodeData = {
                rec: {}
            };
        }
    }

    private _update(node: EosDictionaryNode) {
        let _canEdit: boolean;

        this._initNodeData(node);

        _canEdit = this._mode === EDIT_CARD_MODES.edit &&
            this._preventDeletedEdit() &&
            this._preventMultiEdit();

        if (_canEdit) {
            this._setEditingCardLink();
        }

        this.editMode = _canEdit;
        this._updateBorders();
    }

    private _preventMultiEdit(): boolean {
        /* prevent editing multiple cards */
        this.getLastEditedCard();
        if (this.lastEditedCard && this.lastEditedCard.id !== this.nodeId /* && this.lastEditedCard.uuid !== this._uuid*/) {
            this.modalOnlyRef.show();
            return false;
        }
        return true;
    }

    private _preventDeletedEdit(): boolean {
        if (!this.node.isDeleted) {
            return true;
        } else {
            /* show warn */
            this._msgSrv.addNewMessage(DANGER_EDIT_DELETED_ERROR);
            return false;
        }
    }


    private _updateBorders() {
        this.nodeIndex = this.nodes.findIndex((node) => node.id === this.node.id);
        this.isFirst = this.nodeIndex <= 0;
        this.isLast = this.nodeIndex >= this.nodes.length - 1 || this.nodeIndex < 0;
    }

    private _openNode(node: EosDictionaryNode, forceMode?: EDIT_CARD_MODES) {
        if (node) {
            node.relatedLoaded = false;
            this.goTo(this._makeUrl(node.id, forceMode));
        } else {
            this._msgSrv.addNewMessage(DANGER_NAVIGATE_TO_DELETED_ERROR);
        }
    }

    private _makeUrl(nodeId: string, forceMode?: EDIT_CARD_MODES): string {
        const _url = [].concat([], this._urlSegments);
        _url[_url.length - 3] = nodeId;
        _url[_url.length - 1] = this._dictSrv.currentTab;

        if (forceMode !== undefined && EDIT_CARD_MODES[forceMode]) {
            _url[_url.length - 2] = EDIT_CARD_MODES[forceMode];
        }
        return _url.join('/');
    }

    private _askForSaving(): Promise<boolean> {
        if (this.isChanged) {
            return this._confirmSrv.confirm(Object.assign({}, CONFIRM_SAVE_ON_LEAVE,
                { confirmDisabled: this.disableSave }))
                .then((doSave) => {
                    if (doSave) {
                        const _data = this.cardEditRef.getNewData();
                        return this._save(_data)
                            .then((node) => !!node);
                    } else {
                        return true;
                    }
                })
                .catch(() => {
                    // console.log('cancel reason', err);
                    return false;
                });
        } else {
            return Promise.resolve(true);
        }
    }

    private _confirmSave(data): Promise<boolean> {
        return this._dictSrv.currentDictionary.descriptor.confirmSave(data, this._confirmSrv);
    }

    private _save(data: any): Promise<any> {
        if (!this.isChanged) {
            return Promise.resolve(this.node);
        }

        return this._dictSrv.updateNode(this.node, data)
            .then((node) => this._afterUpdating(node))
            .catch((err) => {
                if (err === 'cancel' && this.cardEditRef.dictionaryId === 'reestrtype') {
                    const oldDelivery = this.cardEditRef.data.rec._orig['ISN_DELIVERY'];
                    this.cardEditRef.inputs['rec.ISN_DELIVERY'].value = oldDelivery;
                    this.cardEditRef.newData.rec['ISN_DELIVERY'] = oldDelivery;
                    this.cardEditRef.form.controls['rec.ISN_DELIVERY'].setValue(oldDelivery, this.cardEditRef.inputs['rec.ISN_DELIVERY'].options);
                    return null;
                } else if (err === 'cancel') {
                    return null;
                }
                this._errHandler(err);
            });
    }

    private _afterSaving(node: EosDictionaryNode) {
        if (node) {
            this._initNodeData(node);
            this.cancel();
        } else {
            if (this._dictSrv.editFromForm || (this.nodes && this.nodes.length <= 1)) {
                this.close();
            }
        }
        this.disableSave = false;
    }

    private _afterUpdating(node: EosDictionaryNode): EosDictionaryNode {
        if (node) {
            node.data['updateTrules'] = [];
            this.recordChanged(node.data);
            this.isChanged = false;
            this._msgSrv.addNewMessage(SUCCESS_SAVE);
            this._deskSrv.addRecentItem({
                url: this._router.url,
                title: node.title,
                iconName: '',
            });
            this._clearEditingCardLink();
        } else {
            this._msgSrv.addNewMessage(WARN_SAVE_FAILED);
        }
        return node;
    }


    private _setEditingCardLink() {
        this.getLastEditedCard();
        if (!this.lastEditedCard) {
            this.lastEditedCard = {
                'id': this.nodeId,
                'title': this.nodeName,
                'link': this._makeUrl(this.nodeId, EDIT_CARD_MODES.edit),
                // uuid: this._uuid
            };
            // console.log('this.nodeId', this.nodeId);
            this._storageSrv.setItem(LS_EDIT_CARD, this.lastEditedCard, true);
        }
    }

    private _clearEditingCardLink(): void {
        if (this.lastEditedCard && this.lastEditedCard.id === this.nodeId) {
            this.lastEditedCard = null;
            this._storageSrv.removeItem(LS_EDIT_CARD);
        }
    }

    private getLastEditedCard() {
        this.lastEditedCard = this._storageSrv.getItem(LS_EDIT_CARD);
    }

    private _errHandler(err) {
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка операции',
            msg: errMessage
        });
        return null;
    }
    private _windowInvalidSave(): Promise<boolean> {
        if (this.isChanged) {
            const confirmParams: IConfirmWindow2 = Object.assign({}, CONFIRM_SAVE_INVALID);
            confirmParams.body = confirmParams.body.replace('{{errors}}', this._getValidateMessages().join('\n'));
            return this._confirmSrv.confirm2(confirmParams, )
                .then((doSave) => {
                    return true;
                })
                .catch(() => {
                    return false;
                });
        } else {
            return Promise.resolve(true);
        }
    }

    private _getValidateMessages(): string[] {
        const invalid = [];
        const inputs = this.cardEditRef.inputs;
        for (const inputKey of Object.keys(this.cardEditRef.inputs)) {
            const input = inputs[inputKey];
            const inputDib = input.dib;
            if (!inputDib) {
                continue;
            }
            const control = inputDib.control;
            if (control.invalid) {
                const title = input.label;
                control.updateValueAndValidity();
                const validateMessage = EosUtils.getControlErrorMessage(control, { maxLength: input.length });
                invalid.push(' - ' + title + ' (' + validateMessage + ')');
            }
        }
        return invalid;
    }
}
