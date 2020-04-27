import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { EosDeskService } from 'app/services/eos-desk.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosBreadcrumbsService } from 'app/services/eos-breadcrumbs.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { CardEditComponent } from 'eos-dictionaries/card-views/card-edit.component';
import { EosDictionaryNode } from 'eos-dictionaries/core/eos-dictionary-node';
import { EosDepartmentsService } from '../services/eos-department-service';
import { SUCCESS_SAVE } from '../consts/messages.consts';
import {ConfirmWindowService} from '../../eos-common/confirm-window/confirm-window.service';
import {BaseCardEditComponent} from '../card-views/base-card-edit.component';
import { CONFIRM_SAVE_INVALID } from 'app/consts/confirms.const';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';
import { EosUtils } from 'eos-common/core/utils';
import { RestError } from 'eos-rest/core/rest-error';

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

    @ViewChild('cardEditEl') cardEditRef: CardEditComponent;

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

        const error = this.checkErrorSEV();
        if (error.length > 0) {
            this._windowInvalidSave(error);
            return ;
        }
        if (!this.formIsValid) {
            this._windowInvalidSave();
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
                if (e.code && e.code === 434) {
                    this.cardEditRef.isChanged = false;
                    document.location.assign('../login.aspx');
                }   else {
                       this._errHandler(e);
                }
            });
    }
    // все проверки по справочникам SEV вынес в одно место так как не знаю будет их много или только одна
    checkErrorSEV(): string[] {
        const errors = [];
        const data = this.cardEditRef.newData.rec;
        if (this.cardEditRef.dictionaryId === 'sev-rules') {
            if (data &&
                data['takeFileRK'] === 0 &&
                data['FileRK'] === 1) {
                errors.push(`Внимание! Запрещено редактировать реквизиты РК при повторном получении документа "Файлы РК", т.к. эти реквизиты не разрешены к приёму.
                Необходимо откорректировать настройки параметров правила СЭВ.`);
            }
            if (data &&
                !data['DUE_DOCGROUP_NAME']) {
                errors.push(`Не задана группа документов`);
            }
            if (data &&
                (+data['RULE_KIND'] === 2 || +data['RULE_KIND'] === 6) &&
                !data['groupDocument']
                ) {
                errors.push(`Поле \'Для групп документов\' обязательно для заполнения`);
            }
            if (data &&
                +data['RULE_KIND'] === 6 &&
                !data['executor']
            ) {
                errors.push(`Поле \'Исполнитель\' обязательно для заполнения`);
            }
            if (data &&
                +data['RULE_KIND'] === 6 &&
                !data['visaForward'] &&
                !data['visaDate']
            ) {
                errors.push(`Срок визы должен быть заполнен`);
            }
            if (data &&
                +data['RULE_KIND'] === 6 &&
                !data['signatureForward'] &&
                !data['signatureDate']
            ) {
                errors.push(`Срок подписи должен быть заполнен`);
            }
            if ((data.link && data.linkKind === 1 && String(data.type) === '1' && (data.linkTypeList === 'null' || !data.linkTypeList)) ||
            (data['LinkPD'] && data['linkKind'] === 1 && String(data['type']) === '2' && (data['linkTypeList'] === 'null' || !data['linkTypeList']))
            ) {
                errors.push(`Тип связки должен быть выбран`);
            }
        }
        return errors;
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
                if (err.code && err.code === 434) {
                    this.cardEditRef.isChanged = false;
                    document.location.assign('../login.aspx');
                }

                if (err && err.error instanceof RestError) {
                    this._windowInvalidSave ([err.error.message]);
                } else if (err === 'cancel') {

                } else {
                    return this._errHandler(err);
                }
                this.upadating = false;
            });
    }

    private _windowInvalidSave(errors: string[] = []): Promise<boolean> {

        const confirmParams: IConfirmWindow2 = Object.assign({}, CONFIRM_SAVE_INVALID);

        confirmParams.body = '';
        confirmParams.bodyList = [ ... errors, ... EosUtils.getValidateMessages(this.cardEditRef.inputs)];

        return this._confirmSrv.confirm2(confirmParams, )
            .then((doSave) => {
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
        BaseCardEditComponent.autoFocusOnFirstStringElement('eos-card-edit');
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
