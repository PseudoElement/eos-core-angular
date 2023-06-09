import { Component, Input, OnInit, Output, EventEmitter, Injectable, ViewChild, TemplateRef } from '@angular/core';
import { IParamUserCl, INodeDocsTreeCfg } from '../../../shared/intrfaces/user-parm.intterfaces';
import { PipRX, SRCH_GROUP, ALL_ROWS, USER_SRCH_GROUP, AppContext } from '../../../../eos-rest';
// import { WaitClassifService } from '../../../../app/services/waitClassif.service';
import { UserParamsService } from '../../../shared/services/user-params.service';
import { NodeAbsoluteRight } from '../node-absolute';
import { EosMessageService } from '../../../../eos-common/services/eos-message.service';
import { NodeDocsTree } from '../../../shared/list-docs-tree/node-docs-tree';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { E_TECH_RIGHT } from '../../../../eos-rest/interfaces/rightName';
import { ETypeRule } from '../absolute-rights-classif/tech-user-classif.interface';

interface USER_SRCH_GROUP_EXT extends USER_SRCH_GROUP {
    SRCH_GROUP?: SRCH_GROUP
};

@Injectable({ providedIn: "root" })
export class ReportingService {
    private userSrch: USER_SRCH_GROUP[] = [];
    constructor(private apiSrv: PipRX, private _userParmSrv: UserParamsService) {

    }

    srchGroup(criteries?: any): Promise<SRCH_GROUP[]> {
        const crit = criteries || ALL_ROWS;
        return this.apiSrv.read<SRCH_GROUP>({
            SRCH_GROUP: crit
        });
    }

    userSrchGroup() {
        return this.apiSrv.read<USER_SRCH_GROUP>({
            USER_SRCH_GROUP: PipRX.criteries({
                ISN_USER: `${this._userParmSrv.curentUser.ISN_LCLASSIF}`
            })
        }).then(data => {
            this.userSrch = data;
            return data;
        });
    }


    userSrchGroupWithSrcGroup(user_srch_gr: USER_SRCH_GROUP[]): Promise<USER_SRCH_GROUP_EXT[]> {
        const ids = user_srch_gr.map(node => node.ISN_GROUP);
        return this.srchGroup(ids).then(data => {
            return [...user_srch_gr].map(usr_srch => {
                const findGroup = data.find(group => group.ISN_GROUP === usr_srch.ISN_GROUP);
                usr_srch['SRCH_GROUP'] = findGroup;
                return usr_srch;
            });
        }).catch(error => {
            return []
        });
    }
    async deletedUserSrch(item: NodeAbsoluteRight) {
        if (!this.userSrch.length) {
            this.userSrch = await this.userSrchGroup();
        }
        this.userSrch.forEach(node => {
            item.pushChange(
                {
                    method: 'DELETE',
                    due: node.ISN_GROUP + "",
                    data: {
                        ISN_GROUP: node.ISN_GROUP,
                        ISN_USER: node.ISN_USER
                    }
                }
            )
        })
    }
}


@Component({
    selector: 'eos-right-srch-group',
    templateUrl: 'right-srch-group.component.html'
})
export class RightSrchGroupomponent implements OnInit {
    @Input() editMode: boolean;
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() listRigth: NodeAbsoluteRight[];
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();
    @ViewChild('chooseSrcgGroup', { static: true }) chooseSrcgGroup: TemplateRef<any>;

