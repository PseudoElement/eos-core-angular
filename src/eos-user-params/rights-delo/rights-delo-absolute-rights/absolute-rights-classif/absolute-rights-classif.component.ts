import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NodeAbsoluteRight } from '../node-absolute';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { IChengeItemAbsolute } from 'eos-user-params/rights-delo/shared-rights-delo/interfaces/right-delo.intefaces';
import { RightClassifNode } from './absolute-rights-classif-node';
import { TECH_USER_CLASSIF } from 'eos-user-params/rights-delo/shared-rights-delo/consts/tech-user-classif.consts';
import { ITechUserClassifConst, E_TECH_USER_CLASSIF_CONTENT, IConfigUserTechClassif } from 'eos-user-params/rights-delo/shared-rights-delo/interfaces/tech-user-classif.interface';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { OPEN_CLASSIF_DEPARTMENT_ONLI_NODE, OPEN_CLASSIF_DOCGROUP_CL_ONLI_NODE, OPEN_CLASSIF_RUBRIC_CL_ONLI_NODE } from 'app/consts/query-classif.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';


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
        // private _msgSrv: EosMessageService,
        // private _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,
        // private apiSrv: UserParamApiSrv,
    ) {}
    ngOnInit() {
        // console.log();
        // console.log(USER_TECH);
        this._init();
        this.isLoading = true;
        console.log(this.curentUser);
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
                };
            case E_TECH_USER_CLASSIF_CONTENT.docGroup:
                return {
                    apiInstance: 'DOCGROUP_CL',
                    waitClassif: OPEN_CLASSIF_DOCGROUP_CL_ONLI_NODE,
                };
            case E_TECH_USER_CLASSIF_CONTENT.rubric:
                return {
                    apiInstance: 'RUBRIC_CL',
                    waitClassif: OPEN_CLASSIF_RUBRIC_CL_ONLI_NODE,
                };
            case E_TECH_USER_CLASSIF_CONTENT.limitation: // неоходимо выбрать из картотек
                return {
                    apiInstance: 'DEPARTMENT',
                    waitClassif: OPEN_CLASSIF_DEPARTMENT_ONLI_NODE,
                };
        }
    }
    addInstance(config: IConfigUserTechClassif) {
        this._waitClassifSrv.openClassif(config.waitClassif)
        .then((data: string) => {
            // return this._apiSrv.getDocGroup(data.split('|').join('||'));
            return this.getEntyti(data.split('|').join('||'), config);
        })
        .then((data: any[]) => {
            console.log(data);
            // if (this._checkRepeat(data)) {
            //     this._msgSrv.addNewMessage(EMPTY_ADD_ELEMENT_WARN);
            //     this.isShell = false;
            //     return;
            // }
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
}
