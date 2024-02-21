import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { CardEditComponent } from '../../eos-dictionaries/card-views/card-edit.component';
import { EosDictionaryNode } from '../../eos-dictionaries/core/eos-dictionary-node';
import { EosDepartmentsService } from '../services/eos-department-service';
import { SUCCESS_SAVE } from '../consts/messages.consts';
import {ConfirmWindowService} from '../../eos-common/confirm-window/confirm-window.service';
import {BaseCardEditDirective} from '../card-views/base-card-edit.component';
import { CONFIRM_SAVE_INVALID, ERROR_LOGIN } from '../../app/consts/confirms.const';
import { IConfirmWindow2 } from '../../eos-common/confirm-window/confirm-window2.component';
import { EosUtils } from '../../eos-common/core/utils';
import { RestError } from '../../eos-rest/core/rest-error';
import { RETURN_URL, URL_LOGIN } from '../../app/consts/common.consts';

@Component({
    selector: 'eos-create-node',
    templateUrl: 'create-node.component.html',
})

export class CreateNodeComponent {
    @Input() dictionaryId: string;
    @Input() fieldsDescription: any;
    @Input() nodeData: any;
    @Output() onHide: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('cardEditEl', { static: true }) cardEditRef: CardEditComponent;

    formIsValid = false;
    hasChanges = false;
    upadating = false;

    dutysList: string[] = [];
    fullNamesList: string[] = [];

    constructor(
        protected _deskSrv: EosDeskService,
        protected _dictSrv: EosDictService,
        protected _breadcrumbsSrv: EosBreadcrumbsService,
        protected _msgSrv: EosMessageService,
        protected _confirmSrv: ConfirmWindowService,
        departmentsSrv: EosDepartmentsService,
    ) {
        this.dutysList = departmentsSrv.dutys;
        this.fullNamesList = departmentsSrv.fullnames;
    }

    /**
     * Set this.formIsValid in value recived from CardEditComponent
     * @param invalid invalid value of CardEditComponent
     */
    validate(invalid: boolean) {
        this.formIsValid = !invalid;
    }

    /**
     * Emit event that modal must be closed
     */
    cancelCreate() {
        this.onHide.emit(true);
        this.formIsValid = false;
    }

    /**
     * Create new node by using EosDictService, add new item on destop recent items wiget
     * by using EosDeskService, emit event that modal must be closed and
     * emit event that modal must be opened if it is nessesery
     * @param hide indicates whether to close the modal window after or open new one
     */
    public create(hide = true) {
        console.log('create_create-node')

        if (!this.formIsValid) {
            return;
        }

        if (!this.hasChanges) {
            return;
        }
        const data = this.cardEditRef.getNewData();
        Object.assign(data.rec, this.nodeData.rec); // update with predefined data

        this._confirmSave(data, true)
            .then((res: boolean) => {
                if (res) {
                    this.upadating = true;
                    this._sendDataOnCreate(data, hide);
                    this._dictSrv.currentTab = 0;
                }   else {
                    this.cardEditRef.resetData();
                }
            }).catch(e => {
                this.cardEditRef.isChanged = false;
                if (e.code && e.code === 401) {
                    this.cardEditRef.isChanged = false;
                    this._confirmSrv
                    .confirm2(ERROR_LOGIN)
                    .then((confirmed) => {
                        if (confirmed) {
                            document.location.assign(URL_LOGIN + RETURN_URL + document.location.href);
                        }
                    });
                }   else {
                       this._errHandler(e);
                }
            });
    }

    /**
     * Set hasChanges
     * @param hasChanges recived value
     */
    recordChanged(hasChanges: boolean) {
        this.hasChanges = hasChanges;
    }

    isInsertDisabled(): boolean {
        return !this.formIsValid || !this.hasChanges || this.upadating;
    }

    protected _sendDataOnCreate(data: any, hide = true) {

        this._dictSrv.addNode(data)
            .then((node: EosDictionaryNode) => this._afterAdding(node, hide))
            .catch((err) => {
                if (err.code && err.code === 401) {
                    this.cardEditRef.isChanged = false;
                    this._confirmSrv
                    .confirm2(ERROR_LOGIN)
                    .then((confirmed) => {
                        if (confirmed) {
                            document.location.assign(URL_LOGIN + '?returnUrl=' + document.location.href);
                        }
                    });
                }

                if (err && err.error instanceof RestError) {
                    this._windowInvalidSave ([err.error.message]);
                } else if (err === 'cancel') {

                } else {
                    this._windowInvalidSave ([err.message]);
                    // return this._errHandler(err);
                }
                this.cardEditRef.resetData();
                this.upadating = false;
            });
    }

    private _windowInvalidSave(errors: string[] = []): Promise<boolean> {

        const confirmParams: IConfirmWindow2 = Object.assign({}, CONFIRM_SAVE_INVALID);

        confirmParams.body = '';
        confirmParams.bodyList = [ ... errors, ... EosUtils.getValidateMessages(this.cardEditRef.inputs)];
        if (confirmParams.bodyList.length) {
            confirmParams.bodyList.forEach((body) => {
                if (body.indexOf('Обязательное поле') >= 0) {
                    confirmParams.body = 'Не заполнены обязательные поля';
                }
            });
        }
        return this._confirmSrv.confirm2(confirmParams, )
            .then((doSave) => {
                let key = '';
                for (const inputKey of Object.keys(this.cardEditRef.inputs)) {
                    const input = this.cardEditRef.inputs[inputKey];
                    const inputDib = input.dib;
                    if (!inputDib) {
                        continue;
                    }
                    const control = inputDib.control;
                    if (control.invalid) {
                        key = inputDib.input.key;
                        break;
                    }
                }
                BaseCardEditDirective.setElementOnValidate(key, this.cardEditRef.baseCardEditRef);
                return true;
            })
            .catch(() => {
                return false;
            });
    }


    private _afterAdding(node: EosDictionaryNode, hide: boolean): void {
        if (node) {
            this._deskSrv.addRecentItem({
                url: this._breadcrumbsSrv.currentLink.url + '/' + node.id + '/edit',
                title: node.title,
            });
            this._msgSrv.addNewMessage(SUCCESS_SAVE);
        }
        this.upadating = false;
        this.onHide.emit(true);
        if (!hide) {
            this.onOpen.emit(true);
        }
        BaseCardEditDirective.autoFocusOnFirstStringElement('eos-card-edit');
    }

    private _confirmSave(data, isNewRecord: boolean): Promise<boolean> {
        return this._dictSrv.currentDictionary.descriptor.confirmSave(data, this._confirmSrv, isNewRecord).then( res => {
            if (res && this.cardEditRef) {
                return this.cardEditRef.confirmSave();
            }
            return res;
        });
    }

    /**
     * Separate error massage from error and show it to user by using EosMessageService
     */
    private _errHandler(err) {
        // console.error(err);
        this.upadating = false;
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка добавления записи',
            msg: errMessage,
        });
    }
}
