import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { ABSOLUTE_RIGHTS, CONTROL_ALL_NOTALL } from './absolute-rights.consts';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { E_RIGHT_DELO_ACCESS_CONTENT, IChengeItemAbsolute } from './right-delo.intefaces';
import { RadioInput } from 'eos-common/core/inputs/radio-input';
import { NodeAbsoluteRight } from './node-absolute';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { USERDEP, USER_TECH, USER_EDIT_ORG_TYPE } from 'eos-rest';
// import { RestError } from 'eos-rest/core/rest-error';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { ENPTY_ALLOWED_CREATE_PRJ } from 'app/consts/messages.consts';
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
    queryForSave = [];
    rightContent: boolean;
    listRight: NodeAbsoluteRight[] = [];
    titleHeader: string;
    techRingtOrig: string;
    public editMode: boolean = false;
    private _ngUnsubscribe: Subject<any> = new Subject();
    private flagGrifs: boolean = false;

    constructor(
        private _msgSrv: EosMessageService,
        private _userParamsSetSrv: UserParamsService,
        private apiSrv: UserParamApiSrv,
        private _inputCtrlSrv: InputParamControlService,
        private _router: Router,
        private _errorSrv: ErrorHelperServices,
    ) { }
    async ngOnInit() {
        this._userParamsSetSrv.saveData$
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                this._userParamsSetSrv.submitSave = this.submit(true);
            });

        await this._userParamsSetSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERDEP_List,USER_RIGHT_DOCGROUP_List,USER_TECH_List,USER_EDIT_ORG_TYPE_List'
        });
        const id = this._userParamsSetSrv.curentUser['ISN_LCLASSIF'];
        this.curentUser = this._userParamsSetSrv.curentUser;
        this.flagGrifs = await this._userParamsSetSrv.checkGrifs(id);
        this.init();
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }

    init() {
        this.curentUser = this._userParamsSetSrv.curentUser;
        this.techRingtOrig = this.curentUser.TECH_RIGHTS;
        this.titleHeader = `${this._userParamsSetSrv.curentUser.SURNAME_PATRON} - Абсолютные права`;
        this.curentUser['DELO_RIGHTS'] = this.curentUser['DELO_RIGHTS'] || '0'.repeat(37);
        this.arrDeloRight = this.curentUser['DELO_RIGHTS'].split('');
        this.arrNEWDeloRight = this.curentUser['DELO_RIGHTS'].split('');
        this.fields = this._writeValue(ABSOLUTE_RIGHTS);
        this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
        this.listRight = this._createList(ABSOLUTE_RIGHTS);
        this.form.valueChanges
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                this.listRight.forEach(node => {
                    this.arrNEWDeloRight[+node.key] = node.value.toString();
                });
                this.checkChange();
                setTimeout(() => {
                    this._viewContent();
                }, 0);
            });

        if (this.editMode) {
            this.selectNode(this.listRight[0]);
        }
        this.inputAll = { all: new RadioInput(CONTROL_ALL_NOTALL) };
    }
    submit(flag?): Promise<any> {
        if (this._checkCreatePRJNotEmptyAllowed()) {
            this._msgSrv.addNewMessage(ENPTY_ALLOWED_CREATE_PRJ);
            return Promise.resolve(true);
        }
        // this.selectedNode = null;
        this.editMode = false;
        this.btnDisabled = true;
        this._pushState();
        let qUserCl;
        const strNewDeloRight = this.arrNEWDeloRight.join('');
        const strDeloRight = this.arrDeloRight.join('');
        if (strNewDeloRight !== strDeloRight) {
            const q = {
                method: 'MERGE',
                requestUri: `USER_CL(${this._userParamsSetSrv.userContextId})`,
                data: {
                    DELO_RIGHTS: strNewDeloRight
                }
            };
            qUserCl = q;
            this.queryForSave.push(q);
            this.arrDeloRight = strNewDeloRight.split('');
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
        return this.apiSrv.setData(this.queryForSave)
            .then(() => {
                this.queryForSave = [];
                this.listRight = [];
                this.selectedNode = null;
                this.editMode = false;
                this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                if (!flag) {
                    return this._userParamsSetSrv.getUserIsn({
                        expand: 'USER_PARMS_List,USERDEP_List,USER_RIGHT_DOCGROUP_List,USER_TECH_List,USER_EDIT_ORG_TYPE_List'
                    })
                        .then(() => {
                            this.init();
                        });
                }
            })
            .catch((e) => {
                this._errorSrv.errorHandler(e);
                this.cancel();
            });
    }
    cancel() {
        this.selectedNode = null;
        this.editMode = false;
        this.btnDisabled = true;
        this._pushState();
        this._userParamsSetSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERDEP_List,USER_RIGHT_DOCGROUP_List,USER_TECH_List,USER_EDIT_ORG_TYPE_List'
        })
            .then(() => {
                this.init();
            });
    }
    edit() {
        const id = this._userParamsSetSrv.curentUser.ISN_LCLASSIF;
        if (this.flagGrifs) {
            this.editMode = true;
            this.init();
        } else {
            this._router.navigate(['user-params-set/', 'access-limitation'],
                {
                    queryParams: { isn_cl: id }
                });
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Не заданы грифы доступа'
            });
        }
        // this.setDisableOrEneble();

    }
    clickLable(event, item: NodeAbsoluteRight) {
        event.preventDefault();
        event.stopPropagation();
        if (!this.editMode) {
            return;
        }
        if (event.target.tagName === 'LABEL') { // click to label
            this.selectNode(item);
        }
        if (event.target.tagName === 'SPAN') { // click to checkbox
            const value = !(+item.value);

            item.value = +value;

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
            if (!value && (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.editOrganiz)) {
                this._deleteAllOrgType(item);
            }


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
        this._pushState();
    }
    private _writeValue(constanta: IInputParamControl[]): IInputParamControl[] {
        const fields = [];
        constanta.forEach((node: IInputParamControl) => {
            const n = Object.assign({ value: !!+this.arrDeloRight[+node['key']] }, node);
            if (!this.editMode) {
                n.disabled = true;
            }
            fields.push(n);
        });
        return fields;
    }
    private formAllEditType() {
        if (this.formGroupAll) {
            this.subs['all'].unsubscribe();
            this.formGroupAll = null;
        }
        this.formGroupAll = new FormGroup({
            all: new FormControl(this.selectedNode.value ? this.arrNEWDeloRight[+this.selectedNode.key] : '0')
        });
        setTimeout(() => {
            this.selectedNode.value ? this.formGroupAll.enable({ emitEvent: false }) : this.formGroupAll.disable({ emitEvent: false });
        }, 0);
        this.subs['all'] = this.formGroupAll.valueChanges
            .subscribe(data => {
                this.selectedNode.value = +data['all'];
                this.checkChange();
            });
    }
    private _viewContent() {
        //  this.rightContent = false;
        if (!this.selectedNode) {
            return;
        }
        if (this.selectedNode.contentProp === 2 || this.selectedNode.contentProp !== 5) {
            this.rightContent = false;
        }
        switch (this.selectedNode.contentProp) {
            case E_RIGHT_DELO_ACCESS_CONTENT.all:
                this.formAllEditType();
                this.rightContent = true;
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.editOrganiz:
                this.formAllEditType();
                if (this.selectedNode.value) {
                    setTimeout(() => {
                        this.rightContent = true;
                    }, 0);
                }
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
        for (const node of constanta) {
            /*
                Проверка: правило контрольности
            */
            if (node.key === '14' && !(+this.curentUser['USER_PARMS_HASH']['RC_CTRL'])) {
                continue;
            }
            fields.push(new NodeAbsoluteRight(node, +this.arrDeloRight[+node['key']], this.form.get(node['key']), this.curentUser));
        }
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
        item.deleteChange();
        this.curentUser.USER_RIGHT_DOCGROUP_List.forEach(li => {
            item.pushChange({
                method: 'DELETE',
                due: li.DUE,
                data: li
            });
        });
        this._userParamsSetSrv.userRightDocgroupList.splice(0, this._userParamsSetSrv.userRightDocgroupList.length);
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
        if (this.techRingtOrig) {
            node.pushChange({
                method: 'MERGE',
                user_cl: true,
                data: {
                    TECH_RIGHTS: ''
                }
            });
        }
        this._userParamsSetSrv.userTechList.splice(0, this._userParamsSetSrv.userTechList.length);
        this.checkChange();
    }

    private _deleteAllOrgType(node: NodeAbsoluteRight) {
        node.deleteChange();
        const list = this._userParamsSetSrv.curentUser.USER_EDIT_ORG_TYPE_List;
        if (list.length) {
            list.forEach((item: USER_EDIT_ORG_TYPE) => {
                node.pushChange({
                    method: 'DELETE',
                    isn_org: item.ISN_ORG_TYPE,
                    data: item
                });
            });
            this._userParamsSetSrv.curentUser.USER_EDIT_ORG_TYPE_List.splice(0, list.length);
            this.checkChange();
        }
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
        let batch = {};
        if (node.contentProp === 5) {
            batch = this._batchEditOrgType(chenge, uId);
        } else {
            batch = {
                method: chenge.method,
                requestUri: `USER_CL(${uId})${url}`,
            };
            if (chenge.method === 'POST' || chenge.method === 'MERGE') {
                delete chenge.data['CompositePrimaryKey'];
                delete chenge.data['__metadata'];
                batch['data'] = chenge.data;
            }
        }
        return batch;
    }
    private _batchEditOrgType(chenge: IChengeItemAbsolute, uId) {
        const batch = {};
        batch['method'] = chenge.method;
        if (chenge.method === 'POST') {
            batch['requestUri'] = `USER_CL(${uId})/USER_EDIT_ORG_TYPE_List`;
            delete chenge.data['CompositePrimaryKey'];
            delete chenge.data['__metadata'];
            batch['data'] = chenge.data;
        }
        if (chenge.method === 'DELETE') {
            batch['requestUri'] = `USER_CL(${uId})/USER_EDIT_ORG_TYPE_List(\'${uId} ${chenge.isn_org}\')`;
        }
        return batch;
    }
    private _checkCreatePRJNotEmptyAllowed(): boolean {
        let allowed = false;
        this.listRight.forEach((node: NodeAbsoluteRight) => {
            if (node.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.docGroup && node.touched && node.value) {
                allowed = true;
                this._userParamsSetSrv.userRightDocgroupList.forEach(item => {
                    if (item['ALLOWED']) {
                        allowed = false;
                    }
                });
            }
        });
        return allowed;
    }
    private _pushState() {
        this._userParamsSetSrv.setChangeState({ isChange: !this.btnDisabled });
    }
}
