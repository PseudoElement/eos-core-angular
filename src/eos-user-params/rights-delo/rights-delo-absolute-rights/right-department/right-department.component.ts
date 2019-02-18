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

@Component({
    selector: 'eos-right-absolute-department',
    templateUrl: 'right-department.component.html'
})
export class RightDepertmentComponent implements OnInit {
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();

    isLoading: boolean = false;
    userDep: USERDEP[];
    funcNum: number;
    userDepFuncNumber: USERDEP[];
    listUserDep: NodeDocsTree[] = [];
    depList: DEPARTMENT[];
    isShell: Boolean = false;
    selectedDep: NodeDocsTree;

    constructor (
        private _msgSrv: EosMessageService,
        private _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,
        private apiSrv: UserParamApiSrv,
    ) {}
    ngOnInit() {
        this.isLoading = true;
        this.userDep = this.curentUser['USERDEP_List'];
        this.funcNum = +this.selectedNode.key + 1;
        if (this.selectedNode.isCreate) {
            this.addDep();
            this.isLoading = false;
            return;
        }
        this.userDepFuncNumber = this.userDep.filter(i => i['FUNC_NUM'] === this.funcNum);
        const str: string[] = this.userDepFuncNumber.map(i => i.DUE);
        this.apiSrv.grtDepartment(str.join('||'))
            .then((data: DEPARTMENT[]) => {
                data.forEach((dep: DEPARTMENT) => {
                    const userDep: USERDEP = this.userDepFuncNumber.find((ud: USERDEP) => dep.DUE === ud.DUE);
                    const cfg: INodeDocsTreeCfg = {
                        due: userDep.DUE,
                        label: dep.CLASSIF_NAME,
                        viewAllowed: false,
                        data: {
                            dep: dep,
                            userDep: userDep,
                        },
                    };
                    this.listUserDep.push(new NodeDocsTree(cfg));
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
    }
    selectNode(dep: NodeDocsTree) {
        this.selectedDep = dep;
    }
    addDep() {
        this.isShell = true;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT_FULL)
        .then((data: string) => {
            if (data === '') {
                throw new Error();
            }
            return this._userParmSrv.getDepartmentFromUser(data.split('|'));
        })
        .then((data: DEPARTMENT[]) => {
            if (this._checkRepeat(data)) {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: '',
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
                    WEIGHT: this._getMaxWeight(),
                    DEEP: 1,
                    ALLOWED: null,
                }, 'USERDEP');
                const cfg: INodeDocsTreeCfg = {
                    due: newUserDep.DUE,
                    label: dep.CLASSIF_NAME,
                    viewAllowed: false,
                    data: {
                        dep: dep,
                        userDep: newUserDep,
                    },
                };
                const newNode = new NodeDocsTree(cfg);
                this.curentUser.USERDEP_List.push(newUserDep);
                this.selectedNode.pushChange({
                    method: 'POST',
                    due: newUserDep.DUE,
                    data: newUserDep
                });
                newNodes.push(newNode);
            });

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
                    title: '',
                    msg: 'Необходимо выбрать элемент'
                });
            }
        });
    }
    DeleteDep() {
        this.curentUser['USERDEP_List'] = this.curentUser['USERDEP_List'].filter(i => {
            if (i['DUE'] === this.selectedDep.DUE) {
                return i['FUNC_NUM'] !== this.selectedDep.data.userDep['FUNC_NUM'];
            }
            return true;
        });
        this.listUserDep = this.listUserDep.filter(n => n !== this.selectedDep);
        if (!this.listUserDep.length) {
            this.selectedNode.value = 0;
        }
        this.selectedNode.pushChange({
            method: 'DELETE',
            due: this.selectedDep.DUE,
            data: this.selectedDep.data.userDep
        });
        this.selectedDep = null;
        this.Changed.emit();
    }
    markedSendPrj(event) {
        this.selectedNode.value = event.target.checked ? 2 : 1;
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
                    title: '',
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
