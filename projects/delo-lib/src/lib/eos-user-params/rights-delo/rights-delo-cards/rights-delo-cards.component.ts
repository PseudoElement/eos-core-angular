import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamsService } from '../../../eos-user-params/shared/services/user-params.service';
import { IParamUserCl } from '../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { CardUpdate, CARD_FUNC_LIST, E_CARD_TYPE } from './card-func-list.consts';
import { FuncNum } from './funcnum.model';
import { CardRightSrv } from './card-right.service';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { USERCARD } from '../../../eos-rest';
import { AppContext } from '../../../eos-rest/services/appContext.service';
import { E_CARD_RIGHT } from '../../../eos-rest/interfaces/rightName';

@Component({
    selector: 'eos-rights-delo-cards',
    templateUrl: 'rights-delo-cards.component.html',
})
export class RightsDeloCardsComponent implements OnInit, OnDestroy {
    public isLoading: boolean;
    public btnDisabled: boolean = true;
    public pageState: 'LOADING' | 'EMPTY' | 'VIEW' = 'LOADING';
    public editableUser: IParamUserCl;
    public funcList: FuncNum[];
    public funcListDepartment = [];
    public maxDepartmentInFuncNumber = 0;
    public confirmAns = false;
    public editMode: boolean = false;
    public selectedList: FuncNum;
    private _selectedFuncNum: FuncNum;
    private _ngUnsubscribe: Subject<any> = new Subject();
    private _flagGrifs: boolean;
    get titleHeader() {
        if (this.editableUser) {
            if (this.editableUser.isTechUser) {
                return this.editableUser.CLASSIF_NAME + '- Права в картотеках';
            }
            return `${this.editableUser['DUE_DEP_SURNAME']} - Права в картотеках`;
        }
        return '';
    }
    constructor(
        private _userParamsSetSrv: UserParamsService,
        private _router: Router,
        private _cardSrv: CardRightSrv,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices,
        private _appContext: AppContext
    ) {
        this._cardSrv.chengeState$.pipe(takeUntil(this._ngUnsubscribe)).subscribe((state: boolean) => {
            this.btnDisabled = !state;
        });
        this._cardSrv.updateFlag$.pipe(takeUntil(this._ngUnsubscribe)).subscribe(() => {
            this.updateCheckbox();
        });
        this._cardSrv.clearDocGroup();
    }
    ngOnInit() {
        this._userParamsSetSrv
            .getUserIsn({
                expand: 'USER_PARMS_List,USERCARD_List/USER_CARD_DOCGROUP_List,USERCARD_List/USER_CABINET_List',
            })
            .then(() => {
                return this._userParamsSetSrv.checkGrifs(this._userParamsSetSrv.userContextId);
            })
            .then((flagG) => {
                this._flagGrifs = flagG;
                this._cardSrv.prepareforEdit();
                this.editableUser = this._userParamsSetSrv.curentUser;
                if (!this.editableUser.USERCARD_List || !this.editableUser.USERCARD_List.length) {
                    this.pageState = 'EMPTY';
                    return;
                }
                if (this._appContext.cbBase) {
                    let flag = true;
                    CARD_FUNC_LIST.forEach((elem) => {
                        if (elem.label === 'Децентрализованная отправка документов') {
                            elem.label = 'Отправка документов в Департаментах';
                        }
                        if (elem.label === 'Отправка по СДС') {
                            flag = false;
                        }
                    });
                    if (flag) {
                        CARD_FUNC_LIST.push({
                            funcNum: E_CARD_RIGHT.SEND_FOR_SDS, //// 22 - Отправка по СДС
                            label: 'Отправка по СДС',
                            type: E_CARD_TYPE.none,
                        });
                    }
                }
                let flagMedo = true;
                CARD_FUNC_LIST.forEach((elem) => {
                    if (elem.funcNum === E_CARD_RIGHT.SEND_FOR_MEDO) {
                        flagMedo = false;
                    }
                });
                if (flagMedo) {
                    /** Добавлять после Отправка по СДС, но похоже не продумали что это Отправка по СДС есть только в ЦБ */
                    CARD_FUNC_LIST.push({
                        funcNum: E_CARD_RIGHT.SEND_FOR_MEDO, //// 23 - Отправка по МЭДО
                        label: 'Отправка по МЭДО',
                        type: E_CARD_TYPE.none,
                    });
                }
                this.updateCheckbox();
                this.funcList = CARD_FUNC_LIST.map((node) => new FuncNum(node));
                this.pageState = 'VIEW';
                this.selectFuncNum(this.funcList[0]);
            })
            .catch((error: boolean) => {})
            .catch((error) => {
                this._errorSrv.errorHandler(error);
            });
        this._userParamsSetSrv.canDeactivateSubmit$
            .pipe(takeUntil(this._ngUnsubscribe))
            .subscribe((rout: RouterStateSnapshot) => {
                this._userParamsSetSrv.submitSave = this.submit(true);
            });
    }
    updateCheckbox() {
        let maxIndex = 0;
        CARD_FUNC_LIST.forEach((item) => {
            if (maxIndex < item.funcNum) {
                maxIndex = item.funcNum;
            }
        });
        this.funcListDepartment = [];
        this.maxDepartmentInFuncNumber = this.editableUser['USERCARD_List'].length;
        this.editableUser['USERCARD_List'].forEach((dep) => {
            if (dep['FUNCLIST'].length < maxIndex) {
                dep['FUNCLIST'] = dep['FUNCLIST'] + '0'.repeat(maxIndex - dep['FUNCLIST'].length);
            }
            this.funcListDepartment.push(dep['FUNCLIST']);
        });
    }
    getflagChecked(funkNum: number) {
        const howCheckbox = this.getFlagInDepartment(funkNum);
        if (this.editMode) {
            if (howCheckbox === 1) {
                return 'eos-adm-icon-checkbox-square-v-blue';
            } else if (howCheckbox === 0) {
                return 'eos-adm-icon-checkbox-square-minus-blue';
            } else {
                return 'eos-adm-icon-checkbox-square-blue';
            }
        } else {
            if (howCheckbox === 1) {
                return 'eos-adm-icon-checkbox-black';
            } else if (howCheckbox === 0) {
                return 'eos-adm-icon-minus-black';
            } else {
                return 'eos-adm-icon-checkbox-square-grey';
            }
        }
    }
    /*
     * принимает номер функции funkNum, возвращает число 0 - есть чекбоксы но не все, -1 нет ни одного чекбокса
     * 1 стоят все чекбоксы
     */
    getFlagInDepartment(funkNum: number): number {
        let count = 0;
        this.funcListDepartment.forEach((dep) => {
            if (dep[funkNum - 1] && dep[funkNum - 1] !== '0') {
                // #152870 элементов может быть на 3 меньше вот и повялялись флаги которых нет
                count += 1;
            }
        });
        if (count > 0) {
            if (count === this.maxDepartmentInFuncNumber) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    }
    checkAllElem(funkNum: number): boolean {
        return this.getFlagInDepartment(funkNum) === 1 ? false : true;
    }
    afterSubmit() {
        this._userParamsSetSrv
            .getUserIsn({
                expand: 'USER_PARMS_List,USERCARD_List/USER_CARD_DOCGROUP_List,USERCARD_List/USER_CABINET_List',
            })
            .then(() => {
                this._cardSrv.prepareforEdit();
                this.editableUser = this._userParamsSetSrv.curentUser;
                this.updateCheckbox();
                this._userParamsSetSrv.curentUser.USERCARD_List.forEach((card: USERCARD) => {
                    card._orig.FUNCLIST = card.FUNCLIST;
                });
                this._userParamsSetSrv.checkGrifs(this._userParamsSetSrv.userContextId);
                this.selectFuncNum(this.selectedList || this.funcList[0]);
            })
            .catch((error) => {
                this._errorSrv.errorHandler(error);
            });
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    submit(flag?) {
        if (this._cardSrv.provPrevSubmit()) {
            this.pageState = 'LOADING';
            return this._cardSrv
                .saveChenge$()
                .then(() => {
                    this._userParamsSetSrv.ProtocolService(this._userParamsSetSrv.userContextId, 5);
                    this.pageState = 'VIEW';
                    this.btnDisabled = true;
                    if (!flag) {
                        this.afterSubmit();
                    }
                    //  this.ngOnInit();
                    this._clearView();
                })
                .catch((error) => {
                    this._errorSrv.errorHandler(error);
                    this._clearView();
                    this.ngOnInit();
                });
        }
    }

    cancel() {
        this._clearView();
        this._cardSrv.cancelChanges();
        this.selectFuncNum(this.selectedList || this.funcList[0]);
        this.updateCheckbox();
    }
    edit() {
        if (!this._flagGrifs) {
            this._router.navigate(['user-params-set/', 'access-limitation'], {
                queryParams: { isn_cl: this._userParamsSetSrv.userContextId },
            });
            this._msgSrv.addNewMessage({
                // TODO Перенести обьект сообщения в константы.
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Не заданы грифы доступа',
            });
            return;
        }

        this.editMode = true;
        this.selectFuncNum(this.selectedList || this.funcList[0]);
    }
    selectFuncNum(node: FuncNum, flag?: boolean) {
        /* if (!this.editMode) {
            return;
        } */
        if (flag !== undefined && this._selectedFuncNum === node && this.editMode) {
            const date: CardUpdate = {};
            date.flag = flag;
            date.update = false;
            this._cardSrv.selectFuncnum(date);
        }
        this.selectedList = node;
        if (this._selectedFuncNum === node) {
            return;
        }
        if (this._selectedFuncNum) {
            this._selectedFuncNum.isSelected = false;
        }
        this._selectedFuncNum = node;
        this._selectedFuncNum.isSelected = true;
        this._cardSrv.selectedFuncNum = node;
        if (flag !== undefined && this.editMode) {
            const date: CardUpdate = {};
            date.flag = flag;
            date.update = true;
            this._cardSrv.selectFuncnum(date);
        } else {
            this._cardSrv.selectFuncnum();
        }
    }
    private _clearView(): void {
        this._userParamsSetSrv.setChangeState({ isChange: false });
        this.editMode = false;
        // this._selectedFuncNum.isSelected = false;
        this._selectedFuncNum = null;
        // this._cardSrv.selectedFuncNum = null;
        this.btnDisabled = true;
        this._cardSrv.clearCopy();
    }
}
