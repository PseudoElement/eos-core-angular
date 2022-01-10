import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IParamUserCl, INodeDocsTreeCfg } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { USER_ORGANIZ, ORGANIZ_CL } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { NodeAbsoluteRight } from '../node-absolute';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { RestError } from 'eos-rest/core/rest-error';
import { OPEN_CLASSIF_ORGANIZ_FULL } from 'app/consts/query-classif.consts';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { AppContext } from 'eos-rest/services/appContext.service';

@Component({
    selector: 'eos-right-absolute-organiz-depart',
    templateUrl: 'right-organiz.component.html'
})
export class RightDepertOrganizComponent implements OnInit {
    @Input() editMode: boolean;
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() listRigth: NodeAbsoluteRight[];
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();
    @Output() createRcpdD = new EventEmitter();
    @Output() emitDeletedRc = new EventEmitter();

    isLoading: boolean = false;
    userDep: USER_ORGANIZ[];
    funcNum: number;
    userDepFuncNumber: USER_ORGANIZ[];
    listUserDep: NodeDocsTree[] = [];
    depList: ORGANIZ_CL[];
    isShell: Boolean = false;
    selectedDep: NodeDocsTree;
    checkFlag: boolean = false;
    constructor(
        private _msgSrv: EosMessageService,
        private _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,
        private apiSrv: UserParamApiSrv,
        private _appContext: AppContext,
    ) {
    }
    getLogDelet(item): boolean {
        return item.DUE !== '0.' && !!item['DELETED'] ? true : false;
    }
    ngOnInit() {
        this.listUserDep = [];
        this.isLoading = true;
        this.userDep = this.curentUser['USER_ORGANIZ_List'];
        this.funcNum = +this.selectedNode.key + 1;
        this.userDepFuncNumber = this.userDep.filter(i => i['FUNC_NUM'] === this.funcNum);
        if (this.userDepFuncNumber.length > 0) {
            const str: string[] = this.userDepFuncNumber.map(i => i.DUE);
            this.apiSrv.getOrganization(str)
                .then((data) => {
                    data.forEach((dep) => {
                        const userDep: USER_ORGANIZ = this.userDepFuncNumber.find((ud: USER_ORGANIZ) => dep.DUE === ud.DUE);
                        const cfg: INodeDocsTreeCfg = {
                            due: userDep.DUE,
                            label: dep.CLASSIF_NAME,
                            data: {
                                dep: dep,
                                userDep: userDep,
                            },
                        };
                        this.addFieldChwckProp(cfg, dep.IS_NODE, null);
                        this.listUserDep.push(new NodeDocsTree(cfg, undefined, undefined, this.getLogDelet(dep)));
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
    returnOgrani(): boolean {
        if (this._appContext.limitCardsUser.length > 0) {
            return true;
        }
        return false;
    }
    selectNode(dep: NodeDocsTree) {
        this.listUserDep.forEach(node => {
            node.isSelected = false;
        });
        dep.isSelected = true;
        this.selectedDep = dep;
    }
    addOrganiz(): Promise<any> {
        this.isShell = true;
        return this._waitClassifSrv.openClassif(OPEN_CLASSIF_ORGANIZ_FULL)
            .then((data: string) => {
                if (data === '') {
                    throw new Error();
                }
                return this._userParmSrv.getOrganizFromUser(data.split('|'));
            })
            .then((data: ORGANIZ_CL[]) => {
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
                data.forEach((dep: ORGANIZ_CL) => {
                    const newUserDep: USER_ORGANIZ = this._userParmSrv.createEntyti<USER_ORGANIZ>({
                        ISN_LCLASSIF: this._userParmSrv.userContextId,
                        DUE: dep.DUE,
                        FUNC_NUM: this.funcNum,
                        WEIGHT: this._getMaxWeight(),
                    }, 'USERDEP');
                    const cfg: INodeDocsTreeCfg = {
                        due: newUserDep.DUE,
                        label: dep.CLASSIF_NAME,
                        data: {
                            dep: dep,
                            userDep: newUserDep,
                        },
                    };
                    this.addFieldChwckProp(cfg, dep.IS_NODE, null);
                    const newNode = new NodeDocsTree(cfg, undefined, undefined, this.getLogDelet(dep));
                    this.curentUser['USER_ORGANIZ_List'].push(newUserDep);
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
                }
            });
    }
    // только для исполнения поручений, спрашиваем на создание права ркпд
    // Проверка 'Создание РКПД' по ключу, вместо поиска по индексу в массиве
    confirmPkpd() {
        const rkpdRight = this.listRigth.filter((right) => right.key === '28')[0];
        if (this.selectedNode.key === '31' && this.selectedNode.isCreate && !rkpdRight.control.value) {
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
        this.curentUser['USER_ORGANIZ_List'] = this.curentUser['USER_ORGANIZ_List'].filter(i => {
            if (i['DUE'] === this.selectedDep.DUE) {
                return i['FUNC_NUM'] !== this.selectedDep.data.userDep['FUNC_NUM'];
            }
            return true;
        });
        this.listUserDep = this.listUserDep.filter(n => n !== this.selectedDep);
        this.selectedNode.pushChange({
            method: 'DELETE',
            due: this.selectedDep.DUE,
            data: this.selectedDep.data.userDep
        });
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
        if (this.curentUser.USERDEP_List.length < this.curentUser._orig.USERDEP_List.length) {
            const intersection = this.curentUser._orig.USERDEP_List.filter(element => !this.curentUser.USERDEP_List.includes(element));
            return intersection;
        }
        return [];
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
    private _checkRepeat(arrDep: ORGANIZ_CL[]) {
        this.listUserDep.forEach((node: NodeDocsTree) => {
            const index = arrDep.findIndex((doc: ORGANIZ_CL) => doc.DUE === node.DUE);
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
}
