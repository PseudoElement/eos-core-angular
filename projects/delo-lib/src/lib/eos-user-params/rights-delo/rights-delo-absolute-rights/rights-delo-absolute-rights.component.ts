import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, RouterStateSnapshot } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamApiSrv } from '../../../eos-user-params/shared/services/user-params-api.service';
import { ABSOLUTE_RIGHTS_BTN_TABEL_SECOND, CONTROL_ALL_NOTALL, ETypeDeloRight } from './absolute-rights.consts';
import { InputParamControlService } from '../../../eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl, IParamUserCl } from '../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { UserParamsService } from '../../../eos-user-params/shared/services/user-params.service';
import { E_RIGHT_DELO_ACCESS_CONTENT, IChengeItemAbsolute } from './right-delo.intefaces';
import { RadioInput } from '../../../eos-common/core/inputs/radio-input';
import { NodeAbsoluteRight } from './node-absolute';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from '../../../eos-common/consts/common.consts';
import { USER_TECH, USERDEP, ORGANIZ_CL, USER_RIGHT_DOCGROUP } from '../../../eos-rest';
// import { RestError } from 'eos-rest/core/rest-error';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { ENPTY_ALLOWED_CREATE_PRJ } from '../../../app/consts/messages.consts';
import { EosStorageService } from '../../../app/services/eos-storage.service';
import { AppContext } from '../../../eos-rest/services/appContext.service';
import { ExetentionsRigthsServiceLib } from '../../../eos-rest/addons/extentionsRigts.service';
import { AbsoluteRigthServiceLib } from '../../../eos-rest/addons/absoluteRigth.service';
import { ITableData, ITableHeader, ITableSettings } from '../../../eos-parameters/parametersSystem/shared/interfaces/tables.interfaces';
import { NavParamService } from '../../../app/services/nav-param.service';
import { RughtDeloAbsRightService } from './right-delo-absolute-rights.service';
import { ReportingService } from './right-srch-group/right-srch-group.component';
import { E_TECH_RIGHTS } from './absolute-rights-classif/tech-user-classif.interface';
/* import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces'; */
@Component({
    selector: 'eos-rights-delo-absolute-rights',
    templateUrl: 'rights-delo-absolute-rights.component.html'
})

export class RightsDeloAbsoluteRightsComponent implements OnInit, OnDestroy {
    @ViewChild('tableAuthorized', { static: false }) tableAuthorized;
    @ViewChild('autorizTable', { static: false }) autorizTable;
    curentUser: IParamUserCl;
    btnDisabled: boolean = true;
    isLoading: boolean = false;
    arrDeloRight: string[];
    arrNEWDeloRight: string[];
    selectedNode: NodeAbsoluteRight; // текущий выбранный элемент
    selectListNode: number = 0;
    fields: IInputParamControl[];
    inputs;
    inputAll;
    form: FormGroup;
    formGroupAll: FormGroup;
    subs = {};
    queryForSave = [];
    rightContent: boolean;
    listRight: NodeAbsoluteRight[] = [];
    techRingtOrig: string;
    techUsers: Array<any> = [];
    limitUserTech: boolean;
    flagDel: boolean = false;
    groupDelRK = [];
    resolutionsRights: number;
    projectResol: number;
    public editMode: boolean = false;
    TABLE_HEADER_ABS_RIGHT: ITableHeader[] = [];
    public authorizedRight = false;
    public tabelData: ITableData = {
        tableBtn: [],
        tableHeader: [],
        data: [],
    };
    public settingsTable: ITableSettings = {
        hiddenCheckBox: true,
        maxHeightTable: 'calc(100vh - 275px)',
        minHeightTable: 'calc(100vh - 275px)',
        count: true,
        printTable: true,
        headerStyle: {
            background: '#f5f5f5',
            border: '#E6E6E6'
        },
        expandFixedColumn: true,
        expandFixedColumnName: 'absolute-rights-fixed-width'
    }
    public leftSendwitch;
    get titleHeader() {
        if (this.curentUser) {
            if (this.curentUser.isTechUser) {
                return this.curentUser.CLASSIF_NAME + '- Абсолютные права';
            }
            return `${this.curentUser['DUE_DEP_SURNAME']} - Абсолютные права`;
        }
        return '';
    }
    private _ngUnsubscribe: Subject<any> = new Subject();
    private flagGrifs: boolean = false;
    private DELETE_RCPD = 'У пользователя назначено право \'Создание РКПД\' .Без права \'Исполнение проектов\' оно не работает. Снять это право?';
    private CREATE_RCPD = 'У пользователя нет права \'Исполнение проектов\', добавить его?';
    private GRUP_DEL_RK = 'Назначить права пользователю на выполнение операции «Удаление РК» в доступных ему картотеках?';
    private GRUP_NOT_DEL_RK = 'У пользователя назначены права на выполнение операции «Удаление РК» в доступных ему картотеках. Снять?';
    private expandStr = 'USER_PARMS_List,USERDEP_List,USER_RIGHT_DOCGROUP_List,USER_TECH_List,USER_ORGANIZ_List,USERCARD_List/USER_CARD_DOCGROUP_List,USER_SRCH_GROUP_List';
    private simpleBase = false; // тут хранится знание колхозная база или нет
    constructor(
        private _msgSrv: EosMessageService,
        private _userParamsSetSrv: UserParamsService,
        private apiSrv: UserParamApiSrv,
        private _inputCtrlSrv: InputParamControlService,
        private _router: Router,
        // private pipRx: PipRX,
        private _errorSrv: ErrorHelperServices,
        private _storageSrv: EosStorageService,
        private _appContext: AppContext,
        private _extentionsRigts: ExetentionsRigthsServiceLib,
        private _absRigthServ: AbsoluteRigthServiceLib,
        private _navSrv: NavParamService,
        private _rightDeloService: RughtDeloAbsRightService,
        private reportingSrv: ReportingService
    ) { }
    ngOnInit() {
        let expandStr = this.expandStr;
        expandStr += this._absRigthServ.getExpandStr(); // расширение получения данных для пользователя
        this._userParamsSetSrv.getUserIsn({
            expand: expandStr
        })
        .then(() => {
            const id = this._userParamsSetSrv.curentUser['ISN_LCLASSIF'];
            this._userParamsSetSrv.checkGrifs(id).then(async (el) => {
                this.flagGrifs = el;
                const data = await this.apiSrv.getData({
                    DEPARTMENT: {
                        criteries: {
                            'DUE_LINK_ORGANIZ': 'isnotnull',
                            'DELETED': 0
                        },
                        orderby: 'CLASSIF_NAME',
                    }
                });
                const dueOrg = [];
                data.forEach((item) => {
                    dueOrg.push(item['DUE_LINK_ORGANIZ']);
                });
                this.simpleBase = data.length >= 2;
                this.init();
            });
        })
        .catch(el => {
        });
        this._userParamsSetSrv.canDeactivateSubmit$
        .pipe(
            takeUntil(this._ngUnsubscribe)
        )
        .subscribe((rout: RouterStateSnapshot) => {
            this._userParamsSetSrv.submitSave = this.submit('true');
        });
        this._navSrv.StateSandwich$
        .pipe(
            takeUntil(this._ngUnsubscribe)
        )
        .subscribe((state: boolean) => {
            this.leftSendwitch = state;
        });
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }

