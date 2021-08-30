import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IParamUserCl, INodeDocsTreeCfg } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { USERDEP, DEPARTMENT } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { NodeAbsoluteRight } from '../node-absolute';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { RestError } from 'eos-rest/core/rest-error';
import { OPEN_CLASSIF_DEPARTMENT_FULL } from 'app/consts/query-classif.consts';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { EosStorageService } from 'app/services/eos-storage.service';
import { AppContext } from 'eos-rest/services/appContext.service';

@Component({
    selector: 'eos-right-absolute-depart-organiz',
    templateUrl: 'right-dep-org.component.html'
})
export class RightOrganizDepertComponent implements OnInit {
    @Input() editMode: boolean;
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() listRigth: NodeAbsoluteRight[];
    @Input() curentUser: IParamUserCl;
    @Input() resolutions: number;
    @Output() Changed = new EventEmitter();
    @Output() createRcpdD = new EventEmitter();
    @Output() emitDeletedRc = new EventEmitter();
    @Output() independetRight = new EventEmitter();

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
    ngOnInit() {
        this.listUserDep = [];
        if (this._storageSrv.getItem('abs_prav_mas')) {
            this.massMy = this._storageSrv.getItem('abs_prav_mas');
        }
        this.isLoading = true;
        this.userDep = this.curentUser['USERDEP_List'];
        this.funcNum = +this.selectedNode.key + 1;
        if (this.selectedNode.isCreate && this.userDep.filter(i => i['FUNC_NUM'] === this.funcNum).length === 0) {
            // this.addDep();
            this.isLoading = false;
            return;
        }
        this.userDepFuncNumber = this.userDep.filter(i => i['FUNC_NUM'] === this.funcNum);
        if (this.userDepFuncNumber.length > 0) {
            const str: string[] = this.userDepFuncNumber.map(i => i.DUE);
            this.apiSrv.getDepartment(str)
                .then((data: DEPARTMENT[]) => {
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
                            weight: userDep.WEIGHT,
                        };
                        this.addFieldChwckProp(cfg, dep.IS_NODE, userDep.DEEP);
                        if (!(this.getAllDep && cfg.due === '0.')) {
                            this.listUserDep.push(new NodeDocsTree(cfg));
                        } else {
                            this.checkFlag = true;
                        }
                    });
                    this._sortWeight();
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
    selectNode(dep: NodeDocsTree) {
        this.selectedDep = dep;
    }
    addDep(): Promise<any> {
        this.isShell = true;
        return this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT_FULL)
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
                        WEIGHT: -1,
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
                        weight: this._getNewWeight(),
                    };
                    this.addFieldChwckProp(cfg, dep.IS_NODE, newUserDep.DEEP);
                    const newNode = new NodeDocsTree(cfg);
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
                this._changeWeight();
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
                    // this.checkFlag = true;
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Элемент не был выбран'
                    });
                    return Promise.resolve('cancel');
                }
            });
    }
    // только для исполнения поручений, спрашиваем на создание права ркпд P.S. из-за изменений этот код больше не отрабатывает если понадобиться то
    // this.selectedNode.key === '31'
    // Проверка 'Создание РКПД' по ключу, вместо поиска по индексу в массиве
    confirmPkpd() {
        const rkpdRight = this.listRigth.filter((right) => right.key === '28')[0];
        if (this.selectedNode.key === '31' && this.selectedNode.isCreate && !rkpdRight.control.value) {
            return new Promise((res, rej) => {
                if (confirm('У пользователя нет права \'Создание РКПД\', создать его?')) {
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
        this.selectedNode.pushChange({
            method: 'DELETE',
            due: this.selectedDep.DUE,
            data: this.selectedDep.data.userDep
        });
        // this.emitDeleteRcpd();
        // удаляем weightChanges для удаленной записи
        this.selectedNode.filterWeightChanges(this.selectedDep.DUE);
        this.selectedDep = null;
        this._changeWeight();
        this.Changed.emit('del');
    }
    /* emitDeleteRcpd() {
        if (this.selectedNode.key === '31' && this.selectedNode.value === 0 && this.listRigth[9].control.value) {
            this.emitDeletedRc.emit();
        }
    } */
    markedSendPrj(event) {
        this.selectedNode.value = event.target.checked ? 2 : 1;
    }
    checkedNode($event: NodeDocsTree) {
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
    querySaveDell(): any[] {
        const intersection = this.curentUser._orig.USERDEP_List.filter(element => !(this.curentUser.USERDEP_List.indexOf(element) !== -1));
        return intersection;
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
        return this.selectedNode && (this.selectedNode.key === '4' || this.selectedNode.key === '24' || this.selectedNode.key === '25' || this.selectedNode.key === '33');
    }
    checkAllDep() {
        return this.getAllDep && this.selectedNode.value === 2 ? true : false;
    }
    returnOrgan(): any[] {
        const arr = [];
        this.selectedNode.change.forEach(elem => {
            if (elem.data['DEEP'] === undefined) {
                arr.push(elem);
            }
        });
        return arr;
    }
    returnOgrani(): boolean {
        if (this._appContext.limitCardsUser.length > 0) {
            return true;
        }
        return false;
    }
    returnDelTech() {
        if (!this._appContext.limitCardsUser.length || this._appContext.limitCardsUser.indexOf(this.selectedDep.data.dep['DEPARTMENT_DUE']) !== -1) {
            return false;
        }
        return true;
    }
    checkForAll(event) {
        this.checkFlag = !this.checkFlag;
        if (this.checkFlag) {
            const arr = this.returnOrgan();
            this.selectedNode.deleteChange();
            arr.forEach(elem => {
                this.selectedNode.pushChange(elem);
            });
            this.deleteAllDep();
        } else {
            const arr = this.returnOrgan();
            this.selectedNode.deleteChange();
            this.updateDell();
            arr.forEach(elem => {
                this.selectedNode.pushChange(elem);
            });
            if (this.massMy.length > 0) {
                this.deletForAll();
            } else {
                this.addDep()
                    .then(() => {
                        // this.selectedNode.value = 1;
                        this.delDepMy();
                        this.ngOnInit();
                    }).catch((error) => {
                        // добавил чтобы тут могло быть пустое За всех и без записей
                        this.delDepMy();
                        this.ngOnInit();
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
                const arr = this.returnOrgan();
                this.selectedNode.deleteChange();
                arr.forEach(elem => {
                    this.selectedNode.pushChange(elem);
                });
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


    indepRights() {
        this.independetRight.emit('RESOLUTION');
    }

    setMain() {
        if (this.selectedDep.weight !== 1) {
            this.selectedDep.weight = 0;
            this._changeWeight();
            this.Changed.emit('setMain');
        }
    }

    // private _getMaxWeight(): number {
    //     let w = 0;
    //     this.userDep.forEach(i => {
    //         if (i.WEIGHT > w) {
    //             w = i.WEIGHT;
    //         }
    //     });
    //     return w;
    // }
    private _getNewWeight(): number {
        if (this.userDepFuncNumber && this.userDepFuncNumber.length) {
            this.userDepFuncNumber.sort((nodeA, nodeB) => nodeA.WEIGHT - nodeB.WEIGHT);
            return this.userDepFuncNumber[this.userDepFuncNumber.length - 1].WEIGHT + 1;
            // return this.userDepFuncNumber.length + 1;
        } else {
            return 1;
        }
    }

    private _sortWeight(): void {
        if (this.funcNum !== 3) {
            this.listUserDep.sort((nodeA: NodeDocsTree, nodeB: NodeDocsTree) => nodeA.weight - nodeB.weight);
        }
    }

    private _changeWeight(): void {
        this.listUserDep.sort((nodeA: NodeDocsTree, nodeB: NodeDocsTree) => nodeA.weight - nodeB.weight);
        this.listUserDep.forEach((node: NodeDocsTree, index: number) => {
            if (node.weight !== (index + 1) || node.data.userDep['WEIGHT'] < 1) {
                node.weight = index + 1;
                if (node.weight !== node.data.userDep['WEIGHT'] ) {
                    // удаляем предыдущие изменения веса
                    this.selectedNode.checkWeightChanges(node);
                    // добавляем новый вес
                    this.selectedNode.addWeightChanges(node);
                    this.curentUser['USERDEP_List'].forEach(li => {
                        if (li.FUNC_NUM === this.funcNum && li.DUE === node.DUE) {
                            li.WEIGHT = node.weight;
                        }
                    });
                    return;
                }
            }
        });
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
