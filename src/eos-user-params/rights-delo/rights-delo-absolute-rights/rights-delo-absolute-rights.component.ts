import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { ABSOLUTE_RIGHTS, CONTROL_ALL_NOTALL } from '../shared-rights-delo/consts/absolute-rights.consts';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { FormGroup, FormControl } from '@angular/forms';
import { E_RIGHT_DELO_ACCESS_CONTENT, IChengeItemAbsolute } from '../shared-rights-delo/interfaces/right-delo.intefaces';
import { RadioInput } from 'eos-common/core/inputs/radio-input';
import { Subscription } from 'rxjs/Subscription';
import { NodeAbsoluteRight } from './node-absolute';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { USERDEP, USER_TECH } from 'eos-rest';
import { RestError } from 'eos-rest/core/rest-error';

export const QUERY = [
    {
        FUNC_NUM: 8,
        CLASSIF_ID: 107
    },
    {
        FUNC_NUM: 9,
        CLASSIF_ID: 105
    },
    {
        FUNC_NUM: 10,
        CLASSIF_ID: 104
    },
    {
        FUNC_NUM: 14,
        CLASSIF_ID: 119
    },
    {
        FUNC_NUM: 18,
        CLASSIF_ID: 120
    },
    {
        FUNC_NUM: 29,
        CLASSIF_ID: 0
    },
];

@Component({
    selector: 'eos-rights-delo-absolute-rights',
    templateUrl: 'rights-delo-absolute-rights.component.html'
})

export class RightsDeloAbsoluteRightsComponent implements OnInit, OnDestroy {
    curentUser: IParamUserCl;
    btnDisabled: boolean = true;
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
    titleHeader: string;


    constructor (
        private _msgSrv: EosMessageService,
        private _userParamsSetSrv: UserParamsService,
        private apiSrv: UserParamApiSrv,
        private _inputCtrlSrv: InputParamControlService,
        ) {
            this.init();
        }

