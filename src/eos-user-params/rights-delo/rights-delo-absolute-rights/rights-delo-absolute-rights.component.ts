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
import { USER_TECH, PipRX, USERDEP, ORGANIZ_CL, USER_RIGHT_DOCGROUP } from 'eos-rest';
// import { RestError } from 'eos-rest/core/rest-error';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { ENPTY_ALLOWED_CREATE_PRJ } from 'app/consts/messages.consts';
import { EosStorageService } from 'app/services/eos-storage.service';
import { AppContext } from 'eos-rest/services/appContext.service';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
@Component({
    selector: 'eos-rights-delo-absolute-rights',
    templateUrl: 'rights-delo-absolute-rights.component.html'
})

export class RightsDeloAbsoluteRightsComponent implements OnInit, OnDestroy {
    curentUser: IParamUserCl;
    btnDisabled: boolean = true;
    isLoading: boolean = false;
    arrDeloRight: string[];
    arrNEWDeloRight: string[];
    selectedNode: NodeAbsoluteRight; // текущий выбранный элемент
    selectListNode: number = 0;
    fields: IInputParamControl[];
    inputs;
    inputAll;
    form: FormGroup;
    formGroupAll: FormGroup;
    subs = {};
    queryForSave = [];
    rightContent: boolean;
    listRight: NodeAbsoluteRight[] = [];
    techRingtOrig: string;
    techUsers: Array<any> = [];
    limitUserTech: boolean;
    flagDel: boolean = false;
    groupDelRK = [];
    public editMode: boolean = false;
    get titleHeader() {
        if (this.curentUser) {
            if (this.curentUser.isTechUser) {
                return this.curentUser.CLASSIF_NAME + '- Абсолютные права';
            }
            return `${this.curentUser['DUE_DEP_SURNAME']} - Абсолютные права`;
        }
        return '';
    }
    private _limCardDisable = [0, 1, 2, 18, 19, 22, 29];
    private _ngUnsubscribe: Subject<any> = new Subject();
    private flagGrifs: boolean = false;
    private DELETE_RCPD = 'У пользователя назначено право \'Содзание РКПД\' .Без права \'Исполнение поручений\' оно не работает. Снять это право?';
    private CREATE_RCPD = 'У пользователя нет права \'Исполнения поручений\', добавить его?';
    private GRUP_DEL_RK = 'Назначить права пользователю на выполнение операции «Удаление РК» в доступных ему картотеках?';
    private GRUP_NOT_DEL_RK = 'У пользователя назначены права на выполнение операции «Удаление РК» в доступных ему картотеках. Снять?';

