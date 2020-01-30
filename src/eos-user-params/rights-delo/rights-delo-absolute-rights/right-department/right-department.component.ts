import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IParamUserCl, INodeDocsTreeCfg } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { USERDEP, DEPARTMENT } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { NodeAbsoluteRight } from '../node-absolute';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { RestError } from 'eos-rest/core/rest-error';
import { OPEN_CLASSIF_DEPARTMENT_FULL, OPEN_CLASSIF_DEPARTMENT_SEND_CB } from 'app/consts/query-classif.consts';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { EosStorageService } from 'app/services/eos-storage.service';
import { AppContext } from 'eos-rest/services/appContext.service';

@Component({
    selector: 'eos-right-absolute-department',
    templateUrl: 'right-department.component.html'
})
export class RightDepertmentComponent implements OnInit {
    @Input() editMode: boolean;
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() listRigth: NodeAbsoluteRight[];
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();
    @Output() createRcpdD = new EventEmitter();
    @Output() emitDeletedRc = new EventEmitter();

    isLoading: boolean = false;
    massMy: USERDEP[] = [];
    userDep: USERDEP[];
    funcNum: number;
    userDepFuncNumber: USERDEP[];
    listUserDep: NodeDocsTree[] = [];
    depList: DEPARTMENT[];
    isShell: Boolean = false;
    selectedDep: NodeDocsTree;
    checkFlag: boolean = false;
    constructor(
        private _msgSrv: EosMessageService,
        private _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,
        private apiSrv: UserParamApiSrv,
        private _storageSrv: EosStorageService,
        private _appContext: AppContext,
    ) {
    }
    desc(a: DEPARTMENT, b: DEPARTMENT) {
        if (a.WEIGHT > b.WEIGHT) {
            return 1;
        }
        if (a.WEIGHT < b.WEIGHT) {
            return -1;
        }
        return 0;
    }
    ngOnInit() {
        this.listUserDep = [];
        if (this._storageSrv.getItem('abs_prav_mas')) {
            this.massMy = this._storageSrv.getItem('abs_prav_mas');
        }
        this.isLoading = true;
        this.userDep = this.curentUser['USERDEP_List'];
        this.funcNum = +this.selectedNode.key + 1;
        if (this.selectedNode.isCreate && this.userDep.filter(i => i['FUNC_NUM'] === this.funcNum).length === 0) {
            if (this.funcNum === 3 && this._appContext.cbBase) {
                this.addNewDepAll();
            } else {
                this.addDep();
            }
            this.isLoading = false;
            return;
        }
        this.userDepFuncNumber = this.userDep.filter(i => i['FUNC_NUM'] === this.funcNum);
        if (this.userDepFuncNumber.length > 0) {
            const str: string[] = this.userDepFuncNumber.map(i => i.DUE);
            this.apiSrv.getDepartment(str)
                .then((data: DEPARTMENT[]) => {
                    if (this.funcNum === 3 && this._appContext.cbBase) {
                        data.sort((a, b) => this.desc(a, b));
                    }
                    data.forEach((dep: DEPARTMENT) => {
                        const userDep: USERDEP = this.userDepFuncNumber.find((ud: USERDEP) => dep.DUE === ud.DUE);
                        const cfg: INodeDocsTreeCfg = {
                            due: userDep.DUE,
                            label: dep.CLASSIF_NAME,
                            allowed: !!userDep.DEEP,
                            data: {
                                dep: dep,
                                userDep: userDep,
                            },
                        };
                        let flag;
                        this.addFieldChwckProp(cfg, dep.IS_NODE, userDep.DEEP);
                        if (this.funcNum === 3 && this._appContext.cbBase) {
                            cfg.allowed = !!userDep.ALLOWED;
                            cfg.viewAllowed = true;
                            if (cfg.label === ' ') {
                                cfg.label = 'Все подразделения';
                            }
                            flag = true;
                        }
                        if (!(this.getAllDep && cfg.due === '0.')) {
                            const elem = new NodeDocsTree(cfg, flag);
                            this.listUserDep.push(elem);
                        } else {
                            this.checkFlag = true;
                        }
                    });
                    this.isLoading = false;
                })
                .catch(e => {
                    if (e instanceof RestError && (e.code === 434 || e.code === 0)) {
                        return undefined;
                    } else {
                        const errMessage = e.message ? e.message : e;
                        this._msgSrv.addNewMessage({
                            type: 'danger',
                            title: 'Ошибка обработки. Ответ сервера:',
                            msg: errMessage
                        });
                        return null;
                    }
                });
        } else {
            this.isLoading = false;
        }
    }
    returnOgrani(): boolean {
        if (this._appContext.limitCardsUser.length > 0) {
            return true;
        }
        return false;
    }
    returnDelTech() {
        if (this._appContext.limitCardsUser.length && this._appContext.limitCardsUser.indexOf(this.selectedDep.data.dep['DEPARTMENT_DUE']) !== -1) {
                return false;
        }
        return true;
    }
    addFieldChwckProp(node: INodeDocsTreeCfg, is_node: number, deep: number) {
        if (this.selectedNode['_constData'].data.flagcheck) {
            if (is_node === 0) {
                node['flagCheckNode'] = {
                    deepValue: deep,
                };
                node.viewAllowed = true;
            } else {
                node.viewAllowed = false;
            }
        } else {
            node.viewAllowed = false;
        }
    }
    selectNoAllDep() {
        if (this.funcNum === 3 && this._appContext.cbBase && this.selectedDep && this.selectedDep.DUE === '0.') {
            return false;
        }
        return true;
    }
    selectNode(dep: NodeDocsTree) {
        this.selectedDep = dep;
    }
    addNewDepAll(): Promise<any> {
        return this._userParmSrv.getDepartmentFromUser(['0.'])
        .then((data: DEPARTMENT[]) => {
            const newNodes: NodeDocsTree[] = [];
            data.forEach((dep: DEPARTMENT) => {
                const newUserDep: USERDEP = this._userParmSrv.createEntyti<USERDEP>({
                    ISN_LCLASSIF: this._userParmSrv.userContextId,
                    DUE: dep.DUE,
                    FUNC_NUM: this.funcNum,
                    WEIGHT: null,
                    DEEP: 1,
                    ALLOWED: null,
                }, 'USERDEP');
                const cfg: INodeDocsTreeCfg = {
                    due: newUserDep.DUE,
                    label: '',
                    allowed: !!newUserDep.DEEP,
                    data: {
                        dep: dep,
                        userDep: newUserDep,
                    },
                };
                this.addFieldChwckProp(cfg, dep.IS_NODE, newUserDep.DEEP);
                if (this.funcNum === 3 && this._appContext.cbBase) {
                    cfg.label = 'Все подразделения';
                    newUserDep.ALLOWED = this._appContext.limitCardsUser.length > 0 ? 0 : 1;
                    cfg.allowed = this._appContext.limitCardsUser.length > 0 ? false : true;
                    cfg.viewAllowed = true;
                }
                const newNode = new NodeDocsTree(cfg, true);
                this.curentUser.USERDEP_List.push(newUserDep);
                    this.selectedNode.pushChange({
                        method: 'POST',
                        due: newUserDep.DUE,
                        data: newUserDep
                    });
                newNodes.push(newNode);
            });
            this.confirmPkpd();
            this.listUserDep = this.listUserDep.concat(newNodes);
            this.selectedNode.isCreate = false;
            this.isShell = false;
            this.Changed.emit();
        });
    }
    findParent(due: string) {
        const n = due.split('.');
        n.pop();
        const d = due + '.';
        if (d !== '0.') {
            const findElement = this.listUserDep.filter((element: NodeDocsTree) => {
                return element.DUE === d;
            });
            if (findElement[0]) {
                return findElement[0].isAllowed ? true : false;
            } else {
                return this.findParent(n.join('.'));
            }
        } else {
            return this.listUserDep[0].isAllowed ? true : false;
        }
    }
    addDep(): Promise<any> {
        this.isShell = true;
        const DEPART = (this.funcNum === 3 && this._appContext.cbBase) ? OPEN_CLASSIF_DEPARTMENT_SEND_CB : OPEN_CLASSIF_DEPARTMENT_FULL;

        return this._waitClassifSrv.openClassif(DEPART)
            .then((data: string) => {
                if (data === '') {
                    throw new Error();
                }
                return this._userParmSrv.getDepartmentFromUser(data.split('|'));
            })
            .then((data: DEPARTMENT[]) => {
                if (this._appContext.limitCardsUser.length > 0) {
                    data = this._checkLimitCard(data);
                }
                if (this._checkRepeat(data)) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Нет элементов для добавления'
                    });
                    this.isShell = false;
                    return;
                }

