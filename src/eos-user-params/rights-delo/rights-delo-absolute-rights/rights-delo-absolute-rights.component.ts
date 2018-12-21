import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { ABSOLUTE_RIGHTS, CONTROL_ALL_NOTALL } from '../shared-rights-delo/consts/absolute-rights.consts';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AbsoluteRightsDirectoryComponent } from './absolute-rights-directory-modal/absolute-rights-directory-modal.component';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { FormGroup, FormControl } from '@angular/forms';
import { E_RIGHT_DELO_ACCESS_CONTENT } from '../shared-rights-delo/interfaces/right-delo.intefaces';
import { RadioInput } from 'eos-common/core/inputs/radio-input';
import { Subscription } from 'rxjs/Subscription';
import { NodeAbsoluteRight } from './node-absolute';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';

@Component({
    selector: 'eos-rights-delo-absolute-rights',
    templateUrl: 'rights-delo-absolute-rights.component.html'
})

export class RightsDeloAbsoluteRightsComponent implements OnInit, OnDestroy {
    curentUser: IParamUserCl;
    btnDisabled: boolean = true;
    directoryModal: BsModalRef;
    arrDeloRight: string[];
    arrNEWDeloRight: string[];
    selectedNode: NodeAbsoluteRight; // текущий выбранный элемент
    fields: IInputParamControl[];
    inputs;
    inputAll;
    form: FormGroup;
    formGroupAll: FormGroup;
    subs = {};
    subForm: Subscription;
    queryForSave = [];
    rightContent: boolean;
    listRight: NodeAbsoluteRight[] = [];


    constructor (
        private _msgSrv: EosMessageService,
        private _userParamsSetSrv: UserParamsService,
        private _modalSrv: BsModalService,
        private apiSrv: UserParamApiSrv,
        private _inputCtrlSrv: InputParamControlService,
        ) {
            this.init();
        }

