import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { INodeDocsTreeCfg, IParamUserCl } from '../../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { NodeAbsoluteRight } from '../node-absolute';
import { NodeDocsTree } from '../../../../eos-user-params/shared/list-docs-tree/node-docs-tree';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserParamApiSrv } from '../../../../eos-user-params/shared/services/user-params-api.service';
import { ORGANIZ_CL, USER_ORGANIZ } from '../../../../eos-rest/interfaces/structures';
import { UserParamsService } from '../../../../eos-user-params/shared/services/user-params.service';
import { EosMessageService } from '../../../../eos-common/index';
import { PipRX } from '../../../../eos-rest';


@Component({
    selector: 'eos-right-absolute-organiz-sstu',
    templateUrl: 'right-organ-sstu.component.html'
})
export class RightDepertOrganizSstu implements OnInit {

    @Input() editMode: boolean;
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() listRigth: NodeAbsoluteRight[];
    @Input() curentUser: IParamUserCl;
    @Input() projectResol: number;
    @Output() Changed = new EventEmitter();
    @Output() createRcpdD = new EventEmitter();
    @Output() emitDeletedRc = new EventEmitter();
    @Output() independetRight = new EventEmitter();
    listUserOrg: NodeDocsTree[] = [];
    isLoading: boolean = false;
    checkFlag: boolean = false;
    public modalRef: BsModalRef;
    public listOrganizNew = [];
    public listOrganizOld = [];
    public selectedOrg: NodeDocsTree;
    constructor(
        private _pipRx: PipRX,
        private modalService: BsModalService,
        private apiSrv: UserParamApiSrv,
        private _userParmSrv: UserParamsService,
        private _msgSrv: EosMessageService,) {}
    async ngOnInit(): Promise<any> {
        this.isLoading = true;
        this.listOrganizNew = await this.getAppSetting();
        this.listOrganizOld = this.curentUser['USER_ORGANIZ_List'].filter((org) => org['FUNC_NUM'] === +this.selectedNode.key + 1);
        const allOrgtoTree = [];
        this.listOrganizOld.forEach((org) => {
            allOrgtoTree.push(org.DUE);
        });
        this.listOrganizNew.forEach((org) => {
            const index = allOrgtoTree.indexOf(org.DUE);
            org.select = index !== -1;
        });
        if (allOrgtoTree.length > 0) {
            this.getOrganizToList(allOrgtoTree);
        }
        this.isLoading = false;
    }

    getLogDelet(item): boolean {
        return item.DUE !== '0.' && !!item['DELETED'] ? true : false;
    }