    constructor(
        private _msgSrv: EosMessageService,
        private _userParamsSetSrv: UserParamsService,
        private apiSrv: UserParamApiSrv,
        private _inputCtrlSrv: InputParamControlService,
        private _router: Router,
        private pipRx: PipRX,
        private _errorSrv: ErrorHelperServices,
        private _storageSrv: EosStorageService,
        private _appContext: AppContext
    ) { }
    ngOnInit() {
        this._userParamsSetSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERDEP_List,USER_RIGHT_DOCGROUP_List,USER_TECH_List,USER_ORGANIZ_List,USERCARD_List/USER_CARD_DOCGROUP_List'
        })
            .then(() => {
                const id = this._userParamsSetSrv.curentUser['ISN_LCLASSIF'];
                this._userParamsSetSrv.checkGrifs(id).then(el => {
                    this.flagGrifs = el;
                    this.init();
                });
            })
            .catch(el => {
            });
    }
    ngOnDestroy() { }

    absoluteRightReturn() {
        const arrayFirst = ABSOLUTE_RIGHTS.filter(elem => {
            if (elem.key === '2' || elem.key === '30') {
                return false;
            }
            return true;
        });
        const array = [];
        arrayFirst.forEach((elem, index) => {
            if (elem.key === '9') {
                elem.label = 'Редактирование рег. данных РК';
            }
            array.push(elem);
            if (index === 1) {
                array.push({
                    controlType: E_FIELD_TYPE.boolean,
                    key: '2',
                    label: 'Централизованная отправка документов',
                    data: {
                        isSelected: false,
                        rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
                    }
                });
            }
        });
        return array;
    }
    init() {
        const ABS = this._appContext.cbBase ? this.absoluteRightReturn() : ABSOLUTE_RIGHTS;
        this.curentUser = this._userParamsSetSrv.curentUser;
        this.techRingtOrig = this.curentUser.TECH_RIGHTS;
        this.curentUser['DELO_RIGHTS'] = this.curentUser['DELO_RIGHTS'] || '0'.repeat(37);
        this.arrDeloRight = this.curentUser['DELO_RIGHTS'].split('');
        this.arrNEWDeloRight = this.curentUser['DELO_RIGHTS'].split('');
        this.fields = this._writeValue(ABS);
        this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
        this.listRight = this._createList(ABS);
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

        this.selectNode(this.listRight[this.selectListNode]);
        this.inputAll = { all: new RadioInput(CONTROL_ALL_NOTALL) };
        this.isLoading = true;
        if (this._appContext.limitCardsUser.length > 0) {
            this._limCardDisable.forEach(i => this.listRight[i].control.disable());
        }
    }
    CheckLimitTech(techList): boolean {
        let limitUser = false;
        techList.forEach((item) => {
            if (item.FUNC_NUM === 1) {
                limitUser = true;
            }
        });
        return limitUser;
    }

    GetSysTechUser(): Promise<any> {
        return this.pipRx.read({
            USER_CL: {
                criteries: {
                    DELO_RIGHTS: '1%',
                    DELETED: '0',
                    ISN_LCLASSIF: '1:null'
                },
            },
            loadmode: 'Table',
            expand: 'USER_TECH_List'
        }).then((data: any) => {
            let count = 0;
            let sysTechBol = false;
            const arr = this.listRight[0].change;
            if (this.listRight[0].change.length !== 0) {
                arr.map((val) => {
                    if (val.hasOwnProperty('funcNum')) {
                        sysTechBol = true;
                    } else {
                        if (val.data.TECH_RIGHTS.charAt(0) === '0') {
                            sysTechBol = true;
                        }
                    }
                });
            }
            for (const user of data) {
                if (this.curentUser.ISN_LCLASSIF === user.ISN_LCLASSIF && sysTechBol && !this.CheckLimitTech(user.USER_TECH_List)) {
                    count++;
                }
                if (this.CheckLimitTech(user.USER_TECH_List)) {
                    count++;
                }
            }
            if (data.length > count) {
                this.limitUserTech = false;
            } else {
                this.limitUserTech = true;
            }
        });
    }

    submit(flag?): Promise<any> {
        this.isLoading = false;
        return this.GetSysTechUser().then(() => {
            if (this.limitUserTech === false) {
                if (this._checkCreatePRJNotEmptyAllowed() || this._checkCreateNotEmpty() || this._checkCreateNotEmptyOrgan()) {
                    if (this._checkCreatePRJNotEmptyAllowed()) {
                        this._msgSrv.addNewMessage(ENPTY_ALLOWED_CREATE_PRJ);
                    }
                    this.isLoading = true;
                    return Promise.resolve(true);
                }
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
                if (this.curentUser.IS_SECUR_ADM === 1) {
                    if (this.queryForSave[0].data.hasOwnProperty('TECH_RIGHTS') && this.queryForSave[0].data.TECH_RIGHTS[0] === '1') {
                        this._msgSrv.addNewMessage({ title: 'Предупреждение', msg: `Право 'Cистемный технолог.Пользователи' не может быть назначено одновременно с правом 'Администратор системы'`, type: 'warning' });
                        this.cancel();
                        return;
                    }
                }
                if (this.groupDelRK.length > 0) {
                    this.groupDelRK.forEach(Rk => {
                        this.queryForSave.push(Rk);
                    });
                }
                this.apiSrv.setData(this.queryForSave)
                    .then(() => {
                        this._userParamsSetSrv.ProtocolService(this.curentUser.ISN_LCLASSIF, 5);
                        this.queryForSave = [];
                        this.listRight = [];
                        this.selectedNode = null;
                        this.editMode = false;
                        this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                        this.flagDel = false;
                        this._storageSrv.removeItem('abs_prav_mas');
                        if (!flag) {
                            return this._userParamsSetSrv.getUserIsn({
                                expand: 'USER_PARMS_List,USERDEP_List,USER_RIGHT_DOCGROUP_List,USER_TECH_List,USER_ORGANIZ_List,USERCARD_List/USER_CARD_DOCGROUP_List'
                            })
                                .then(() => {
                                    this.init();
                                });
                        }
                    }).catch((e) => {
                        this._errorSrv.errorHandler(e);
                        this.cancel();
                    });
            } else {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: 'Ни один из незаблокированных пользователей не имеет права "Системный технолог" с доступом к модулю "Пользователи" без ограничений.',
                    dismissOnTimeout: 5000
                });
                this.cancel();
            }
        }
        ).catch((e) => {
            this._errorSrv.errorHandler(e);
            this.cancel();
        });
        // this.selectedNode = null;
    }
    cancel() {
        this.queryForSave = [];
        this.selectedNode = null;
        this.editMode = false;
        this.btnDisabled = true;
        this.flagDel = false;
        this._storageSrv.removeItem('abs_prav_mas');
        this._pushState();
        this._userParamsSetSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERDEP_List,USER_RIGHT_DOCGROUP_List,USER_TECH_List,USER_ORGANIZ_List,USERCARD_List/USER_CARD_DOCGROUP_List'
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
        this.formAllEditType();
    }
    clickLable(event, item: NodeAbsoluteRight) {
        event.preventDefault();
        event.stopPropagation();
        /* if (!this.editMode) {
            return;
        } */
        // console.log(event, item);
        if (event.target.tagName === 'LABEL') { // click to label
            this.selectedNode.ischeckedAll = false;
            this.selectNode(item);
        }
        if (event.target.tagName === 'SPAN' && this.editMode && item.control.disabled !== true) { // click to checkbox
            const value = !(+item.value);

            item.value = +value;
            if (
                !value &&
                (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.department ||
                    item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz ||
                    item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthor ||
                    item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject)
            ) {
                this._deleteAllDep(item);
                if (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz) {
                    this._deleteAllOrg(item);
                }
            }
            if (!value && (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.docGroup)) {
                this._deleteAllDocGroup(item);
            }
            if (!value && (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.classif)) {
                this._deleteAllClassif(item);
            }
            // if (!value && (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.editOrganiz)) {
            //     this._deleteAllOrgType(item);
            // }
            if (item !== this.selectedNode && item.isCreate) {
                this.selectNode(item);
            }
            if (item.value === 1 && item.contentProp === 5) {
                this.selectedNode.ischeckedAll = true;
            }
        }
    }

    updateFuncList(funcList: string, flag: boolean): string {
        const func = [];
        if (flag) {
            if (funcList[3] === '1') {
                funcList.split('').forEach((Num, index) => {
                    if (index === 3) {
                        func.push('0');
                    } else {
                        func.push(Num);
                    }
                });
            }
        } else {
            if (funcList[3] === '0') {
                funcList.split('').forEach((Num, index) => {
                    if (index === 3) {
                        func.push('1');
                    } else {
                        func.push(Num);
                    }
                });
            }
        }
        return func.join('');
    }
    usercardMerg(user: string, DUE_CARD: string, func: string) {
        return {
            method: 'MERGE',
            requestUri: `${user}USERCARD_List('${this.curentUser.ISN_LCLASSIF} ${DUE_CARD}')`,
            data: {
                FUNCLIST: func
            }
        };
    }
    checkGroupDelRK(flag: boolean) {
        this.groupDelRK = [];
        const arDocGroup: USER_RIGHT_DOCGROUP[] = [];
        this.curentUser['USERCARD_List'].forEach(elem => {
            elem['USER_CARD_DOCGROUP_List'].forEach(card => {
                if (card.FUNC_NUM === 4) {
                    arDocGroup.push(card);
                }
            });
        });
        const user: string = `USER_CL(${this.curentUser.ISN_LCLASSIF})/`;
        if (flag) {
            const answer = confirm(this.GRUP_DEL_RK);
            if (answer) {
                this.curentUser['USERCARD_List'].forEach(elem => {
                    if (elem.FUNCLIST[3] === '0') {
                        const func = this.updateFuncList(elem.FUNCLIST, false);
                        this.groupDelRK.push(this.usercardMerg(user, elem.DUE, func));
                        const ch = {
                            method: 'POST',
                        };
                        ch['requestUri'] = `${user}USERCARD_List('${this.curentUser.ISN_LCLASSIF} ${elem.DUE}')/USER_CARD_DOCGROUP_List`;
                        ch['data'] = {
                            ISN_LCLASSIF: this.curentUser.ISN_LCLASSIF,
                            DUE_CARD: elem.DUE,
                            DUE: '0.',
                            FUNC_NUM: 4,
                            ALLOWED: 1,
                        };
                        this.groupDelRK.push(ch);
                    }
                });
            }
        } else if (arDocGroup.length > 0) {
            const answer = confirm(this.GRUP_NOT_DEL_RK);
            if (answer) {
                this.curentUser['USERCARD_List'].forEach(elem => {
                    const func = this.updateFuncList(elem.FUNCLIST, true);
                    elem['USER_CARD_DOCGROUP_List'].forEach(card => {
                        if (card.FUNC_NUM === 4) {
                            this.groupDelRK.push(this.usercardMerg(user, card.DUE_CARD, func));
                            const ch = {
                                method: 'DELETE',
                            };
                            const uri = `${user}USERCARD_List('${this.curentUser.ISN_LCLASSIF} ${card.DUE_CARD}')/USER_CARD_DOCGROUP_List('${this.curentUser.ISN_LCLASSIF} ${card.DUE_CARD} ${card.DUE} 4')`;
                            ch['requestUri'] = uri;
                            this.groupDelRK.push(ch);
                        }
                    });
                });
            }
        }
    }


    checkRcpd($event, item: NodeAbsoluteRight) {
        if ($event.target.tagName === 'SPAN' && this.editMode) {
            const flag = item.control.value;
            if (item.key === '5') {
                this.checkRcpdDelete(flag);
            }
            if (item.key === '28') {
                this.checkExecOrder(flag);
            }
            if (item.key === '18') {
                setTimeout(() => this.checkGroupDelRK(flag), 500);
            }
        }
    }
    returnElemListRight(key: string) {
        let elemReturn;
        this.listRight.forEach(elem => {
            if (elem.key === key) {
                elemReturn = elem;
            }
        });
        return elemReturn;
    } // '5' '28'
    checkRcpdDelete(flag: boolean) {
        if (!flag) {
            if (this.returnElemListRight('28').value) {
                return new Promise((res) => {
                    if (confirm(this.DELETE_RCPD)) {
                        res(true);
                    } else {
                        res(false);
                    }
                }).then(f => {
                    if (f) {
                        this.returnElemListRight('28').control.patchValue(false);
                        this.returnElemListRight('28').value = 0;
                        this._deleteAllDocGroup(this.returnElemListRight('28'));
                    }
                });
            }
        }
    }
    createRcpdD() {
        this.returnElemListRight('28').control.patchValue(true);
        this.returnElemListRight('28').control.markAsTouched();
        this.returnElemListRight('28').value = 1;
        this.selectNode(this.returnElemListRight('28'));
    }
    checkExecOrder(flag: boolean) {
        setTimeout(() => {
            return new Promise((res, rej) => {
                if (flag) {
                    if (this.returnElemListRight('5').control.value) {
                        res(false);
                    } else {
                        const f = confirm(this.CREATE_RCPD);
                        if (f) {
                            res(true);
                        } else {
                            res(false);
                        }
                    }
                }
            }).then(answer => {
                if (answer) {
                    this.returnElemListRight('5').control.patchValue(true);
                    this.returnElemListRight('5').control.markAsTouched();
                    this.returnElemListRight('5').value = 1;
                    this.selectNode(this.returnElemListRight('5'));
                }
            });
        }, 500);
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
        for (let index = 0; index < this.listRight.length; index++) {
            if (node.key === this.listRight[index].key) {
                this.selectListNode = index;
                return;
            }
        }
    }
    checkChange(event?) {
        if (event && event === 'del') {
            this.flagDel = true;
        }
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
        if (this.flagDel) {
            this.btnDisabled = false;
        }
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
            if (this.editMode) {
                this.formGroupAll.enable({ emitEvent: false });
            } else {
                this.formGroupAll.disable({ emitEvent: false });
            }
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
                this.rightContent = true;
                // if (this.selectedNode.value) {
                //     setTimeout(() => {
                //         this.rightContent = true;
                //     }, 0);
                // }
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.classif:
            case E_RIGHT_DELO_ACCESS_CONTENT.docGroup:
            case E_RIGHT_DELO_ACCESS_CONTENT.department:
            case E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz:
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
    private _deleteAllOrg(item: NodeAbsoluteRight) {
        const list: ORGANIZ_CL[] = [];
        this.curentUser['USER_ORGANIZ_List'] = this.curentUser['USER_ORGANIZ_List'].filter(li => {
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

    // private _deleteAllOrgType(node: NodeAbsoluteRight) {
    //     node.deleteChange();
    //     const list = this.curentUser.USER_EDIT_ORG_TYPE_List;
    //     if (list.length) {
    //         list.forEach((item: USER_EDIT_ORG_TYPE) => {
    //             node.pushChange({
    //                 method: 'DELETE',
    //                 isn_org: item.ISN_ORG_TYPE,
    //                 data: item
    //             });
    //         });
    //         //   this._userParamsSetSrv.userEditOrgType.splice(0,  this._userParamsSetSrv.userEditOrgType.length);
    //         this.checkChange();
    //     }
    // }

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
            case E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz:
                if (chenge.data.hasOwnProperty('DEEP')) {
                    url = `/USERDEP_List${chenge.method === 'POST' ? '' : `('${uId} ${chenge.due} ${chenge.data['FUNC_NUM']}')`}`;
                } else {
                    url = `/USER_ORGANIZ_List${chenge.method === 'POST' ? '' : `('${uId} ${chenge.due} ${chenge.data['FUNC_NUM']}')`}`;
                }
                break;
        }
        let batch = {};
        // if (node.contentProp === 5) {
        //     batch = this._batchEditOrgType(chenge, uId);
        // } else {
        batch = {
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
    // private _batchEditOrgType(chenge: IChengeItemAbsolute, uId) {
    //     const batch = {};
    //     batch['method'] = chenge.method;
    //     if (chenge.method === 'POST') {
    //         batch['requestUri'] = `USER_CL(${uId})/USER_EDIT_ORG_TYPE_List`;
    //         delete chenge.data['CompositePrimaryKey'];
    //         delete chenge.data['__metadata'];
    //         batch['data'] = chenge.data;
    //     }
    //     if (chenge.method === 'DELETE') {
    //         batch['requestUri'] = `USER_CL(${uId})/USER_EDIT_ORG_TYPE_List(\'${uId} ${chenge.isn_org}\')`;
    //     }
    //     return batch;
    // }
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
    private _checkKey(node): boolean {
        return /* node.key === '4' || */ node.key === '24' || node.key === '25';
    }
    private _checkCreateNotEmpty(): boolean {
        let allowed = false;
        this.listRight.forEach((node: NodeAbsoluteRight) => {
            if (this._checkKey(node) && node.value === 1) {
                let flag = true;
                this.curentUser.USERDEP_List.filter(li => {
                    if (li['FUNC_NUM'] === +node.key + 1) {
                        flag = false;
                    }
                });
                if (flag) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Не заданы подразделения для права ' + node.label
                    });
                }
                if (!allowed) {
                    allowed = flag;
                }
            }
        });
        return allowed;
    }
    private _checkKeyOrgan(node): boolean {
        return node.key === '4' || node.key === '5' || node.key === '10' || node.key === '11';
    }
    private _checkCreateNotEmptyOrgan(): boolean {
        let allowed = false;
        this.listRight.forEach((node: NodeAbsoluteRight) => {
            if (this._checkKeyOrgan(node) && node.value === 1) {
                let flag = true;
                let flag_org = true;
                this.curentUser.USERDEP_List.filter(li => {
                    if (li['FUNC_NUM'] === +node.key + 1) {
                        flag = false;
                    }
                });
                this.curentUser['USER_ORGANIZ_List'].forEach(li => {
                    if (li['FUNC_NUM'] === +node.key + 1) {
                        flag_org = false;
                    }
                });
                if (flag && flag_org) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Не заданы подразделения для права ' + node.label
                    });
                }
                if (!allowed) {
                    allowed = flag && flag_org;
                }
            }
        });
        return allowed;
    }
    private _pushState() {
        this._userParamsSetSrv.setChangeState({ isChange: !this.btnDisabled });
    }
}
