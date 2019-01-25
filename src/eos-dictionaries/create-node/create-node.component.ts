import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { EosDeskService } from 'app/services/eos-desk.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosBreadcrumbsService } from 'app/services/eos-breadcrumbs.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { CardEditComponent } from 'eos-dictionaries/card-views/card-edit.component';
import { EosDictionaryNode } from 'eos-dictionaries/core/eos-dictionary-node';
import { EosDepartmentsService } from '../services/eos-department-service';
import { SUCCESS_SAVE } from '../consts/messages.consts';

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
        this.upadating = true;
        const data = this.cardEditRef.getNewData();

        Object.assign(data.rec, this.nodeData.rec); // update with predefined data

        this._sendDataOnCreate(data, hide);
    }

    /**
     * Set hasChanges
     * @param hasChanges recived value
     */
    recordChanged(hasChanges: boolean) {
        this.hasChanges = hasChanges;
    }

    protected _sendDataOnCreate(data: any, hide = true) {

        this._dictSrv.addNode(data)
            .then((node: EosDictionaryNode) => this._afterAdding(node, hide))
            .catch((err) => {
                if (err === 'cancel') {
                    this.upadating = false;
                } else {
                    return this._errHandler(err);
                }
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
