import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NodeAbsoluteRight } from '../node-absolute';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { IChengeItemAbsolute } from 'eos-user-params/rights-delo/shared-rights-delo/interfaces/right-delo.intefaces';
import { RightClassifNode } from './absolute-rights-classif-node';
import { TECH_USER_CLASSIF, E_CLASSIF_ID } from 'eos-user-params/rights-delo/shared-rights-delo/consts/tech-user-classif.consts';
import { ITechUserClassifConst, E_TECH_USER_CLASSIF_CONTENT, IConfigUserTechClassif } from 'eos-user-params/rights-delo/shared-rights-delo/interfaces/tech-user-classif.interface';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { OPEN_CLASSIF_DEPARTMENT_ONLI_NODE, OPEN_CLASSIF_DOCGROUP_CL_ONLI_NODE, OPEN_CLASSIF_RUBRIC_CL_ONLI_NODE, OPEN_CLASSIF_CARDINDEX } from 'app/consts/query-classif.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EMPTY_ADD_ELEMENT_WARN } from 'app/consts/messages.consts';


@Component({
    selector: 'eos-absolute-rights-classif',
    templateUrl: 'absolute-rights-classif.component.html'
})

// @Injectable()
export class AbsoluteRightsClassifComponent implements OnInit {
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();
    isLoading: boolean = false;
    isShell: Boolean = false;
    listClassif: RightClassifNode[] = [];
    constructor (
        private _apiSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService,
        // private _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,
        // private apiSrv: UserParamApiSrv,
    ) {}
    ngOnInit() {
        // console.log();
        // console.log(USER_TECH);
        this._init();
        this.isLoading = true;
    }
    expendList(node: RightClassifNode) {
        node.isExpanded = !node.isExpanded;
    }
    getEntyti(str: string, config: IConfigUserTechClassif): Promise<any[]> {
        return this._apiSrv.getEntity(config.apiInstance, str)
        .catch(e => {
            return [];
        });
    }
    getConfig (mode: E_TECH_USER_CLASSIF_CONTENT): IConfigUserTechClassif {
        switch (mode) {
            case E_TECH_USER_CLASSIF_CONTENT.department:
                return {
                    apiInstance: 'DEPARTMENT',
                    waitClassif: OPEN_CLASSIF_DEPARTMENT_ONLI_NODE,
                    label: 'CLASSIF_NAME',
                };
            case E_TECH_USER_CLASSIF_CONTENT.docGroup:
                return {
                    apiInstance: 'DOCGROUP_CL',
                    waitClassif: OPEN_CLASSIF_DOCGROUP_CL_ONLI_NODE,
                    label: 'CLASSIF_NAME',
                };
            case E_TECH_USER_CLASSIF_CONTENT.rubric:
                return {
                    apiInstance: 'RUBRIC_CL',
                    waitClassif: OPEN_CLASSIF_RUBRIC_CL_ONLI_NODE,
                    label: 'CLASSIF_NAME',
                };
            case E_TECH_USER_CLASSIF_CONTENT.limitation: // неоходимо выбрать из картотек
                return {
                    apiInstance: 'DEPARTMENT',
                    waitClassif: OPEN_CLASSIF_CARDINDEX,
                    label: 'CARD_NAME',
                };
        }
    }
    addInstance(config: IConfigUserTechClassif, node: RightClassifNode, oldPage?: boolean): Promise<any> {
        return this._waitClassifSrv.openClassif(config.waitClassif, oldPage)
        .then((data: string) => {
            return this.getEntyti(data.split('|').join('||'), config);
        })
        .then((data: any[]) => {
            if (this._checkRepeat(node, data, config)) {
                this._msgSrv.addNewMessage(EMPTY_ADD_ELEMENT_WARN);
                this.isShell = false;
                return;
            }
            const newList: NodeDocsTree[] = [];
            data.forEach(entity => {
                const newTechRight = {
                    ISN_LCLASSIF: this.curentUser.ISN_LCLASSIF,
                    FUNC_NUM: node.key,
                    CLASSIF_ID: E_CLASSIF_ID[node.key],
                    DUE: entity['DUE'],
                    ALLOWED: 1,
                };
                const d = {
                    userTech: newTechRight,
                    instance: entity
                };
                newList.push(new NodeDocsTree(entity['DUE'], entity[config.label], !!newTechRight['ALLOWED'], d));

                this.selectedNode.pushChange({
                    method: 'POST',
                    due: entity.DUE,
                    funcNum: node.key,
                    data: newTechRight,
                });

            });
            node.listContent = node.listContent.concat(newList);
            // const nodes: NodeDocsTree[] = [];
            // data.forEach((doc: DOCGROUP_CL) => {
            //     const node = this._createNode({
            //         ISN_LCLASSIF: this.curentUser.ISN_LCLASSIF,
            //         FUNC_NUM: +this.selectedNode.key + 1,
            //         DUE: doc.DUE,
            //         ALLOWED: 0
            //     },
            //     doc);

            //     /* добавляем изменения */
            //     this.selectedNode.pushChange({
            //         method: 'POST',
            //         due: node.DUE,
            //         data: node.data['rightDocGroup']
            //     });


            //     nodes.push(node);
            // });

            // this.isShell = false;
            // this.list = this.list.concat(nodes);
            // this.Changed.emit();
        })
        .catch(() => {
            console.log('catch()');
        });
    }
    private _init () {
        if (this.selectedNode.isCreate || !this.curentUser['TECH_RIGHTS']) {
            const techRights: string = new Array(39).fill('1').join('');
            const chenge: IChengeItemAbsolute = {
                method: 'MERGE',
                user_cl: true,
                data: {
                    TECH_RIGHTS: techRights
                }
            };
            this.selectedNode.pushChange(chenge);
            // this.Changed.emit();
            this.curentUser['TECH_RIGHTS'] = techRights;
        }
        TECH_USER_CLASSIF.forEach((item: ITechUserClassifConst) => {
            this.listClassif.push(new RightClassifNode(item, this.curentUser, this.selectedNode, this));
        });
    }
    private _checkRepeat(node: RightClassifNode, entity: any[], config: IConfigUserTechClassif): boolean {
        const list: NodeDocsTree[] = node.listContent;
        list.forEach((n: NodeDocsTree) => {
            const index = entity.findIndex(doc => doc.DUE === n.DUE);
            if (index !== -1) {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: '',
                    msg: `Элемент \'${entity[index][config.label]}\' не будет добавлен\nтак как он уже существует`
                });
                entity.splice(index, 1);
            }
        });
        if (entity.length) {
            return false;
        }
        return true;
    }
}
