import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NodeAbsoluteRight } from '../node-absolute';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { IChengeItemAbsolute } from '../right-delo.intefaces';
import { RightClassifNode } from './absolute-rights-classif-node';
import { TECH_USER_CLASSIF } from './tech-user-classif.consts';
import { ITechUserClassifConst, E_TECH_USER_CLASSIF_CONTENT, IConfigUserTechClassif } from './tech-user-classif.interface';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { OPEN_CLASSIF_DEPARTMENT_ONLI_NODE, OPEN_CLASSIF_DOCGROUP_CL_ONLI_NODE, OPEN_CLASSIF_RUBRIC_CL_ONLI_NODE, OPEN_CLASSIF_CARDINDEX } from 'app/consts/query-classif.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EMPTY_ADD_ELEMENT_WARN } from 'app/consts/messages.consts';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';


@Component({
    selector: 'eos-absolute-rights-classif',
    templateUrl: 'absolute-rights-classif.component.html'
})

// @Injectable()
export class AbsoluteRightsClassifComponent implements OnInit {
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();
    userTechList;
    isLoading: boolean = false;
    isShell: Boolean = false;
    listClassif: RightClassifNode[] = [];
    constructor (
        private _apiSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService,
        private _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,
    ) {
        this.userTechList = this._userParmSrv.userTechList;
    }
    ngOnInit() {
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
    createEntyti<T>(ent: any, typeName: string): T {
        return this._userParmSrv.createEntyti<T>(ent, typeName);
    }
    getConfig (mode: E_TECH_USER_CLASSIF_CONTENT): IConfigUserTechClassif {
        switch (mode) {
            case E_TECH_USER_CLASSIF_CONTENT.department:
                return {
                    apiInstance: 'DEPARTMENT',
                    waitClassif: OPEN_CLASSIF_DEPARTMENT_ONLI_NODE,
                    label: 'CLASSIF_NAME',
                    rootLabel: 'Все подразделения',
                };
            case E_TECH_USER_CLASSIF_CONTENT.docGroup:
                return {
                    apiInstance: 'DOCGROUP_CL',
                    waitClassif: OPEN_CLASSIF_DOCGROUP_CL_ONLI_NODE,
                    label: 'CLASSIF_NAME',
                    rootLabel: 'Все группы документов',
                };
            case E_TECH_USER_CLASSIF_CONTENT.rubric:
                return {
                    apiInstance: 'RUBRIC_CL',
                    waitClassif: OPEN_CLASSIF_RUBRIC_CL_ONLI_NODE,
                    label: 'CLASSIF_NAME',
                    rootLabel: 'Все рубрики',
                };
            case E_TECH_USER_CLASSIF_CONTENT.limitation: // неоходимо выбрать из картотек
                return {
                    apiInstance: 'DEPARTMENT',
                    waitClassif: OPEN_CLASSIF_CARDINDEX,
                    label: 'CARD_NAME',
                    rootLabel: 'Центральная картотека',
                };
        }
    }
    addInstance(config: IConfigUserTechClassif, node: RightClassifNode): Promise<any> {
        return this._waitClassifSrv.openClassif(config.waitClassif)
        .then((data: string) => {
            if (data.length) {
                return this.getEntyti(data.split('|').join('||'), config);
            }
            return Promise.reject('');
        })
        .then((data: any[]) => {
            if (this._checkRepeat(node, data, config)) {
                this._msgSrv.addNewMessage(EMPTY_ADD_ELEMENT_WARN);
                return;
            }
            return data;
        });
    }
    hideToolTip() {
        const element = document.querySelector('.tooltip');
        if (element) {
            element.setAttribute('style', 'display: none');
        }
    }
    private _init () {
        if (this.selectedNode.isCreate || !this.curentUser['TECH_RIGHTS']) {
            const techRights: string = '1'.repeat(39);
            const chenge: IChengeItemAbsolute = {
                method: 'MERGE',
                user_cl: true,
                data: {
                    TECH_RIGHTS: techRights
                }
            };
            this.selectedNode.pushChange(chenge);
            this.curentUser['TECH_RIGHTS'] = techRights;
        } else {  // строке в индексах с пробеломи присваиваем 0
            const arr = this.curentUser['TECH_RIGHTS'].split('');
            arr.forEach((i,  index) => {
                if (i === ' ') {
                    arr[index] = '0';
                }
            });
            this.curentUser['TECH_RIGHTS'] = arr.join('');
        }
        TECH_USER_CLASSIF.forEach((item: ITechUserClassifConst) => {
            this.listClassif.push(new RightClassifNode(item, this.curentUser, this.selectedNode, this));
        });
        if (this.selectedNode.isCreate) {
            this.selectedNode.isCreate = false;
        }
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