    init() {
        this.curentUser = this._userParamsSetSrv.curentUser;
        this.arrDeloRight = this.curentUser['DELO_RIGHTS'].split('');
        this.arrNEWDeloRight = this.curentUser['DELO_RIGHTS'].split('');
        this.fields = this._writeValue(ABSOLUTE_RIGHTS);
        this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
        this.listRight = this._createList(ABSOLUTE_RIGHTS);
        this.subForm = this.form.valueChanges
            .subscribe(data => {
                for (const key in  data) {
                    if (+this.arrNEWDeloRight[key] > 1 && data[key]) {
                        continue;
                    }
                this.arrNEWDeloRight[key] = (+data[key]).toString();
                }
                this.checkChange();
                setTimeout(() => {
                    this._viewContent();
                }, 0);
            });
    }
    ngOnInit() {
        this.selectNode(this.listRight[0]);
        this.inputAll = {all: new RadioInput(CONTROL_ALL_NOTALL)};
    }
    ngOnDestroy() {
        this.subForm.unsubscribe();
    }
    submit() {
        this.btnDisabled = true;
        if (this.arrNEWDeloRight.join('') !== this.arrDeloRight.join('')) {
            this.queryForSave.push({
                method: 'MERGE',
                requestUri: `USER_CL(${this._userParamsSetSrv.userContextId})`,
                data: {
                    DELO_RIGHTS: this.arrNEWDeloRight.join('')
                }
            });
        }
        this.listRight.forEach((node: NodeAbsoluteRight) => {
            if (node.touched) {
                node.change.forEach(ch => {
                    this.queryForSave.push(this._createBatch(ch));
                });
                node.deleteChange();
            }
        });

        this.apiSrv.setData(this.queryForSave)
        .then(data => {
            this.queryForSave = [];
            this.btnDisabled = true;
            this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
        })
        .catch(e => {
            console.log(e);
        });
    }
    cancel() {
        this.btnDisabled = true;
        this.ngOnDestroy();
        this._userParamsSetSrv.getUserIsn()
        .then(() => {
            this.init();
            this.ngOnInit();
        });
    }
    clickLable(event, item: NodeAbsoluteRight) {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.tagName === 'LABEL') { // click to label
            this.selectNode(item);
        }
        if (event.target.tagName === 'SPAN') { // click to checkbox
            const value = !item.value;
            if (!value && (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.department || E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthor || E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject)) {
                this._deleteAllDep(item);
            }

            item.value = value;

            if (item !== this.selectedNode && item.isCreate) {
                this.selectNode(item);
            }
        }
    }
    selectNode(node: NodeAbsoluteRight) {
        if (this.selectedNode !== node) {
            if (this.selectedNode) {
                this.selectedNode.isSelected = false;
            }
            this.selectedNode = node;
            this.selectedNode.isSelected = true;
            this._viewContent();
        }
    }
    openClessifModal() {
        this.directoryModal = this._modalSrv.show(AbsoluteRightsDirectoryComponent, {
            class: 'directory-modal',
            ignoreBackdropClick: true
        });
        this.directoryModal.content.closeCollection.subscribe(() => {
            this.directoryModal.hide();
        });
    }
    checkChange() {
        let c = false;
        this.listRight.forEach(li => { // проверяем список на изменения
            if (li.touched) {
                c = true;
            }
        });
        if (this.arrNEWDeloRight.join('') !== this.arrDeloRight.join('')) {
            c = true;
        }
        this.btnDisabled = !c;
    }
    private _writeValue(constanta: IInputParamControl[]): IInputParamControl[] {
        const fields = [];
        constanta.forEach((node: IInputParamControl) => {
            fields.push(Object.assign({value: !!+this.arrDeloRight[+node['key']]}, node));
        });
        return fields;
    }
    private _viewContent() {
        this.rightContent = false;
        switch (this.selectedNode.contentProp) {
            case E_RIGHT_DELO_ACCESS_CONTENT.all:
                if (this.formGroupAll) {
                    this.subs['all'].unsubscribe();
                    this.formGroupAll = null;
                }
                this.formGroupAll = new FormGroup({
                        all: new FormControl(this.selectedNode.value ? this.arrNEWDeloRight[+this.selectedNode.key] : '0')
                });
                setTimeout(() => {
                    this.selectedNode.value ? this.formGroupAll.enable() : this.formGroupAll.disable();
                }, 0);
                this.subs['all'] = this.formGroupAll.valueChanges
                    .subscribe(data => {
                        this.arrNEWDeloRight[+this.selectedNode.key] = data['all'];
                        this.checkChange();
                    });
                this.rightContent = true;
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.department:
            case E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject:
                if (this.selectedNode.value) {
                    setTimeout(() => {
                        this.rightContent = true;
                    }, 0);
                }
                break;
        }
    }
    private _createList(constanta: IInputParamControl[]): NodeAbsoluteRight[] {
        const fields = [];
        constanta.forEach((node: IInputParamControl) => {
            fields.push(new NodeAbsoluteRight(node, !!+this.arrDeloRight[+node['key']], this.form.get(node['key'])));
        });
        return fields;
    }
    private _deleteAllDep(item: NodeAbsoluteRight) {
        const list = [];
        this.curentUser.USERDEP_List = this.curentUser.USERDEP_List.filter(li => {
            if (li['FUNC_NUM'] === +item.key + 1) {
                list.push(li);
            } else {
                return true;
            }
        });

        list.forEach(li => {
            item.pushChange({
                userDep: li,
                createEntity: false
            });
        });
        this.checkChange();
    }

    private _createBatch(data) {
        const create = data['createEntity'];
        const userDep = Object.assign({}, data['userDep']);

        const str = create ? '' : `('${this._userParamsSetSrv.userContextId} ${userDep['DUE']} ${userDep['FUNC_NUM']}')`;
        const batch = {
            method: create ? 'POST' : 'DELETE',
            requestUri: `USER_CL(${this._userParamsSetSrv.userContextId})/USERDEP_List${str}`,
        };
        if (create) {
            batch['data'] = userDep;
        }
        return batch;
    }
}
