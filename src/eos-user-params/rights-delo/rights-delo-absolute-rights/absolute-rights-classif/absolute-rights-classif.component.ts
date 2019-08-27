import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
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
import { PipRX } from 'eos-rest';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

@Component({
    selector: 'eos-absolute-rights-classif',
    templateUrl: 'absolute-rights-classif.component.html'
})

// @Injectable()
export class AbsoluteRightsClassifComponent implements OnInit {
    @Input() editMode: boolean = true;
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() curentUser: IParamUserCl;
    @Input() cancelMode: boolean;
    @ViewChild('newCards') newCards;
    @Output() Changed = new EventEmitter();
    userTechList;
    isLoading: boolean = false;
    isShell: Boolean = false;
    ParentDue: any = [];
    ContentNewCard: BsModalRef;
    strNewCards: any;
    listClassif: RightClassifNode[] = [];
    private SubmitCards: Subject<any> = new Subject();
    constructor (
        private _apiSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService,
        private _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,
        private pipRx: PipRX,
        private _modalSrv: BsModalService,
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
    DueArrayCreate(data): string {
        let depChildStr = '';
        const count = this.ParentDue.length;
        for (const item of data) {
            if ((item.DUE.split('.').length - 1) === 2 && this.ParentDue.indexOf(item.DUE) === -1 && item.DUE !== '0.') {
                this.ParentDue.push(item.DUE);
            }
        }
        if (this.ParentDue.length !== count) {
            depChildStr =  this.ParentDue.join('%.|') + '%.';
            depChildStr = depChildStr.replace('0.%.', '');
        }
        return depChildStr;
    }
    addInstance(config: IConfigUserTechClassif, node: RightClassifNode): Promise<any> {
        return this._waitClassifSrv.openClassif(config.waitClassif)
        .then((data: string) => {
            if (data.length) {
                return this.getEntyti(data.split('|').join('||'), config);
            }
            return Promise.reject('');
        })
        .then((data: any) => {
            if (this._checkRepeat(node, data, config)) {
                this._msgSrv.addNewMessage(EMPTY_ADD_ELEMENT_WARN);
                return;
            } else {
                const parArr = [];
                const depStr = this.DueArrayCreate(data);
                data.forEach((parent) => {
                    if ((parent.DUE.split('.').length - 1) === 2 && parent.DUE !== '0.') {
                        parArr.push(parent.DUE);
                    }
                });
                if (depStr !== '' && depStr !== '%.') {
                    return this.GetCardsChild(depStr, data, parArr);
                } else {
                    return data;
                }
            }
        });
    }
    hideToolTip() {
        const element = document.querySelector('.tooltip');
        if (element) {
            element.setAttribute('style', 'display: none');
        }
    }

    closeCardTech() {
        this.SubmitCards.next(false);
    }
    saveCardTech() {
        this.SubmitCards.next(true);
    }
    GetCardsChild(depStr: string, checkData: any, parArr): Promise<any> {
        return this.pipRx.read({
            DEPARTMENT: {
                criteries: {
                    DUE: depStr,
                    ISN_CABINET: `isnull`,
                    CARD_FLAG: `1`,
                }
            }
        }).then((depData: any) => {
            const oldCards = this.userTechList.map(item => item.DUE);
            const NewDepData = depData.filter((dep) => parArr.indexOf(dep.DUE) === -1 && parArr.indexOf(dep.PARENT_DUE) !== -1 &&
            oldCards.indexOf(dep.DUE) === -1);
            return this._askForAddCard(NewDepData)
                .then((addCard) => {
                    this.ContentNewCard.hide();
                    if (addCard === true) {
                        const result = checkData.concat(NewDepData);
                        return result;
                    } else {
                        return checkData;
                    }
                })
                .catch(() => {
                    this._msgSrv.addNewMessage({
                        type: 'danger',
                        title: 'Ошибка добавления картотек:',
                        msg: 'Ошибка добавление подчиненных картотек'
                    });
                });
        });
    }
    private _init () {
        if (this.selectedNode.isCreate || !this.curentUser['TECH_RIGHTS']) {
            const techRights: string = '1'.repeat(40);
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
        const techListLim = this.userTechList.filter((tech) => tech.FUNC_NUM === 1);
        TECH_USER_CLASSIF.forEach((item: ITechUserClassifConst) => {
            if (item.key === 1 && techListLim.length !== 0) {
                item.label = 'Пользователи (доступ ограничен)';
            }
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
    private _askForAddCard(data: any): any {
        this.strNewCards = [{value: 'Включить в перечень подчиненные картотеки:'}];
        data.forEach((card) => {
            this.strNewCards.push({value: String(card.CARD_NAME), due: card.DUE});
        });
        this.ContentNewCard = this._modalSrv.show(this.newCards);
        return new Promise((res, _rej) => {
            this.SubmitCards.subscribe((confirm) => {
                if (confirm !== undefined) {
                    res(confirm);
                }
            });
        });
    }
}
