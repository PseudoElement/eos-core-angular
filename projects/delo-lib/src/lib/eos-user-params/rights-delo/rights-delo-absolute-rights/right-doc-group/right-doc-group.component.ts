import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NodeAbsoluteRight } from '../node-absolute';
import { IParamUserCl, INodeDocsTreeCfg } from '../../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { EosMessageService } from '../../../../eos-common/services/eos-message.service';
// import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { WaitClassifService } from '../../../../app/services/waitClassif.service';
import { UserParamApiSrv } from '../../../../eos-user-params/shared/services/user-params-api.service';
import { NodeDocsTree } from '../../../../eos-user-params/shared/list-docs-tree/node-docs-tree';
import { DOCGROUP_CL } from '../../../../eos-rest';
import { OPEN_CLASSIF_DOCGROUP_CL } from '../../../../app/consts/query-classif.consts';
import { RestError } from '../../../../eos-rest/core/rest-error';
import { UserParamsService } from '../../../../eos-user-params/shared/services/user-params.service';

@Component({
    selector: 'eos-right-absolute-doc-group',
    templateUrl: 'right-doc-group.component.html'
})
export class RightAbsoluteDocGroupComponent implements OnInit {
    @Input() editMode: boolean;
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();
    isLoading: boolean = false;
    list: NodeDocsTree[] = [];
    curentNode: NodeDocsTree;
    isShell: Boolean = false;
    rDocgroup: any[];
    constructor(
        private _msgSrv: EosMessageService,
        private _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,
        private apiSrv: UserParamApiSrv,
    ) {}

    ngOnInit() {
        this._init();
    }
    select(node: NodeDocsTree) {
        if (node.DUE !== '0.') {
            this.curentNode = node;
        } else {
            this.curentNode = null;
        }
    }
    checkedNode(node: NodeDocsTree) {
        node.data['rightDocGroup']['ALLOWED'] = +node.isAllowed;
        this.selectedNode.pushChange({
            method: 'MERGE',
            due: node.DUE,
            data: node.data['rightDocGroup']
        });
        this.Changed.emit();
    }

    addDoc() {
        this.isShell = true;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DOCGROUP_CL)
            .then((data: string) => {
                return this.apiSrv.getDocGroup(data.split('|'));
            })
            .then((data: DOCGROUP_CL[]) => {
                data = this.clearDocRc(data);
                if (this._checkRepeat(data)) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Нет елементов для добавления'
                    });
                    this.isShell = false;
                    return;
                }
                const nodes: NodeDocsTree[] = [];
                data.forEach((doc: DOCGROUP_CL) => {
                    const rDocgroup = {
                        ISN_LCLASSIF: this.curentUser.ISN_LCLASSIF,
                        FUNC_NUM: +this.selectedNode.key + 1,
                        DUE: doc.DUE,
                        ALLOWED: this.getAllowedParent(doc.DUE) ? 0 : 1,
                    };
                    const node = this._createNode(rDocgroup, doc);

                    /* добавляем изменения */
                    this.selectedNode.pushChange({
                        method: 'POST',
                        due: node.DUE,
                        data: node.data['rightDocGroup']
                    });

                    this.rDocgroup.push(rDocgroup);
                    nodes.push(node);
                });

                this.isShell = false;
                this.list = this.list.concat(nodes);
                this.Changed.emit();
            })
            .catch(() => {
                this.isShell = false;
            });
    }
    clearDocRc(data: DOCGROUP_CL[]) {
        data = data.filter((doc: DOCGROUP_CL) => {
            return doc.RC_TYPE === 0 || doc.RC_TYPE === 3;
        });
        return data;
    }
    getAllowedParent(due: string) {
        if (this.list.length) {
            return this.excludeNode(28, due);
        }
        return false;
    }
    excludeNode(nameNode: number, due: string) {
        const exist = [28].some(value => {
            return value === nameNode;
        });
        if (exist) {
            return this.findParent(due);
        } else {
            return false;
        }
    }

    findParent(due: string) {
        const n = due.split('.');
        n.pop();
        const d = due + '.';
        if (d !== '0.') {
            const findElement = this.list.filter((element: NodeDocsTree) => {
                return element.DUE === d;
            });
            if (findElement[0]) {
                return findElement[0].isAllowed ? true : false;
            } else {
                return this.findParent(n.join('.'));
            }
        } else {
            return this.list[0].isAllowed ? true : false;
        }
    }
    DeleteDoc() {
        this.list = this.list.filter(node => node !== this.curentNode);
        this.selectedNode.pushChange({
            method: 'DELETE',
            due: this.curentNode.DUE,
            data: this.curentNode.data['rightDocGroup']
        });
        const index = this.rDocgroup.findIndex(item => item['DUE'] === this.curentNode['DUE']);
        this.rDocgroup.splice(index, 1);
        this.curentNode = null;
        this.Changed.emit();
    }

    private _init() {
        let rDocgroupСontains = false;
        this.rDocgroup = this._userParmSrv.userRightDocgroupList;
        this.rDocgroup.forEach(item => {
            if (item['DUE'] === '0.') {
                rDocgroupСontains = true;
            }
        });
        this.isLoading = true;
        const str = this.rDocgroup.map(i => i.DUE);
        if (this.selectedNode.isCreate) {
            str.push('0.');
        }
        this.apiSrv.getDocGroup(str)
            .then((data: DOCGROUP_CL[]) => {
                this.rDocgroup.forEach((item) => {
                    data.forEach((doc: DOCGROUP_CL) => {
                        if (item.DUE === doc.DUE) {
                            this.list.push(this._createNode(item, doc));
                        }
                    });
                });
                if (this.selectedNode.isCreate) {
                    if (!rDocgroupСontains) {
                        data.forEach(d => {
                            if (d.DUE === '0.') {
                                const rightDocGroup = {
                                    ISN_LCLASSIF: this.curentUser.ISN_LCLASSIF,
                                    FUNC_NUM: +this.selectedNode.key + 1,
                                    DUE: d.DUE,
                                    ALLOWED: 0
                                };
                                this.list.push(this._createNode(rightDocGroup, d));
                                this.selectedNode.pushChange({
                                    method: 'POST',
                                    due: rightDocGroup.DUE,
                                    data: rightDocGroup
                                });
                                this.rDocgroup.push(rightDocGroup);
                            }
                        });
                    }
                    this.selectedNode.isCreate = false;
                }

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
    private _getLogDelet(item): boolean {
        return item.DUE !== '0.' && !!item['DELETED'] ? true : false;
    }
    private _createNode(rDoc, doc: DOCGROUP_CL): NodeDocsTree {
        const cfg: INodeDocsTreeCfg = {
            due: doc.DUE,
            label: doc.CLASSIF_NAME,
            allowed: !!rDoc.ALLOWED,
            data: {
                rightDocGroup: rDoc,
                docGroup: doc
            },
        };
        return new NodeDocsTree(cfg, true, undefined, this._getLogDelet(doc));
    }
    private _checkRepeat(arrDoc: DOCGROUP_CL[]): boolean {
        this.list.forEach((node: NodeDocsTree) => {
            const index = arrDoc.findIndex(doc => doc.DUE === node.DUE);
            if (index !== -1) {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: `Элемент \'${arrDoc[index].CLASSIF_NAME}\' не будет добавлен\nтак как он уже существует`
                });
                arrDoc.splice(index, 1);
            }
        });
        if (arrDoc.length) {
            return false;
        }
        return true;
    }
}
