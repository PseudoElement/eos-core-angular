import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NodeAbsoluteRight } from '../node-absolute';
import { INodeDocsTreeCfg, IParamUserCl } from '../../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { IChengeItemAbsolute } from '../right-delo.intefaces';
import { RightClassifNode } from './absolute-rights-classif-node';
import { ITechUserClassifConst, E_TECH_USER_CLASSIF_CONTENT, IConfigUserTechClassif, E_TECH_RIGHTS, ETypeTechRight } from './tech-user-classif.interface';
import { UserParamApiSrv } from '../../../../eos-user-params/shared/services/user-params-api.service';
import { OPEN_CLASSIF_DEPARTMENT_ONLI_NODE, OPEN_CLASSIF_DOCGROUP_CL_ONLI_NODE, OPEN_CLASSIF_RUBRIC_CL_ONLI_NODE, OPEN_CLASSIF_CARDINDEX } from '../../../../app/consts/query-classif.consts';
import { WaitClassifService } from '../../../../app/services/waitClassif.service';
import { NodeDocsTree } from '../../../../eos-user-params/shared/list-docs-tree/node-docs-tree';
import { EosMessageService } from '../../../../eos-common/services/eos-message.service';
import { EMPTY_ADD_ELEMENT_WARN } from '../../../../app/consts/messages.consts';
import { UserParamsService } from '../../../../eos-user-params/shared/services/user-params.service';
import { PipRX } from '../../../../eos-rest';
import { AppContext } from '../../../../eos-rest/services/appContext.service';
import { ExetentionsRigthsServiceLib } from '../../../../eos-rest/addons/extentionsRigts.service';
import { E_CLASSIF_ID } from './tech-user-classif.consts';
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
    @ViewChild('newCards', { static: true }) newCards;
    @Output() Changed = new EventEmitter();
    @Output() allNotCheck = new EventEmitter();
    userTechList;
    isLoading: boolean = false;
    isShell: Boolean = false;
    strNewCards: any;
    listClassif: RightClassifNode[] = [];
    private _techUserRigts: ITechUserClassifConst[] = [];
    private copyPrav = [
        E_TECH_RIGHTS.Subdivisions, 
        E_TECH_RIGHTS.CaseNomenclature,
        E_TECH_RIGHTS.Cabinets,
        E_TECH_RIGHTS.ProcedureForSubmittingDocuments
    ];
    private allCopyElem = [
        {
            title: 'Подразделения',
            key: E_TECH_RIGHTS.Subdivisions,
            disable: false
        },
        {
            title: 'Номенклатура дел',
            key: E_TECH_RIGHTS.CaseNomenclature,
            disable: false
        },
        {
            title: 'Кабинеты',
            key: E_TECH_RIGHTS.Cabinets,
            disable: false
        },
        {
            title: 'Процедура передачи документов',
            key: E_TECH_RIGHTS.ProcedureForSubmittingDocuments,
            disable: false
        }
    ];
    get isCheckedSide() {
        let type = null;
        let count = 0;
        let countEnable = 0;
        this.listClassif.forEach(item => {
            if (item.value) {
                count++;
            }
            if (item.disableItem) {
                countEnable++;
            }
        });
        if (count === countEnable) {
            type = true;
        }   else if (count === 0) {
            type = null;
        }   else {
            type = false;
        }
        return type;
    }

    get getflagChecked() {
        switch (this.isCheckedSide) {
            case true:
                return (this.editMode && this.selectedNode.control.enabled) && !this.limitedTehnologist ? 'eos-adm-icon-checkbox-square-v-blue' : 'eos-adm-icon-checkbox-black';
            case false:
                return (this.editMode && this.selectedNode.control.enabled) && !this.limitedTehnologist ? 'eos-adm-icon-checkbox-square-minus-blue' : 'eos-adm-icon-checkbox-square-minus-grey';
            default:
                return (this.editMode && this.selectedNode.control.enabled) && !this.limitedTehnologist ?  'eos-adm-icon-checkbox-square-blue' : 'eos-adm-icon-checkbox-square-grey';
        }
    }

    get limitedTehnologist() {
        return !!this._appContext.limitCardsUser.length;
    }
    constructor (
        private _apiSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService,
        public _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,
        private pipRx: PipRX,
        private _appContext: AppContext,
        public _extentionsRigts: ExetentionsRigthsServiceLib,
    ) {
        this.userTechList = this._userParmSrv.userTechList;
    }
    ngOnInit() {
        this.registerExtentionsRigths();
        this._init();
        this.isLoading = true;
    }
    getDisableNode(node: RightClassifNode) {
        return !this.editMode || this.selectedNode.control.disabled || !node.disableItem;
    }
    updateFlagDictionaries() {
        const flag = this.isCheckedSide;
        this.listClassif.forEach(item => {
            if (item.disableItem) {
                item.value = flag ? 0 : 1;
            }
        });
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
    copyButtonView(key: ETypeTechRight): boolean {
        return this.copyPrav.indexOf(key) >= 0; 
    }
    getListCopy(key: ETypeTechRight) {
        const massDisable = [];
        this.listClassif.forEach((item) => {
            if (this.copyPrav.indexOf(item.key) >= 0 && item.value === 0) {
                massDisable.push(item.key);
            }
        });
        this.allCopyElem.forEach((elem) => {
            massDisable.indexOf(elem.key)
            if (massDisable.indexOf(elem.key) >= 0) {
                elem.disable = true;
            }
        });
        return this.allCopyElem.filter((item) => item.key !== key);
    }
    async copyWhere(elem, node) {
        if (!elem.disable) {
            const infoToCopy = this.listClassif.filter((item) => item.key === elem.key)[0];
            if (infoToCopy.listContent.length === 0) {
                await infoToCopy.createListContent(infoToCopy.listUserTech, infoToCopy.listContent);
            }
            const templistUserTech = JSON.parse(JSON.stringify(infoToCopy.listUserTech));
            const templistContent = [];
            infoToCopy.listContent.forEach((content) => {
                const cfg: INodeDocsTreeCfg = {
                    due: content['DUE'],
                    label: content.label,
                    allowed: !!content.isAllowed,
                    data: content.data,
                };
                templistContent.push(cfg)
            });
            
            templistUserTech.forEach((item) => {
                item['CLASSIF_ID'] = E_CLASSIF_ID[node['key'].toString()];
                item['FUNC_NUM'] = node['key'];
            });
            node.copyInstance(templistUserTech, templistContent);
        }
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
    private registerExtentionsRigths(): void {
        const extendsRigths = this._extentionsRigts.extendsTechRigthsUser();
        const rigths = this._extentionsRigts.techUserRigth().slice();

        extendsRigths.forEach(ex => {
            let exitFromLoop = false;
            const indexInsert = ex.indexInsert;
            rigths.forEach((r, i) => {
                if (exitFromLoop) {return;}
                if (indexInsert === 0 || indexInsert) {
                    if (i === indexInsert) {
                        rigths.splice(i, 0, ex.data);
                        exitFromLoop = true;
                    }
                } else {
                    rigths.push(ex.data);
                    exitFromLoop = true;
                }
            });
        });

        this._techUserRigts = rigths;
    }

    private _init () {
        if (this.selectedNode.isCreate || !this.curentUser['TECH_RIGHTS']) {
            const techRights: string  = this._extentionsRigts.getTechRigth();
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
            this._extentionsRigts.updateRigth(arr);
            // обрезаю .substring(0, 41); т.к. в кривой базе 50 символов, а пропускает только 41
            this.curentUser['TECH_RIGHTS'] = arr.join('').substring(0, 64);
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
        this._techUserRigts.forEach((item: ITechUserClassifConst) => {
            if (item.key === E_TECH_RIGHTS.Users && techListLim.length !== 0) {
                item.label = 'Пользователи (доступ ограничен)';
            }
            if (item.key === E_TECH_RIGHTS.EmailBuffer) {
                item.label = this._appContext.cbBase ? 'Концентратор' : 'Буфер электронных сообщений';
            }
            this.listClassif.push(new RightClassifNode(item, this.curentUser, this.selectedNode, this));
        });
        if (this.selectedNode.isCreate) {
            this.selectedNode.isCreate = false;
        }
        this._extentionsRigts.disableNode(this.selectedNode, this.curentUser['TECH_RIGHTS']);
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