    getOrganizToList(str: string[]) {
        this.apiSrv.getOrganization(str)
        .then((data) => {
            data.forEach((dep) => {
                const userDep: USER_ORGANIZ = this.listOrganizOld.find((ud: USER_ORGANIZ) => dep.DUE === ud.DUE);
                const cfg: INodeDocsTreeCfg = {
                    due: userDep.DUE,
                    label: dep.CLASSIF_NAME,
                    data: {
                        dep: dep,
                        userDep: userDep,
                    },
                };
                this.addFieldChwckProp(cfg, dep.IS_NODE, null);
                this.listUserOrg.push(new NodeDocsTree(cfg, undefined, undefined, this.getLogDelet(dep)));
            });
            this.isLoading = false;
        })
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
    getAppSetting(): Promise<any[]> {
        return this._pipRx.getHttp_client().get('../CoreHost/sstu/get-organizations-to-select', { responseType: 'blob' }).toPromise()
        .then((data: any) => {
            const ans = [];
            if (data.length > 0) {
                data.forEach((org) => {
                    ans.push({
                        DUE: org['Due'],
                        CLASSIF_NAME: org['ClassifName'],
                    })
                });
            }
            return ans;
        })
        .catch((error) => {
            console.log('error', error);
            return [];
        });
    }
    openWindow(template) {
        if (this.listOrganizNew.length === 0) {
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Отсутствуют организации для выбора'
            }); 
        } else {
            this.modalRef = this.modalService.show(template);
        }
    }
    
    getflagChecked(item) {
        if (item.select) {
            return 'eos-adm-icon-checkbox-square-v-blue';
        } else {
            return 'eos-adm-icon-checkbox-square-blue';
        }
    }

    toggleChecked($event, item) {
        item.select = !item.select;
    }
    updateElement() {
        const addOrg = [];
        const deletOrg = [];
        this.listOrganizNew.forEach((itemNew) => {
            if (itemNew.select) {
                if(this.listOrganizOld.findIndex((itemOld) => itemOld.DUE === itemNew.DUE && itemOld['FUNC_NUM'] === +this.selectedNode.key + 1) === -1) {
                    addOrg.push(itemNew);
                }
            } else if (this.listOrganizOld.findIndex((itemOld) => itemOld.DUE === itemNew.DUE && itemOld['FUNC_NUM'] === +this.selectedNode.key + 1) !== -1) {
                const item = this.returnOrg(itemNew);
                deletOrg.push(item.cfg);
            }
        });
        if (addOrg.length > 0) {
            this.addOrganiz(addOrg);
        }
        if (deletOrg.length > 0) {
            deletOrg.forEach((itemDelet) => {
                this.DeleteDep(itemDelet);
            });
        }
        this.modalRef.hide();
    }
    closeWindow() {
        this.modalRef.hide();
    }
    selectNode(org: NodeDocsTree) {
        this.listUserOrg.forEach(node => {
            node.isSelected = false;
        });
        org.isSelected = true;
        this.selectedOrg = org;
    }
    checkedNode($event) {}
    DeleteDep(item) {
        this.curentUser['USER_ORGANIZ_List'] = this.curentUser['USER_ORGANIZ_List'].filter(i => {
            if (i['DUE'] === item.DUE) {
                return i['FUNC_NUM'] !== item.data.userDep['FUNC_NUM'];
            }
            return true;
        });
        this.listUserOrg = this.listUserOrg.filter(n => n['DUE'] !== item.data.userDep.DUE);
        this.selectedNode.pushChange({
            method: 'DELETE',
            due: item.data.userDep.DUE,
            data: item.data.userDep
        });
        this.Changed.emit('del');
    }
    returnOrg(org): {org: USER_ORGANIZ, cfg: INodeDocsTreeCfg} {
        let maxWeight = 0;
        let counrRow = new Set();
        this.curentUser['USER_ORGANIZ_List'].forEach((userDep) => {
            if (userDep.DUE === org['DUE']) {
                maxWeight = userDep['WEIGHT'];
            }
            if (userDep['DUE'] !== '0.') {
                counrRow.add(userDep['DUE']);
            }
        });
        const newUserDep: USER_ORGANIZ = this._userParmSrv.createEntyti<USER_ORGANIZ>({
            ISN_LCLASSIF: this._userParmSrv.userContextId,
            DUE: org.DUE,
            FUNC_NUM: +this.selectedNode.key + 1,
            WEIGHT: maxWeight || counrRow.size,
        }, 'USERDEP');
        const cfg: INodeDocsTreeCfg = {
            due: newUserDep.DUE,
            label: org.CLASSIF_NAME,
            data: {
                dep: org,
                userDep: newUserDep,
            },
        };
        return {org: newUserDep, cfg: cfg};
    }
    addOrganiz(data): any {
        const newNodes: NodeDocsTree[] = [];
        data.forEach((org: ORGANIZ_CL) => {
            const orgInfo = this.returnOrg(org);
            this.addFieldChwckProp(orgInfo.cfg, org.IS_NODE, null);
            const newNode = new NodeDocsTree(orgInfo.cfg, undefined, undefined, this.getLogDelet(org));
            this.curentUser['USER_ORGANIZ_List'].push(orgInfo.org);
            this.selectedNode.pushChange({
                method: 'POST',
                due: orgInfo.org.DUE,
                data: orgInfo.org
            });
            newNodes.push(newNode);
        });
        this.listUserOrg = this.listUserOrg.concat(newNodes);
        this.selectedNode.isCreate = false;
        this.Changed.emit();
    }
}