    /* absoluteRightReturnCB() {
        const arrayFirst = ABSOLUTE_RIGHTS.filter(elem => {
            if (elem.key === '2' || elem.key === '30') {
                return false;
            }
            return true;
        });
        const array = [];
        arrayFirst.forEach((elem, index) => {
            if (elem.key === '9') {
                elem.label = 'Редактирование рег. данных РК';
            }
            array.push(elem);
            if (index === 1) {
                array.push({
                    controlType: E_FIELD_TYPE.boolean,
                    key: '2',
                    label: 'Централизованная отправка документов',
                    data: {
                        isSelected: false,
                        rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
                    }
                });
            }
            if (elem.label === 'Подписание проектов') {
                array.push({
                    controlType: E_FIELD_TYPE.boolean,
                    key: '31',
                    label: 'Исполнение проектов',
                    data: {
                        isSelected: false,
                        rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
                    }
                });
                array.push({
                    controlType: E_FIELD_TYPE.boolean,
                    key: '32',
                    label: 'Чтение проектов',
                    data: {
                        isSelected: false,
                        rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
                    }
                });
            }
        });
        return array;
    } */
    getContentProp() {
        return this.selectedNode?.viewToAuthorized;
    }
    init() {
        const ABS = this._absRigthServ.getAbsoluteRigth();
        if (this.simpleBase) {
            ABS.forEach((item) => {
                if (item.key === ETypeDeloRight.UploadingInformationToSSTU) {
                    item.data.rightContent = E_RIGHT_DELO_ACCESS_CONTENT.organiz
                }
            });
        }
        if (this._appContext.cbBase) {
            ABS[2].label = 'Централизованная отправка документов';
        }
        this.TABLE_HEADER_ABS_RIGHT = [];
        this.TABLE_HEADER_ABS_RIGHT.push({
            title: 'Участники документооборота',
            id: 'CLASSIF_NAME',
            style: { 'min-width': '360px', 'max-width': '360px' },
            fixed: true
        });
        let tablePredSort = [];
        ABS.forEach((item) => {
            if (item.viewToAuthorized) {
                const newElem = {
                    title: item.label,
                    id: item.key,
                    style: { 'min-width': item.optionBtn || item.key === ETypeDeloRight.IntroductionOfDraftResolutions ? '200px' : '140px', 'max-width': item.optionBtn || item.key === ETypeDeloRight.IntroductionOfDraftResolutions ? '200px' : '140px' },
                    data: item
                }
                tablePredSort.push(newElem);
            }
        });
        tablePredSort = tablePredSort.sort((a, b) => {
            if (a.data.positionAuthorized > b.data.positionAuthorized) {
                return 1;
            } else if (a.data.positionAuthorized < b.data.positionAuthorized) {
                return -1;
            } else {
                /*
                * Если у элемента не будет positionAuthorized то пусть он будет в самом конце
                */
                return -1;
            }
        });
        this.TABLE_HEADER_ABS_RIGHT = this.TABLE_HEADER_ABS_RIGHT.concat([...tablePredSort]);
        this.settingsTable.defaultSettingHeader = JSON.parse(JSON.stringify(this.TABLE_HEADER_ABS_RIGHT));
        const curentSettingStr = localStorage.getItem('' + this._appContext.CurrentUser.ISN_LCLASSIF);
        if (curentSettingStr) {
            const curentSetting = JSON.parse(curentSettingStr);
            if (curentSetting[this.settingsTable.expandFixedColumnName]) {
                this.TABLE_HEADER_ABS_RIGHT[0]['style']['min-width'] = curentSetting[this.settingsTable.expandFixedColumnName];
                this.TABLE_HEADER_ABS_RIGHT[0]['style']['max-width'] = curentSetting[this.settingsTable.expandFixedColumnName];
            }
        }
        this.settingsTable.defaultSettingHeaderName = 'absoluteRights';
        this.tabelData.tableHeader = this.updateHeaderTable([...this.TABLE_HEADER_ABS_RIGHT]);
        this.curentUser = this._userParamsSetSrv.curentUser;
        this.techRingtOrig = this.curentUser.TECH_RIGHTS;
        this.curentUser['DELO_RIGHTS'] = this.curentUser['DELO_RIGHTS'] || '0'.repeat(37);
        this.arrDeloRight = this.curentUser['DELO_RIGHTS'].split('');
        this.arrNEWDeloRight = this.curentUser['DELO_RIGHTS'].split('');
        this.resolutionsRights = +this.arrNEWDeloRight[26];
        this.projectResol = +this.arrNEWDeloRight[27];
        this.fields = this._writeValue(ABS);
        this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
        this.listRight = this._createList(ABS);
        this.form.valueChanges
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                this.listRight.forEach(node => {
                    this.arrNEWDeloRight[+node.key] = node.value.toString();
                });
                this.checkChange();
                setTimeout(() => {
                    this._viewContent();
                }, 0);
            });

        this.selectNode(this.listRight[this.selectListNode]);
        this.inputAll = { all: new RadioInput(CONTROL_ALL_NOTALL) };
        this.isLoading = true;
        if (this._appContext.limitCardsUser.length > 0) {
            let arr;
            /* if (this._appContext.cbBase) { */
            arr = [
                ETypeDeloRight.SystemTechnologist,
                ETypeDeloRight.SearchInAllFileCabinets,
                ETypeDeloRight.ViewAllOrders,
                ETypeDeloRight.BulkDeletionOfAds,
                ETypeDeloRight.ReadingFilesInAllFileCabinets,
                ETypeDeloRight.UploadingInformationToSSTU
            ];
            if (!this._appContext.cbBase) {
                arr.push(ETypeDeloRight.SendingDocumentsToRegisters);
            }
            /* } else {
                arr = ['0', '1', '2', '3', '18', '23', '29'];
            } */
            this.listRight.forEach(elem => {
                if (arr.indexOf(elem.key) !== -1) {
                    elem.control.disable({ emitEvent: false });
                }
            });
        }
    }

    // GetSysTechUser(): Promise<any> {
    //     return this.pipRx.read({
    //         USER_CL: {
    //             criteries: {
    //                 DELO_RIGHTS: '1%',
    //                 DELETED: '0',
    //                 ISN_LCLASSIF: '1:null'
    //             },
    //         },
    //         loadmode: 'Table',
    //         expand: 'USER_TECH_List'
    //     }).then((data: USER_CL[]) => {
    //         const countNotLim = [];
    //         const curLimUser = data.filter(user => this.curentUser.ISN_LCLASSIF === user.ISN_LCLASSIF && !this._userParamsSetSrv.CheckLimitTech(user.USER_TECH_List));
    //         for (const user of data) {
    //             if (!this._userParamsSetSrv.CheckLimitTech(user.USER_TECH_List) && user.TECH_RIGHTS.charAt(0) === '1') {
    //                 countNotLim.push(user);
    //             }
    //         }
    //         if (countNotLim.length > curLimUser.length || (countNotLim.length === curLimUser.length  && countNotLim[0].ISN_LCLASSIF !== curLimUser[0].ISN_LCLASSIF)) {
    //             this.limitUserTech = false;
    //         } else {
    //             this.limitUserTech = true;
    //             if (this.checkChangeToLimitUser(countNotLim)) {
    //                 this.limitUserTech = true;
    //             } else {
    //                 this.limitUserTech = false;
    //             }
    //         }
    //     });
    // }

    checkChangeToLimitUser(): boolean {
        let sysTechBol = false;
        const arr = this.listRight[0].change;
        if (this.listRight[0].change.length !== 0) {
            arr.map((val) => {
                if (val.hasOwnProperty('funcNum') && val.funcNum === 1) {
                    sysTechBol = true;
                } else {
                    if (val.data.hasOwnProperty('TECH_RIGHTS') && val.data.TECH_RIGHTS.charAt(0) === '0') {
                        sysTechBol = true;
                    }
                }
            });
        }
        return sysTechBol;
    }

    submit(flag?): Promise<any> {
        /** Добавлено чтобы обработать возможность того что у пользователя стоит невидимая галка Типы адреса.
        *  Данный параметр невидимый и делаю обработку чтобы он не участвовал в проверке последовательности
        */
        if (this.listRight[0]['_curentUser'].TECH_RIGHTS) {
            const newTechRight = this.listRight[0]['_curentUser'].TECH_RIGHTS.split('');
            newTechRight[E_TECH_RIGHTS.AddressTypes - 1] = '0';
            this.listRight[0]['_curentUser'].TECH_RIGHTS = newTechRight.join('');
        }
        if (this.listRight[0].value && !/[1]+/g.test(this.listRight[0]['_curentUser'].TECH_RIGHTS)) {
            this._msgSrv.addNewMessage({ title: 'Предупреждение', msg: `Не заданы настройки для права "Системный технолог"`, type: 'warning' });
            return Promise.resolve('error');
        }
        return this._extentionsRigts.preSaveCheck(this).then(access => {
            if (access) {
                this.isLoading = false;
                const elemRight = this.returnElemListRight('0');
                /* вот это лучше всего убрать в расширение @extension@ */
                if (this.curentUser.IS_SECUR_ADM === 1 && elemRight && elemRight.control.value) {
                    let flag_tech = true;
                    this.listRight.forEach(elem => {
                        if (elem.key === '0' && elem.value === 1) {
                            flag_tech = false;
                        }
                    });
                    if (!flag_tech) {
                        this._msgSrv.addNewMessage({ title: 'Предупреждение', msg: `Право 'Cистемный технолог' не может быть назначено одновременно с правом 'Администратор системы'`, type: 'warning' });
                        this.editMode = true;
                        this.isLoading = true;
                        this.btnDisabled = false;
                        return Promise.resolve('error');
                    }
                }
                return this._userParamsSetSrv.getSysTechUser({ oldRights: this.arrDeloRight, newRights: this.arrNEWDeloRight, editUser: this.curentUser })
                    .then((limited: boolean) => {
                        this.limitUserTech = limited;
                        //  false : this.checkChangeToLimitUser();
                        if (this.limitUserTech === false) {
                            if (this._checkCreatePRJNotEmptyAllowed() || this._checkCreateNotEmpty() || this._checkCreateNotEmptyOrgan()) {
                                if (this._checkCreatePRJNotEmptyAllowed()) {
                                    this._msgSrv.addNewMessage(ENPTY_ALLOWED_CREATE_PRJ);
                                }
                                this.isLoading = true;
                                return Promise.resolve('error');
                            }
                            this.editMode = false;
                            this.btnDisabled = true;
                            this._pushState();
                            let qUserCl;
                            const strNewDeloRight = this.arrNEWDeloRight.join('');
                            const strDeloRight = this.arrDeloRight.join('');
                            if (strNewDeloRight !== strDeloRight) {
                                const q = {
                                    method: 'MERGE',
                                    requestUri: `USER_CL(${this._userParamsSetSrv.userContextId})`,
                                    data: {
                                        DELO_RIGHTS: strNewDeloRight
                                    }
                                };
                                qUserCl = q;
                                this.queryForSave.push(q);
                                this.arrDeloRight = strNewDeloRight.split('');
                            }
                            this.listRight.forEach((node: NodeAbsoluteRight) => {
                                if (node.touched && node.key === '2' && !node.contentProp) {
                                    const sendMethod = node.value === 1 ? 'POST' : 'DELETE';
                                    if (sendMethod === 'POST') {
                                        const q = {
                                            method: sendMethod,
                                            requestUri: `USER_CL(${this._userParamsSetSrv.userContextId})/USERDEP_List`,
                                            data: {
                                                ISN_LCLASSIF: this._userParamsSetSrv.userContextId,
                                                FUNC_NUM: 3,
                                                DUE: '0.',
                                                WEIGHT: null,
                                                DEEP: 1,
                                                ALLOWED: 1
                                            }
                                        };
                                        this.queryForSave.push(q);
                                    }
                                    if (sendMethod === 'DELETE' && this.curentUser.USERDEP_List.length) {
                                        this.curentUser.USERDEP_List.forEach((dep) => {
                                            if (dep.FUNC_NUM === 3) {
                                                const query = {
                                                    method: sendMethod,
                                                    requestUri: `USER_CL(${this._userParamsSetSrv.userContextId})/USERDEP_List('${this._userParamsSetSrv.userContextId} ${dep.DUE} 3')`,
                                                };
                                                this.queryForSave.push(query);
                                            }
                                        });
                                    }

                                }
                                if (node.touched) {
                                    node.submitWeightChanges();
                                    node.change.forEach(ch => {
                                        const batch = this._createBatch(ch, node, qUserCl);
                                        if (batch) {
                                            this.queryForSave.push(batch);
                                        }
                                    });
                                    node.deleteChange();
                                }
                            });
                            if (this.groupDelRK.length > 0) {
                                this.groupDelRK.forEach(Rk => {
                                    this.queryForSave.push(Rk);
                                });
                                this.groupDelRK = [];
                            }
                            this._rightDeloService.updateWeight(this.queryForSave);
                            return this.apiSrv.setData(this.queryForSave)
                                .then(() => {
                                    const contentProp = this.selectedNode.contentProp;
                                    this.queryForSave = [];
                                    this.listRight = [];
                                    this.selectedNode = null;
                                    this.editMode = false;
                                    this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                                    this.flagDel = false;
                                    this._storageSrv.removeItem('abs_prav_mas');
                                    if (this.curentUser['ISN_LCLASSIF'] === this._appContext.CurrentUser['ISN_LCLASSIF'] && contentProp === 6) {
                                        this._appContext.init().then(() => {
                                            if (!this._appContext.CurrentUser.TECH_RIGHTS || this._appContext.CurrentUser.TECH_RIGHTS[0] === '0') {
                                                this._router.navigate(['/spravochniki']);
                                            }

                                        });
                                    }
                                    if (!flag) {
                                        let expandStr = this.expandStr;
                                        expandStr += this._absRigthServ.getExpandStr(); // расширение получения данных для пользователя
                                        return this._userParamsSetSrv.getUserIsn({
                                            expand: expandStr
                                        })
                                            .then(() => {
                                                this.init();
                                                if (this._appContext.CurrentUser.ISN_LCLASSIF === this.curentUser.ISN_LCLASSIF) {
                                                    this._appContext.updateLimitCardsUser(this.curentUser.USER_TECH_List.filter(card => card.FUNC_NUM === 1).map(card => card.DUE));
                                                }
                                                this._userParamsSetSrv.ProtocolService(this.curentUser.ISN_LCLASSIF, 5);
                                            });
                                    } else {
                                        return this._userParamsSetSrv.ProtocolService(this.curentUser.ISN_LCLASSIF, 5);
                                    }
                                }).catch((e) => {
                                    this._errorSrv.errorHandler(e);
                                    this.cancel();
                                });
                        } else {
                            this._msgSrv.addNewMessage({
                                type: 'warning',
                                title: 'Предупреждение',
                                msg: 'Ни один из незаблокированных пользователей не имеет права "Системный технолог" с доступом к модулю "Пользователи" без ограничений.',
                                dismissOnTimeout: 5000
                            });
                            this.cancel();
                        }
                    }
                    ).catch((e) => {
                        this._errorSrv.errorHandler(e);
                        this.cancel();
                    });
            } else {
                return Promise.resolve('error');
            }
        });

        // this.selectedNode = null;
    }
    cancel() {
        this.queryForSave = [];
        this.selectedNode = null;
        this.editMode = false;
        this.btnDisabled = true;
        this.flagDel = false;
        this._storageSrv.removeItem('abs_prav_mas');
        this._pushState();
        let expandStr = this.expandStr;
        expandStr += this._absRigthServ.getExpandStr(); // расширение получения данных для пользователя
        this._userParamsSetSrv.getUserIsn({
            expand: expandStr
        })
            .then(() => {
                this.init();
            });
    }
    edit() {
        const id = this._userParamsSetSrv.curentUser.ISN_LCLASSIF;
        if (!this._userParamsSetSrv.curentUser.USERCARD_List.length) {
            this._router.navigate(['user-params-set/', 'card-files'],
                {
                    queryParams: { isn_cl: id }
                });
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Не определена главная картотека'
            });
            return;
        }
        if (this.flagGrifs) {
            this.editMode = true;
            this.init();
        } else {
            this._router.navigate(['user-params-set/', 'access-limitation'],
                {
                    queryParams: { isn_cl: id }
                });
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Не заданы грифы доступа'
            });
            return;
        }
        // this.setDisableOrEneble();
        this.formAllEditType();
    }
    clickLable(event, item: NodeAbsoluteRight) {
        event.preventDefault();
        event.stopPropagation();
        /* if (!this.editMode) {
            return;
        } */
        // console.log(event, item);
        if (event.target.tagName === 'LABEL') { // click to label
            this.selectedNode.ischeckedAll = false;
            this.selectNode(item);
        }
        if (event.target.tagName === 'SPAN' && this.editMode && item.control.disabled !== true) { // click to checkbox
            const value = !(+item.value);

            item.value = +value;
            if (
                !value &&
                (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.department ||
                    item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz ||
                    item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthor ||
                    item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject ||
                    item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.organiz)
            ) {
                this._deleteAllDep(item);
                if (item.key === ETypeDeloRight.EnteringResolutions) {
                    this.arrNEWDeloRight[26] = '0';
                    this.resolutionsRights = +this.arrNEWDeloRight[26];
                }
                if (item.key === ETypeDeloRight.IntroductionOfDraftResolutions) {
                    this.arrNEWDeloRight[27] = '0';
                    this.projectResol = +this.arrNEWDeloRight[27];
                }
                if (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz ||
                    item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.organiz) {
                    this._deleteAllOrg(item);
                }
            }
            if (!value && (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.docGroup)) {
                this._deleteAllDocGroup(item);
            }
            if (!value && (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.classif)) {
                this._deleteAllClassif(item);
            }
            // if (!value && (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.editOrganiz)) {
            //     this._deleteAllOrgType(item);
            // }
            if (item !== this.selectedNode && (item.isCreate || item.key === ETypeDeloRight.EditingOrganizationsAndCitizens)) {
                this.selectNode(item);
            }
            if (item.value === 1 && item.contentProp === 5) {
                this.selectedNode.ischeckedAll = true;
            }
            if (item.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.srchGroup) {
                item.deleteChange();
                if (!value) {
                    this.reportingSrv.deletedUserSrch(item);
                }
            }
        }
    }

    updateFuncList(funcList: string, flag: boolean): string {
        const func = [];
        if (flag) {
            if (funcList[3] === '1' || funcList[3] === '2') {
                funcList.split('').forEach((Num, index) => {
                    if (index === 3) {
                        func.push('0');
                    } else {
                        func.push(Num);
                    }
                });
            }
        } else {
            if (funcList[3] === '0') {
                funcList.split('').forEach((Num, index) => {
                    if (index === 3) {
                        func.push('1');
                    } else {
                        func.push(Num);
                    }
                });
            }
        }
        return func.join('');
    }
    usercardMerg(user: string, DUE_CARD: string, func: string) {
        return {
            method: 'MERGE',
            requestUri: `${user}USERCARD_List('${this.curentUser.ISN_LCLASSIF} ${DUE_CARD}')`,
            data: {
                FUNCLIST: func
            }
        };
    }
    checkGroupDelRK(flag: boolean) {
        this.groupDelRK = [];
        const arDocGroup: USER_RIGHT_DOCGROUP[] = [];
        this.curentUser['USERCARD_List'].forEach(elem => {
            elem['USER_CARD_DOCGROUP_List'].forEach(card => {
                if (card.FUNC_NUM === 4) {
                    arDocGroup.push(card);
                }
            });
        });
        const user: string = `USER_CL(${this.curentUser.ISN_LCLASSIF})/`;
        if (flag) {
            const answer = confirm(this.GRUP_DEL_RK);
            if (answer) {
                this.curentUser['USERCARD_List'].forEach(elem => {
                    if (elem.FUNCLIST[3] === '0') {
                        const func = this.updateFuncList(elem.FUNCLIST, false);
                        this.groupDelRK.push(this.usercardMerg(user, elem.DUE, func));
                        const ch = {
                            method: 'POST',
                        };
                        ch['requestUri'] = `${user}USERCARD_List('${this.curentUser.ISN_LCLASSIF} ${elem.DUE}')/USER_CARD_DOCGROUP_List`;
                        ch['data'] = {
                            ISN_LCLASSIF: this.curentUser.ISN_LCLASSIF,
                            DUE_CARD: elem.DUE,
                            DUE: '0.',
                            FUNC_NUM: 4,
                            ALLOWED: 1,
                        };
                        this.groupDelRK.push(ch);
                    }
                });
            }
        } else if (arDocGroup.length > 0) {
            const answer = confirm(this.GRUP_NOT_DEL_RK);
            if (answer) {
                this.curentUser['USERCARD_List'].forEach(elem => {
                    const func = this.updateFuncList(elem.FUNCLIST, true);
                    elem['USER_CARD_DOCGROUP_List'].forEach(card => {
                        if (card.FUNC_NUM === 4) {
                            this.groupDelRK.push(this.usercardMerg(user, card.DUE_CARD, func));
                            const ch = {
                                method: 'DELETE',
                            };
                            const uri = `${user}USERCARD_List('${this.curentUser.ISN_LCLASSIF} ${card.DUE_CARD}')/USER_CARD_DOCGROUP_List('${this.curentUser.ISN_LCLASSIF} ${card.DUE_CARD} ${card.DUE} 4')`;
                            ch['requestUri'] = uri;
                            this.groupDelRK.push(ch);
                        }
                    });
                });
            }
        }
    }


    checkRcpd($event, item: NodeAbsoluteRight) {
        if ($event.target.tagName === 'SPAN' && this.editMode) {
            const flag = item.control.value;
            if (item.key === ETypeDeloRight.ProjectExecution) {
                this.checkRcpdDelete(flag);
            }
            if (item.key === ETypeDeloRight.CreationOfRKPD) {
                this.checkExecOrder(flag);
            }
            if (item.key === ETypeDeloRight.BulkDeletionOfAds && !this._appContext.limitCardsUser.length) {
                setTimeout(() => this.checkGroupDelRK(flag), 500);
            }
        }
    }
    returnElemListRight(key: string) {
        let elemReturn;
        this.listRight.forEach(elem => {
            if (elem.key === key) {
                elemReturn = elem;
            }
        });
        return elemReturn;
    } // '5' '28'
    checkRcpdDelete(flag: boolean) {
        if (!flag) {
            if (this.returnElemListRight(ETypeDeloRight.CreationOfRKPD).value) {
                return new Promise((res) => {
                    if (confirm(this.DELETE_RCPD)) {
                        res(true);
                    } else {
                        res(false);
                    }
                }).then(f => {
                    if (f) {
                        this.returnElemListRight(ETypeDeloRight.CreationOfRKPD).control.patchValue(false);
                        this.returnElemListRight(ETypeDeloRight.CreationOfRKPD).value = 0;
                        this._deleteAllDocGroup(this.returnElemListRight(ETypeDeloRight.CreationOfRKPD));
                    }
                });
            }
        }
    }
    createRcpdD() {
        this.returnElemListRight(ETypeDeloRight.CreationOfRKPD).control.patchValue(true);
        this.returnElemListRight(ETypeDeloRight.CreationOfRKPD).control.markAsTouched();
        this.returnElemListRight(ETypeDeloRight.CreationOfRKPD).value = 1;
        this.selectNode(this.returnElemListRight(ETypeDeloRight.CreationOfRKPD));
    }
    checkExecOrder(flag: boolean) {
        setTimeout(() => {
            return new Promise((res, rej) => {
                if (flag) {
                    if (this.returnElemListRight(ETypeDeloRight.ProjectExecution).control.value) {
                        res(false);
                    } else {
                        const f = confirm(this.CREATE_RCPD);
                        if (f) {
                            res(true);
                        } else {
                            res(false);
                        }
                    }
                }
            }).then(answer => {
                if (answer) {
                    this.returnElemListRight(ETypeDeloRight.ProjectExecution).control.patchValue(true);
                    this.returnElemListRight(ETypeDeloRight.ProjectExecution).control.markAsTouched();
                    this.returnElemListRight(ETypeDeloRight.ProjectExecution).value = 1;
                    this.selectNode(this.returnElemListRight(ETypeDeloRight.ProjectExecution));
                }
            });
        }, 500);
    }
    selectNode(node: NodeAbsoluteRight) {
        if (this.selectedNode !== node) {
            if (this.selectedNode) {
                this.selectedNode.isSelected = false;
            }
            this.selectedNode = node;
            this.selectedNode.isSelected = true;
            this._viewContent();
        }
        for (let index = 0; index < this.listRight.length; index++) {
            if (node.key === this.listRight[index].key) {
                this.selectListNode = index;
                return;
            }
        }
    }
    async absoluteTable() {
        const paramsQuer = this._rightDeloService.getParamsToQuery(this.curentUser);
        const allQuery = [];
        if (paramsQuer['newMapDep'].length > 0) {
            allQuery.push(this._userParamsSetSrv.getDepartmentFromUser(paramsQuer['newMapDep']));
        } else {
            allQuery.push(Promise.resolve([]));
        }
        if (paramsQuer['newMapOrg'].length > 0) {
            allQuery.push(this._userParamsSetSrv.getOrganizFromUser(paramsQuer['newMapOrg']));

        } else {
            allQuery.push(Promise.resolve([]));
        }
        const arrayAns = await Promise.all(allQuery);
        this.tabelData.tableBtn = JSON.parse(JSON.stringify(ABSOLUTE_RIGHTS_BTN_TABEL_SECOND));
        this._rightDeloService.curentUser = this.curentUser;
        this._rightDeloService.listRight = this.listRight;
        this._rightDeloService.tabelData = this.tabelData;
        this.tabelData.data = this._rightDeloService.getNewRowToTable(arrayAns, this.tabelData.tableHeader, paramsQuer);
        this._rightDeloService.updateBtn();
        this.isLoading = true;
        this.authorizedRight = true;
    }
    close(flag) {
        this.authorizedRight = false;
        if (flag) {
            this._rightDeloService.updateCurentUser();
            this.checkChange();
        } else {
            this._rightDeloService.clearInfo();
        }

        this._rightDeloService.listRightNew.clear();
    }
    updateHeaderTable(headers: ITableHeader[]): ITableHeader[] {
        const curentSettingStr = localStorage.getItem('' + this._appContext.CurrentUser.ISN_LCLASSIF + 'absoluteRights');
        if (curentSettingStr) {
            const localSetting = JSON.parse(curentSettingStr);
            const newHeader = [];
            localSetting.forEach((oldHeader) => {
                const findHead = headers.find((head) => { return oldHeader === head.id });
                if (findHead) {
                    newHeader.push(findHead);
                }
            });
            return newHeader;
        } else {
            return headers;
        }
    }
    actionTo($event) {
        this._rightDeloService.action($event);
    }
    selectElement($event) {
        /*  */
    }
    changedAll($event) {
        /* if (this._appContext.cbBase) { */ ETypeDeloRight.SystemTechnologist
        const pos_in = this.curentUser.TECH_RIGHTS.indexOf('1');
        if (pos_in === -1 || pos_in >= 37) {
            this.returnElemListRight(ETypeDeloRight.SystemTechnologist).control.patchValue(false);
            this.returnElemListRight(ETypeDeloRight.SystemTechnologist).value = 0;
            this._deleteAllClassif(this.returnElemListRight(ETypeDeloRight.SystemTechnologist));
        }
        /* } else {
            const mas_rigth = this.curentUser.TECH_RIGHTS.split('');
            mas_rigth[21] = '0';
            const pos_in = mas_rigth.join('').indexOf('1');
            if (pos_in === -1 || pos_in >= 37) {
                this.returnElemListRight('0').control.patchValue(false);
                this.returnElemListRight('0').value = 0;
                this._deleteAllClassif(this.returnElemListRight('0'));
            }
        } */
    }
    checkChange(event?) {
        if (event && event === 'del' || event === 'setMain') {
            this.flagDel = true;
        }
        let c = false;
        this.listRight.forEach(li => { // проверяем список на изменения
            if (li.change.length > 0) {
                li.touched = true;
            }
            if (li.touched) {
                c = true;
            }
        });
        if (this.arrNEWDeloRight.join('') !== this.arrDeloRight.join('')) {
            c = true;
        }
        // this.btnDisabled = true;
        this.btnDisabled = !c;
        if (this.flagDel) {
            this.btnDisabled = false;
        }
        this._pushState();
    }

    addIndepRights(rights_type: string) {
        switch (rights_type) {
            case 'PROJECT':
                this.arrNEWDeloRight[27] = this.arrNEWDeloRight[27] === '1' ? '0' : '1';
                this.checkChange();
                this.projectResol = +this.arrNEWDeloRight[27];
                break;
            case 'RESOLUTION':
                this.arrNEWDeloRight[26] = this.arrNEWDeloRight[26] === '1' ? '0' : '1';
                this.checkChange();
                this.resolutionsRights = +this.arrNEWDeloRight[26];
                break;
        }
    }
    private _writeValue(constanta: IInputParamControl[]): IInputParamControl[] {
        const fields = [];
        constanta.forEach((node: IInputParamControl) => {
            const n = Object.assign({ value: !!+this.arrDeloRight[+node['key']] }, node);
            if (!this.editMode) {
                n.disabled = true;
            }
            fields.push(n);
        });
        return fields;
    }
    private formAllEditType() {
        if (this.formGroupAll) {
            this.subs['all'].unsubscribe();
            this.formGroupAll = null;
        }
        this.formGroupAll = new FormGroup({
            all: new FormControl(this.selectedNode.value ? this.arrNEWDeloRight[+this.selectedNode.key] : '0')
        });
        setTimeout(() => {
            if (this.editMode) {
                this.formGroupAll.enable({ emitEvent: false });
            } else {
                this.formGroupAll.disable({ emitEvent: false });
            }
        }, 0);
        this.subs['all'] = this.formGroupAll.valueChanges
            .subscribe(data => {
                this.selectedNode.value = +data['all'];
                this.checkChange();
            });
    }
    private _viewContent() {
        //  this.rightContent = false;
        if (!this.selectedNode) {
            return;
        }
        if (this.selectedNode.contentProp === 2 || this.selectedNode.contentProp !== 5) {
            this.rightContent = false;
        }
        switch (this.selectedNode.contentProp) {
            case E_RIGHT_DELO_ACCESS_CONTENT.all:
                this.formAllEditType();
                this.rightContent = true;
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.editOrganiz:
                this.formAllEditType();
                this.rightContent = true;
                // if (this.selectedNode.value) {
                //     setTimeout(() => {
                //         this.rightContent = true;
                //     }, 0);
                // }
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.classif:
            case E_RIGHT_DELO_ACCESS_CONTENT.docGroup:
            case E_RIGHT_DELO_ACCESS_CONTENT.department:
            case E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz:
            case E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject:
            case E_RIGHT_DELO_ACCESS_CONTENT.organiz:
            case E_RIGHT_DELO_ACCESS_CONTENT.srchGroup:
                if (this.selectedNode.value) {
                    setTimeout(() => {
                        this.rightContent = true;
                    }, 0);
                }
                break;
        }
    }
    private _createList(constanta: IInputParamControl[]): NodeAbsoluteRight[] {
        const fields = [];
        for (const node of constanta) {
            /*
                Проверка: правило контрольности
            */
            if (node.key === ETypeDeloRight.PuttingOnControl && !(+this.curentUser['USER_PARMS_HASH']['RC_CTRL'])) {
                continue;
            }
            if (this.arrDeloRight[+node['key']] === ' ') {
                this.arrDeloRight[+node['key']] = '0';
            }
            fields.push(new NodeAbsoluteRight(node, +this.arrDeloRight[+node['key']], this.form.get(node['key']), this.curentUser));
        }
        return fields;
    }
    private _deleteAllDep(item: NodeAbsoluteRight) {
        const list: USERDEP[] = [];
        this.curentUser.USERDEP_List = this.curentUser.USERDEP_List.filter(li => {
            if (li['FUNC_NUM'] === +item.key + 1) {
                list.push(li);
                return false;
            } else {
                return true;
            }
        });
        item.deleteChangesWeigth();
        list.forEach(li => {
            item.pushChange({
                method: 'DELETE',
                due: li.DUE,
                data: li
            });
        });
        this.checkChange();
    }
    private _deleteAllOrg(item: NodeAbsoluteRight) {
        const list: ORGANIZ_CL[] = [];
        this.curentUser['USER_ORGANIZ_List'] = this.curentUser['USER_ORGANIZ_List'].filter(li => {
            if (li['FUNC_NUM'] === +item.key + 1) {
                list.push(li);
                return false;
            } else {
                return true;
            }
        });
        list.forEach(li => {
            item.pushChange({
                method: 'DELETE',
                due: li.DUE,
                data: li
            });
        });
        this.checkChange();
    }
    private _deleteAllDocGroup(item: NodeAbsoluteRight) {
        item.deleteChange();
        this.curentUser.USER_RIGHT_DOCGROUP_List.forEach(li => {
            item.pushChange({
                method: 'DELETE',
                due: li.DUE,
                data: li
            });
        });
        this._userParamsSetSrv.userRightDocgroupList.splice(0, this._userParamsSetSrv.userRightDocgroupList.length);
        this.checkChange();
    }
    private _deleteAllClassif(node: NodeAbsoluteRight) {
        node.deleteChange();
        this.curentUser.USER_TECH_List.forEach((li: USER_TECH) => {
            node.pushChange({
                method: 'DELETE',
                due: li.DUE,
                funcNum: li.FUNC_NUM,
                data: li
            });
        });
        if (this.techRingtOrig) {
            node.pushChange({
                method: 'MERGE',
                user_cl: true,
                data: {
                    TECH_RIGHTS: ''
                }
            });
        }
        this._userParamsSetSrv.userTechList.splice(0, this._userParamsSetSrv.userTechList.length);
        this.checkChange();
    }

    // private _deleteAllOrgType(node: NodeAbsoluteRight) {
    //     node.deleteChange();
    //     const list = this.curentUser.USER_EDIT_ORG_TYPE_List;
    //     if (list.length) {
    //         list.forEach((item: USER_EDIT_ORG_TYPE) => {
    //             node.pushChange({
    //                 method: 'DELETE',
    //                 isn_org: item.ISN_ORG_TYPE,
    //                 data: item
    //             });
    //         });
    //         //   this._userParamsSetSrv.userEditOrgType.splice(0,  this._userParamsSetSrv.userEditOrgType.length);
    //         this.checkChange();
    //     }
    // }

    private _createBatch(chenge: IChengeItemAbsolute, node: NodeAbsoluteRight, qUserCl) {
        const uId = this._userParamsSetSrv.userContextId;
        let url = '';
        switch (node.contentProp) {
            case E_RIGHT_DELO_ACCESS_CONTENT.department:
            case E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthor:
            case E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject:
                url = `/USERDEP_List${chenge.method === 'POST' ? '' : `('${uId} ${chenge.due} ${chenge.data['FUNC_NUM']}')`}`;
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.docGroup:
                url = `/USER_RIGHT_DOCGROUP_List${chenge.method === 'POST' ? '' : `('${uId} ${chenge.data['FUNC_NUM']} ${chenge.due}')`}`;
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.classif:
                if (chenge.user_cl) {
                    if (qUserCl) {
                        qUserCl['data'] = Object.assign(qUserCl['data'], chenge.data);
                        return false;
                    } else {
                        break;
                    }
                }
                url = `/USER_TECH_List${chenge.method === 'POST' ? '' : `('${uId} ${chenge.data['FUNC_NUM']} ${chenge.due}')`}`;
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz:
                if (chenge.data.hasOwnProperty('DEEP')) {
                    url = `/USERDEP_List${chenge.method === 'POST' ? '' : `('${uId} ${chenge.due} ${chenge.data['FUNC_NUM']}')`}`;
                } else {
                    url = `/USER_ORGANIZ_List${chenge.method === 'POST' ? '' : `('${uId} ${chenge.due} ${chenge.data['FUNC_NUM']}')`}`;
                }
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.organiz:
                url = `/USER_ORGANIZ_List${chenge.method === 'POST' ? '' : `('${uId} ${chenge.due} ${chenge.data['FUNC_NUM']}')`}`;
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.srchGroup:
                url = `/USER_SRCH_GROUP_List${chenge.method === 'POST' ? '' : `('${uId} ${chenge.data?.ISN_GROUP}')`}`;
                break;
        }
        let batch = {};
        if (node.contentProp === 5) {
            batch = this._absRigthServ.batchEditOrgType(chenge, uId);
        }
        else {
            batch = {
                method: chenge.method,
                requestUri: `USER_CL(${uId})${url}`,
            };
            if (chenge.method === 'POST' || chenge.method === 'MERGE') {
                delete chenge.data['CompositePrimaryKey'];
                delete chenge.data['__metadata'];
                batch['data'] = chenge.data;
            }
        }
        return batch;
    }
    // private _batchEditOrgType(chenge: IChengeItemAbsolute, uId) {
    //     const batch = {};
    //     batch['method'] = chenge.method;
    //     if (chenge.method === 'POST') {
    //         batch['requestUri'] = `USER_CL(${uId})/USER_EDIT_ORG_TYPE_List`;
    //         delete chenge.data['CompositePrimaryKey'];
    //         delete chenge.data['__metadata'];
    //         batch['data'] = chenge.data;
    //     }
    //     if (chenge.method === 'DELETE') {
    //         batch['requestUri'] = `USER_CL(${uId})/USER_EDIT_ORG_TYPE_List(\'${uId} ${chenge.isn_org}\')`;
    //     }
    //     return batch;
    // }
    private _checkCreatePRJNotEmptyAllowed(): boolean {
        let allowed = false;
        this.listRight.forEach((node: NodeAbsoluteRight) => {
            if (node.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.docGroup && node.touched && node.value) {
                allowed = true;
                this._userParamsSetSrv.userRightDocgroupList.forEach(item => {
                    if (item['ALLOWED']) {
                        allowed = false;
                    }
                });
            }
        });
        return allowed;
    }
    private _checkKey(node): boolean {
        const impMsgRights = [
            ETypeDeloRight.ReadingRKpersonalizedAccess,
            ETypeDeloRight.ReadingPersonalAccessFiles,
            ETypeDeloRight.ReadingStrictAccessFiles,
            ETypeDeloRight.ReadingEvents,
            ETypeDeloRight.WorkingWithEvents
        ]; /* node.key === '4' || */
        return impMsgRights.indexOf(node.key) !== -1;
    }
    private _checkCreateNotEmpty(): boolean {
        let allowed = false;
        this.listRight.forEach((node: NodeAbsoluteRight) => {
            if (this._checkKey(node) && node.value === 1) {
                let flag = true;
                this.curentUser.USERDEP_List.filter(li => {
                    if (li['FUNC_NUM'] === +node.key + 1) {
                        flag = false;
                    }
                });
                if (flag) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Не заданы подразделения для права ' + node.label
                    });
                }
                if (!allowed) {
                    allowed = flag;
                }
            }
        });
        return allowed;
    }
    private _checkKeyOrgan(node): boolean {
        return node.key === ETypeDeloRight.EnteringResolutions ||
            node.key === ETypeDeloRight.ExecutionOfOrders ||
            node.key === ETypeDeloRight.ApprovalOfProjects ||
            node.key === ETypeDeloRight.ProjectSigning;
    }
    private _checkCreateNotEmptyOrgan(): boolean {
        let allowed = false;
        this.listRight.forEach((node: NodeAbsoluteRight) => {
            if (this._checkKeyOrgan(node) && node.value === 1) {
                let flag = true;
                let flag_org = true;
                this.curentUser.USERDEP_List.filter(li => {
                    if (li['FUNC_NUM'] === +node.key + 1) {
                        flag = false;
                    }
                });
                this.curentUser['USER_ORGANIZ_List'].forEach(li => {
                    if (li['FUNC_NUM'] === +node.key + 1) {
                        flag_org = false;
                    }
                });
                if (flag && flag_org) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Не заданы подразделения для права ' + node.label
                    });
                }
                if (!allowed) {
                    allowed = flag && flag_org;
                }
            }
        });
        return allowed;
    }
    private _pushState() {
        this._userParamsSetSrv.setChangeState({ isChange: !this.btnDisabled });
    }


}