    isLoading: boolean = false;
    funcNum: number;
    listUserDep: NodeDocsTree[] = [];
    listUserSrch: NodeDocsTree[] = [];
    originUserSrch: USER_SRCH_GROUP_EXT[];
    isShell: Boolean = false;
    selectedSrchUser: NodeDocsTree;
    modalRef: BsModalRef;
    originSrchGroup: SRCH_GROUP[] = [];
    constructor(
        private _msgSrv: EosMessageService,
        private reportingSrv: ReportingService,
        private bsSrv: BsModalService,
        private appCtx: AppContext
    ) {}
    async ngOnInit() {
        this.isLoading = true;
        this.funcNum = +this.selectedNode.key + 1;
        try {
            this.originSrchGroup = await this.reportingSrv.srchGroup();
            const usr_srch_group = await this.reportingSrv.userSrchGroup();
            this.originUserSrch = await this.reportingSrv.userSrchGroupWithSrcGroup(usr_srch_group);
            this.originUserSrch.forEach(node => {
                const node_tree: INodeDocsTreeCfg = {
                    due: node.ISN_GROUP + "",
                    label: node.SRCH_GROUP.NAME,
                    data: node?.SRCH_GROUP,
                    flagCheckNode: false,
                    viewAllowed: false
                };
                this.listUserSrch.push(new NodeDocsTree(node_tree, undefined, undefined, false));
                this.sortBYWeigth();
            });
            this.isLoading = false;
        } catch (e) {
            this.isLoading = false;
        }
    }
    get isAccessToAddGroup() {
        return this.appCtx.CurrentUser.TECH_RIGHTS[E_TECH_RIGHT.ConfigurConfigToReports - 1] == ETypeRule.have_right;
    }
    chooseSrchGroup() {
        const addNodes = this._checkRepeat(this.originSrchGroup);
        if (addNodes.length) {
            addNodes.forEach((ad_node) => {
                const node_tree: INodeDocsTreeCfg = {
                    due: ad_node.ISN_GROUP + "",
                    label: ad_node.NAME,
                    data: ad_node,
                    flagCheckNode: false,
                    viewAllowed: false
                };
                this.listUserSrch.push(new NodeDocsTree(node_tree, undefined, undefined, false));
                this.sortBYWeigth();
                this.listUserSrch = [...this.listUserSrch];
                this.selectedNode.pushChange({
                    method: 'POST',
                    due: node_tree.due,
                    data: {
                        ISN_GROUP: node_tree.data?.ISN_GROUP,
                        ISN_USER: this.curentUser.ISN_LCLASSIF
                    }
                });
            });
            this.selectedNode.isCreate = false;
            this.isShell = false;
            this.Changed.emit();
        }
    }
    addSrchGroup() {
        this.modalRef = this.bsSrv.show(this.chooseSrcgGroup)
    }
    selectNode(srch_user_node: NodeDocsTree) {
        this.listUserSrch.forEach(node => {
            node.isSelected = false;
        });
        srch_user_node.isSelected = true;
        this.selectedSrchUser = srch_user_node;
    }
    closeSubModal() {
        this.modalRef.hide();
    }
    sortBYWeigth() {
        this.listUserSrch.sort((a, b) => {
            return a.data?.WEIGHT - b.data?.WEIGHT;
        });
    }

    deleteSrchGroup() {
        this.listUserSrch = this.listUserSrch.filter(node => node.data.ISN_GROUP !== this.selectedSrchUser.data?.ISN_GROUP);
        this.sortBYWeigth();
        this.selectedNode.pushChange({
            method: 'DELETE',
            due: this.selectedSrchUser.DUE,
            data: {
                ISN_GROUP: this.selectedSrchUser.data?.ISN_GROUP,
                ISN_USER: this.curentUser.ISN_LCLASSIF
            }
        });
        this.selectedSrchUser = null;
        this.Changed.emit('del');
    }
    checkedNode($event: NodeDocsTree) {
    }

    private _checkRepeat(origSrchGroup: SRCH_GROUP[]): SRCH_GROUP[] {
        let newNode = [];
        origSrchGroup.forEach((origNodeSrchGroup: any) => {
            if (origNodeSrchGroup?.checked) {
                const useNode = this.listUserSrch.find((user_srch) => origNodeSrchGroup.ISN_GROUP === user_srch.data?.ISN_GROUP);
                if (useNode) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: `Элемент \'${useNode.data?.NAME}\' не будет добавлен\nтак как он уже существует`
                    });
                } else {
                    newNode.push(origNodeSrchGroup);
                }
            }
            delete origNodeSrchGroup?.checked;
        });
        return newNode;
    }
}
