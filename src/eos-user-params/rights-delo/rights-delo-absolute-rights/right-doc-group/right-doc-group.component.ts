import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NodeAbsoluteRight } from '../node-absolute';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { EosMessageService } from 'eos-common/services/eos-message.service';
// import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { DOCGROUP_CL, USER_RIGHT_DOCGROUP } from 'eos-rest';
import { OPEN_CLASSIF_DOCGROUP_CL } from 'app/consts/query-classif.consts';

@Component({
    selector: 'eos-right-absolute-doc-group',
    templateUrl: 'right-doc-group.component.html'
})
export class RightAbsoluteDocGroupComponent implements OnInit {
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();
    isLoading: boolean = false;
    list: NodeDocsTree[] = [];
    curentNode: NodeDocsTree;
    isShell: Boolean = false;
    constructor (
        private _msgSrv: EosMessageService,
        // private _userParmSrv: UserParamsService,
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
            return this.apiSrv.getDocGroup(data.split('|').join('||'));
        })
        .then((data: DOCGROUP_CL[]) => {
            if (this._checkRepeat(data)) {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: '',
                    msg: 'Нет елементов для добавления'
                });
                this.isShell = false;
                return;
            }
            const nodes: NodeDocsTree[] = [];
            data.forEach((doc: DOCGROUP_CL) => {
                const node = this._createNode({
                    ISN_LCLASSIF: this.curentUser.ISN_LCLASSIF,
                    FUNC_NUM: +this.selectedNode.key + 1,
                    DUE: doc.DUE,
                    ALLOWED: 0
                },
                doc);

                /* добавляем изменения */
                this.selectedNode.pushChange({
                    method: 'POST',
                    due: node.DUE,
                    data: node.data['rightDocGroup']
                });


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
    DeleteDoc() {
        // this.curentNode.parent.deleteChild(this.curentNode);
        // if (this.curentNode.children.length) {
        //     this.curentNode.children.forEach(node => {
        //         node.parent = this.curentNode.parent;
        //         this.curentNode.parent.addChildren(node);
        //     });
        // }
        this.list = this.list.filter(node => node !== this.curentNode);
        this.selectedNode.pushChange({
            method: 'DELETE',
            due: this.curentNode.DUE,
            data: this.curentNode.data['rightDocGroup']
        });
        this.curentNode = null;
        this.Changed.emit();
    }

    private _init() {
        this.isLoading = true;
        const str = this.curentUser.USER_RIGHT_DOCGROUP_List.map(i => i.DUE);
        if (this.selectedNode.isCreate) {
            str.push('0.');
        }
        this.apiSrv.getDocGroup(str.join('||'))
        .then((data: DOCGROUP_CL[]) => {
            this.curentUser.USER_RIGHT_DOCGROUP_List.forEach((item: USER_RIGHT_DOCGROUP) => {
                data.forEach((doc: DOCGROUP_CL) => {
                    if (item.DUE === doc.DUE) {
                        this.list.push(this._createNode(item, doc));
                    }
                });
            });
            if (this.selectedNode.isCreate) {
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
                    }
                });
            }

            this.isLoading = false;
        });
    }
    private _createNode(rDoc, doc: DOCGROUP_CL): NodeDocsTree {
        return new NodeDocsTree(
            doc.DUE,
            doc.CLASSIF_NAME,
            !!rDoc.ALLOWED,
            {
                rightDocGroup: rDoc,
                docGroup: doc
            }
        );
    }
    private _checkRepeat(arrDoc: DOCGROUP_CL[]): boolean {
        this.list.forEach((node: NodeDocsTree) => {
            const index = arrDoc.findIndex(doc => doc.DUE === node.DUE);
            if (index !== -1) {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: '',
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
