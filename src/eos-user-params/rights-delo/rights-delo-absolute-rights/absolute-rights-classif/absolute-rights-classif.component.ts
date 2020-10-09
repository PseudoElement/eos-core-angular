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
/* import { AppContext } from 'eos-rest/services/appContext.service'; */
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
    @Output() allNotCheck = new EventEmitter();
    userTechList;
    isLoading: boolean = false;
    isShell: Boolean = false;
    strNewCards: any;
    listClassif: RightClassifNode[] = [];
    constructor (
        private _apiSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService,
        public _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,
        private pipRx: PipRX,
        /* private _appContext: AppContext, */
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
        const ParentDue = [];
        for (const item of data) {
            if (item.DUE !== '0.') {
                ParentDue.push(item.DUE);
            }
        }
        depChildStr = ParentDue.join('%.|') + '%.';
        depChildStr = depChildStr.replace('0.%.', '');
        return depChildStr;
    }
    veryBigEntyti(config: IConfigUserTechClassif, due: string ) {
        const reqs = [];
        let str = '';
        due.split('|').forEach(elem => {
            if (str.length < 1500) {
                if (str.length === 0) {
                    str = str + elem;
                } else {
                    str = str + '|' + elem;
                }
             } else {
                reqs.push(this.getEntyti(str, config));
                str = '';
             }
        });
        if (str !== '') {
            reqs.push(this.getEntyti(str, config));
        }
        return Promise.all(reqs).then((responses) => {
            let mas = [];
            responses.forEach(elem => {
                mas = mas.concat(elem);
            });
            return mas;
        });
    }
    addInstance(config: IConfigUserTechClassif, node: RightClassifNode): Promise<any> {
        return this._waitClassifSrv.openClassif(config.waitClassif)
        .then((data: string) => {
            if (data.length) {
                if (data.split('|').join('|').length > 1500) {
                    return this.veryBigEntyti(config , data);
                } else {
                    return this.getEntyti(data.split('|').join('|'), config);
                }
            }
            return Promise.reject('');
        })
        .then((data: any) => {
            if (this._checkRepeat(node, data, config)) {
                this._msgSrv.addNewMessage(EMPTY_ADD_ELEMENT_WARN);
                return;
            } else {
                if (config.rootLabel === 'Центральная картотека') {
                    const parArr = [];
                    const depStr = this.DueArrayCreate(data);
                    data.forEach((parent) => {
                        if (parent.DUE !== '0.') {
                            parArr.push(parent.DUE);
                        }
                    });
                    if (depStr !== '' && depStr !== '%.') {
                        return this.GetCardsChild(depStr, data, parArr);
                    }
                }
                return data;
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
        this._userParmSrv.SubmitCards.next(false);
    }
    saveCardTech() {
        this._userParmSrv.SubmitCards.next(true);
    }
    GetCardsChild(depStr: string, checkData: any, parArr): Promise<any> {
        const reqs = [];
        let str = '';
        depStr.split('|').forEach(elem => {
            if (str.length < 1500) {
                if (str.length === 0) {
                    str = str + elem;
                } else {
                    str = str + '|' + elem;
                }
             } else {
                reqs.push(this.pipRx.read({ DEPARTMENT: {
                    criteries: {
                        DUE: str,
                        ISN_CABINET: `isnull`,
                        CARD_FLAG: `1`,
                    }
                }}));
                str = '';
             }
        });
        if (str !== '') {
            reqs.push(this.pipRx.read({ DEPARTMENT: {
                criteries: {
                    DUE: str,
                    ISN_CABINET: `isnull`,
                    CARD_FLAG: `1`,
                }
            }, orderby: 'CARD_NAME asc'
            }));
        }
        return Promise.all([...reqs]).then((depData: any) => {
            const arrDue = [];
            this.userTechList.forEach(item => {
                if (item.FUNC_NUM === 1) {
                    arrDue.push(item.DUE);
                }
            });
            const NewDepData = depData[0].filter((dep) => parArr.indexOf(dep.DUE) === -1 && arrDue.indexOf(dep.DUE) === -1);
            if (NewDepData.length !== 0) {
                return this.askForAddCard(NewDepData)
                .then((addCard) => {
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
            } else {
                return checkData;
            }
        });
    }
    askForAddCard(data: any): Promise<any> {
        this.strNewCards = [];
        this.strNewCards = [{value: 'Включить в перечень подчиненные картотеки:'}];
        data.forEach((card) => {
            this.strNewCards.push({value: String(card.CARD_NAME), due: card.DUE});
        });
        return this._userParmSrv.confirmCallCard(this.newCards);
    }

    DeleteChildCards(str: string): Promise<any> {
        return this.pipRx.read({
            DEPARTMENT: {
                criteries: {
                    DUE: `${str}%`,
                    ISN_CABINET: `isnull`,
                    CARD_FLAG: `1`,
                }
        }}).then((data: any) => {
            this.strNewCards = [{value: 'Исключить из перечня подчиненные картотеки:'}];
            const arrDueOld = [];
            const newCards = [];
            this.userTechList.forEach((item) => {
                if (item.FUNC_NUM === 1) {
                    arrDueOld.push(item.DUE);
                }
            });
            data.forEach((card) => {
                if (arrDueOld.indexOf(card.DUE) !== -1) {
                    newCards.push(card);
                    if (card.DUE !== str) {
                        this.strNewCards.push({value: String(card.CARD_NAME), due: card.DUE});
                    }
                }
            });
            return newCards;
        });
    }

    private _init () {
        if (this.selectedNode.isCreate || !this.curentUser['TECH_RIGHTS']) {
            const techRights: string = '1'.repeat(21) + '0' + '1'.repeat(18) + '1';
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
            // обрезаю .substring(0, 41); т.к. в кривой базе 50 символов, а пропускает только 41
            this.curentUser['TECH_RIGHTS'] = arr.join('').substring(0, 41);
        }
        const techListLim = this.userTechList.filter((tech) => tech.FUNC_NUM === 1);
        /* if (!this._appContext.cbBase) {
            let delIndex;
            TECH_USER_CLASSIF.forEach((elem, index) => {
                if (elem.key === 22) {
                    delIndex = index;
                }
            });
            if (delIndex) {
                TECH_USER_CLASSIF.splice(delIndex, 1);
            }
        } */
        TECH_USER_CLASSIF.forEach((item: ITechUserClassifConst) => {
            if (item.key === 1 && techListLim.length !== 0) {
                item.label = 'Пользователи (доступ ограничен)';
            }
            if (item.key === 35 /* && this._appContext.cbBase */) {
                item.label = 'Концентратор';
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
                    title: 'Предупреждение',
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