                const newNodes: NodeDocsTree[] = [];
                data.forEach((dep: DEPARTMENT) => {
                    const newUserDep: USERDEP = this._userParmSrv.createEntyti<USERDEP>({
                        ISN_LCLASSIF: this._userParmSrv.userContextId,
                        DUE: dep.DUE,
                        FUNC_NUM: this.funcNum,
                        WEIGHT: (this.funcNum === 3 && this._appContext.cbBase) ? null : this._getMaxWeight(),
                        DEEP: 1,
                        ALLOWED: null,
                    }, 'USERDEP');
                    const cfg: INodeDocsTreeCfg = {
                        due: newUserDep.DUE,
                        label: dep.CLASSIF_NAME,
                        allowed: !!newUserDep.DEEP,
                        data: {
                            dep: dep,
                            userDep: newUserDep,
                        },
                    };
                    this.addFieldChwckProp(cfg, dep.IS_NODE, newUserDep.DEEP);
                    let flag;
                    if (this.funcNum === 3 && this._appContext.cbBase) {
                        newUserDep.ALLOWED = this.findParent(newUserDep.DUE) ? 0 : 1;
                        cfg.allowed = this.findParent(newUserDep.DUE) ? false : true;
                        cfg.viewAllowed = true;
                        flag = true;
                    }
                    const newNode = new NodeDocsTree(cfg, flag);
                    this.curentUser.USERDEP_List.push(newUserDep);
                        this.selectedNode.pushChange({
                            method: 'POST',
                            due: newUserDep.DUE,
                            data: newUserDep
                        });
                    newNodes.push(newNode);
                });
                this.confirmPkpd();
                this.listUserDep = this.listUserDep.concat(newNodes);
                this.selectedNode.isCreate = false;
                this.isShell = false;
                this.Changed.emit();
            })
            .catch(() => {
                this.isShell = false;
                if (this.selectedNode.isCreate) {
                    this.selectedNode.value = 0;
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Необходимо выбрать элемент'
                    });
                } else if (this.checkAllDep && this.listUserDep.length === 0) {
                    this.checkFlag = true;
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Необходимо выбрать элемент'
                    });
                    return Promise.reject('cancel');
                }
            });
    }
    // только для исполнения поручений, спрашиваем на создание права ркпд
    confirmPkpd() {
        if (this.selectedNode.key === '5' && this.selectedNode.isCreate && !this.listRigth[8].control.value) {
            return new Promise((res, rej) => {
                if (confirm('У пользователя нет права \'создание РКПД\', создать его?')) {
                    res(true);
                } else {
                    res(false);
                }
            }).then(f => {
                if (f) {
                    this.createRcpdD.emit();
                }
            });
        }
    }
    DeleteDep() {
        this.curentUser['USERDEP_List'] = this.curentUser['USERDEP_List'].filter(i => {
            if (i['DUE'] === this.selectedDep.DUE) {
                return i['FUNC_NUM'] !== this.selectedDep.data.userDep['FUNC_NUM'];
            }
            return true;
        });
        if (this.getAllDep) {
            this.curentUser._orig['USERDEP_List'] = this.curentUser._orig['USERDEP_List'].filter(i => {
                if (i['DUE'] === this.selectedDep.DUE && !i['CompositePrimaryKey']) {
                    return i['FUNC_NUM'] !== this.selectedDep.data.userDep['FUNC_NUM'];
                }
                return true;
            });
        }
        this.listUserDep = this.listUserDep.filter(n => n !== this.selectedDep);
        if (!this.listUserDep.length && !this.getAllDep) {
            this.selectedNode.value = 0;
        }
        this.selectedNode.pushChange({
            method: 'DELETE',
            due: this.selectedDep.DUE,
            data: this.selectedDep.data.userDep
        });
        if (this.funcNum === 3 && this._appContext.cbBase && this.selectedDep.data.userDep['CompositePrimaryKey']) {
            let flag = true;
            this.selectedNode.change.forEach(elem => {
                if (elem.method === 'DELETE' && this.selectedDep.DUE === elem.due) {
                    flag = false;
                }
            });
            if (flag) {
                this.selectedNode.pushChange({
                    method: 'DELETE',
                    due: this.selectedDep.DUE,
                    data: this.selectedDep.data.userDep
                });
            }
        }
        this.emitDeleteRcpd();
        this.selectedDep = null;
        this.Changed.emit('del');
    }
    emitDeleteRcpd() {
        if (this.selectedNode.key === '5' && this.selectedNode.value === 0 && this.listRigth[8].control.value) {
            this.emitDeletedRc.emit();
        }
    }
    markedSendPrj(event) {
        this.selectedNode.value = event.target.checked ? 2 : 1;
    }
    checkedNode($event: NodeDocsTree) {
        if (this.funcNum === 3 && this._appContext.cbBase) {
            /* $event.flagCheckNode.deepValue = Number($event.isAllowed); */
            const a = Object.assign({}, $event.data.userDep, { DEEP: Number($event.isAllowed) });
            a['ALLOWED'] = Number($event.isAllowed);
            /* delete a['CompositePrimaryKey']; */
            this.selectedNode.pushChange({
                method: 'MERGE',
                due: $event.DUE,
                user_cl: true,
                data: a
            });
            this.Changed.emit();
        } else {
            $event.flagCheckNode.deepValue = Number($event.isAllowed);
            const a = Object.assign({}, $event.data.userDep, { DEEP: Number($event.isAllowed) });
            delete a['CompositePrimaryKey'];
            this.selectedNode.pushChange({
                method: 'MERGE',
                due: $event.DUE,
                user_cl: true,
                data: a
            });
            this.Changed.emit();
        }
    }
    querySaveDell(): any[] {
        /* if (this.curentUser.USERDEP_List.length < this.curentUser._orig.USERDEP_List.length) { */
            const intersection = this.curentUser._orig.USERDEP_List.filter(element => !(this.curentUser.USERDEP_List.indexOf(element) !== -1));
            return intersection;
        /* }
        return []; */
    }
    updateDell() {
        const changeList = this.querySaveDell();
        changeList.forEach(date => {
            if (date['FUNC_NUM'] === this.funcNum && date.DUE !== '0.') {
                this.selectedNode.pushChange({
                    method: 'DELETE',
                    due: date.DUE,
                    data: date
                });
            }
        });
    }
    get getAllDep() {
        return this.selectedNode && (this.selectedNode.key === '4' || this.selectedNode.key === '24' || this.selectedNode.key === '25');
    }
    checkAllDep() {
        return this.getAllDep && this.selectedNode.value === 2 ? true : false;
    }
    checkForAll(event) {
        this.checkFlag = !this.checkFlag;
        if (this.checkFlag) {
            this.selectedNode.deleteChange();
            this.deleteAllDep();
        } else {
            this.selectedNode.deleteChange();
            this.updateDell();
            if (this.massMy.length > 0) {
                this.deletForAll();
            } else {
                this.addDep()
                    .then(() => {
                        // this.selectedNode.value = 1;
                        this.delDepMy();
                        this.ngOnInit();
                    }).catch((error) => {

                    });
            }
        }
    }
    deletForAll() {
        this.updateDell();
        const str: string[] = [];
        this.massMy.forEach((data: USERDEP) => {
            str.push(data.DUE);
        });
        this.apiSrv.getDepartment(str)
            .then(el => {
                this.selectedNode.deleteChange();
                this.delDepMy();
                this.addDepMy(el);
                this.updateDell();
                this.ngOnInit();
            });
    }
    deleteAllDep() {
        this.massMy = [];
        this.updateDell();
        this.curentUser['USERDEP_List'] = this.curentUser['USERDEP_List'].filter(i => {
            if (i['FUNC_NUM'] === this.funcNum) {
                this.massMy.push(i);
                if (i['CompositePrimaryKey']) {
                    this.selectedNode.pushChange({
                        method: 'DELETE',
                        due: i.DUE,
                        data: i
                    });
                }
                return false;
            } else {
                return true;
            }
        });
        let elem: USERDEP;
        this.curentUser._orig['USERDEP_List'].forEach(i => {
            if (i['FUNC_NUM'] === this.funcNum && i['DUE'] === '0.' && i['CompositePrimaryKey']) {
                elem = i;
            }
        });
        const newUserDep: USERDEP = this._userParmSrv.createEntyti<USERDEP>({
            ISN_LCLASSIF: this._userParmSrv.userContextId,
            DUE: '0.',
            FUNC_NUM: this.funcNum,
            WEIGHT: null,
            DEEP: 1,
            ALLOWED: null,
        }, 'USERDEP');
        if (elem) {
            this.curentUser.USERDEP_List.push(elem);
            /* this.selectedNode.pushChange({
                method: 'POST',
                due: '0.',
                data: elem
            }); */
        } else {
            this.curentUser.USERDEP_List.push(newUserDep);
            this.selectedNode.pushChange({
                method: 'POST',
                due: '0.',
                data: newUserDep
            });
        }
        this.selectedDep = null;
        this._storageSrv.setItem('abs_prav_mas', this.massMy);
        this.ngOnInit();
        this.Changed.emit();
    }
    delDepMy() {
        let flag = false;
        let elem: USERDEP;
        this.curentUser['USERDEP_List'] = this.curentUser['USERDEP_List'].filter(i => {
            if (i['FUNC_NUM'] === this.funcNum && i['DUE'] === '0.') {
                elem = i;
                if (i['CompositePrimaryKey']) {
                    flag = true;
                }
                return false;
            }
            return true;
        });
        if (flag) {
            this.selectedNode.pushChange({
                method: 'DELETE',
                due: '0.',
                data: elem
            });
        }
        this.selectedDep = null;
        this.Changed.emit();
    }
    addDepMy(elem) {
        elem.forEach((dep: DEPARTMENT) => {
            const userDep: USERDEP = this.massMy.find((ud: USERDEP) => dep.DUE === ud.DUE);
            const cfg: INodeDocsTreeCfg = {
                due: userDep.DUE,
                label: dep.CLASSIF_NAME,
                allowed: null,
                data: {
                    /* dep: dep, */
                    /* userDep: userDep, */
                },
            };
            this.listUserDep.push(new NodeDocsTree(cfg));
        });
        this.massMy.forEach(dat => {
            if (!dat['CompositePrimaryKey']) {
                this.selectedNode.pushChange({
                    method: 'POST',
                    due: dat.DUE,
                    data: dat
                });
            }
        });
        this.curentUser.USERDEP_List = this.curentUser.USERDEP_List.concat(this.massMy);
        this.massMy = [];
        this._storageSrv.removeItem('abs_prav_mas');
        this.Changed.emit();
    }

    private _getMaxWeight(): number {
        let w = 0;
        this.userDep.forEach(i => {
            if (i.WEIGHT > w) {
                w = i.WEIGHT;
            }
        });
        return w;
    }
    private _checkRepeat(arrDep: DEPARTMENT[]) {
        this.listUserDep.forEach((node: NodeDocsTree) => {
            const index = arrDep.findIndex((doc: DEPARTMENT) => doc.DUE === node.DUE);
            if (index !== -1) {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: `Элемент \'${arrDep[index].CLASSIF_NAME}\' не будет добавлен\nтак как он уже существует`
                });
                arrDep.splice(index, 1);
            }
        });
        if (arrDep.length) {
            return false;
        }
        return true;
    }
    private _checkLimitCard(arrDep: DEPARTMENT[]) {
        return arrDep.filter(elem => {
            if (this._appContext.limitCardsUser.indexOf(elem['DEPARTMENT_DUE']) === -1) {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: `Элемент \'${elem.CLASSIF_NAME}\' не будет добавлен\nтак как он не принадлежит вашим картотекам`
                });
                return false;
            }
            return true;
        });
    }
}