    init() {
        this.curentUser = this._userParamsSetSrv.curentUser;
        this.titleHeader =  `${this._userParamsSetSrv.curentUser.SURNAME_PATRON} - Абсолютные права`;
        this.curentUser['DELO_RIGHTS'] = this.curentUser['DELO_RIGHTS'] || '0'.repeat(37);
        this.arrDeloRight = this.curentUser['DELO_RIGHTS'].split('');
        this.arrNEWDeloRight = this.curentUser['DELO_RIGHTS'].split('');
        this.fields = this._writeValue(ABSOLUTE_RIGHTS);
        this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
        this.listRight = this._createList(ABSOLUTE_RIGHTS);
        this.subForm = this.form.valueChanges
            .subscribe(() => {
               this.listRight.forEach(node => {
                    this.arrNEWDeloRight[+node.key] = node.value.toString();
                });
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
        let qUserCl;
        if (this.arrNEWDeloRight.join('') !== this.arrDeloRight.join('')) {
            const q = {
                method: 'MERGE',
                requestUri: `USER_CL(${this._userParamsSetSrv.userContextId})`,
                data: {
                    DELO_RIGHTS: this.arrNEWDeloRight.join('')
                }
            };
            qUserCl = q;
            this.queryForSave.push(q);
        }
        this.listRight.forEach((node: NodeAbsoluteRight) => {
            if (node.touched) {

                node.change.forEach(ch => {
                    const batch = this._createBatch(ch, node, qUserCl);
                    if (batch) {
                        this.queryForSave.push(batch);
                    }
                });
                node.deleteChange();
            }
        });
        this.apiSrv.setData(this.queryForSave)
        .then(() => {
            this.queryForSave = [];
            this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
        })
        .catch((e) => {
            if (e instanceof RestError) {
                this._msgSrv.addNewMessage({
                    type: 'danger',
                    title: e.code.toString(),
                    msg: e.message
                });
            }
            this.cancel();
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
            const value = !(+item.value);
            if (
                    !value &&
                    (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.department ||
                    item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthor ||
                    item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject)
                ) {
                this._deleteAllDep(item);
            }
            if (!value && (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.docGroup)) {
                this._deleteAllDocGroup(item);
            }
            if (!value && (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.classif)) {
                this._deleteAllClassif(item);
            }

            item.value = +value;

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
        // this.btnDisabled = true;
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
                    this.selectedNode.value ? this.formGroupAll.enable({emitEvent: false}) : this.formGroupAll.disable({emitEvent: false});
                }, 0);
                this.subs['all'] = this.formGroupAll.valueChanges
                    .subscribe(data => {
                        this.selectedNode.value = +data['all'];
                        this.checkChange();
                    });
                this.rightContent = true;
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.classif:
            case E_RIGHT_DELO_ACCESS_CONTENT.docGroup:
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
            fields.push(new NodeAbsoluteRight(node, +this.arrDeloRight[+node['key']], this.form.get(node['key']), this.curentUser));
        });
        return fields;
    }
    private _deleteAllDep(item: NodeAbsoluteRight) {
        const list: USERDEP[] = [];
        this.curentUser.USERDEP_List = this.curentUser.USERDEP_List.filter(li => {
            if (li['FUNC_NUM'] === +item.key + 1) {
                list.push(li);
            } else {
                return true;
            }
        });

        list.forEach(li => {
            item.pushChange({
                method: 'DELETE',
                due: li.DUE,
                data: li
            });
        });
        this.checkChange();
    }
    private _deleteAllDocGroup(item: NodeAbsoluteRight) {
        this.curentUser.USER_RIGHT_DOCGROUP_List.forEach(li => {
            item.pushChange({
                method: 'DELETE',
                due: li.DUE,
                data: li
            });
        });
        this.checkChange();
    }
    private _deleteAllClassif(node: NodeAbsoluteRight) {
        node.deleteChange();
        this.curentUser.USER_TECH_List.forEach((li: USER_TECH) => {
            node.pushChange({
                method: 'DELETE',
                due: li.DUE,
                funcNum: li.FUNC_NUM,
                data: li
            });
        });
        node.pushChange({
            method: 'MERGE',
            user_cl: true,
            data: {
                TECH_RIGHTS: ''
            }
        });
        this._userParamsSetSrv.userTechList.splice(0, this._userParamsSetSrv.userTechList.length);
        this.checkChange();
    }

    private _createBatch(chenge: IChengeItemAbsolute, node: NodeAbsoluteRight, qUserCl) {
        const uId = this._userParamsSetSrv.userContextId;
        let url = '';
        switch (node.contentProp) {
            case E_RIGHT_DELO_ACCESS_CONTENT.department:
            case E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthor:
            case E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject:
                url = `/USERDEP_List${chenge.method === 'POST' ? '' : `('${uId} ${chenge.due} ${chenge.data['FUNC_NUM']}')`}`;
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.docGroup:
                url = `/USER_RIGHT_DOCGROUP_List${chenge.method === 'POST' ? '' : `('${uId} ${chenge.data['FUNC_NUM']} ${chenge.due}')`}`;
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.classif:
                if (chenge.user_cl) {
                    if (qUserCl) {
                        qUserCl['data'] = Object.assign(qUserCl['data'], chenge.data);
                        return false;
                    } else {
                        break;
                    }
                }
                url = `/USER_TECH_List${chenge.method === 'POST' ? '' : `('${uId} ${chenge.data['FUNC_NUM']} ${chenge.due}')`}`;
                break;
        }
        const batch = {
            method: chenge.method,
            requestUri: `USER_CL(${uId})${url}`,
        };
        if (chenge.method === 'POST' || chenge.method === 'MERGE') {
            delete chenge.data['CompositePrimaryKey'];
            delete chenge.data['__metadata'];
            batch['data'] = chenge.data;
        }
        return batch;
    }
}
