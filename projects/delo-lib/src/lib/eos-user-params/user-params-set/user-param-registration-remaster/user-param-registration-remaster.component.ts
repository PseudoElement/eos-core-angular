import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { UserParamsService } from '../../shared/services/user-params.service';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from '../../../eos-user-params/user-params-set/shared-user-param/consts/eos-user-params.const';
import { PipRX } from '../../../eos-rest/services/pipRX.service';
import { RemasterService } from '../shared-user-param/services/remaster-service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { FormHelperService } from '../../shared/services/form-helper.services';
import { IUserSettingsModes } from '../../../eos-user-params/shared/intrfaces/user-params.interfaces';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RouterStateSnapshot } from '@angular/router';

declare function notifyOpener();

@Component({
    selector: 'eos-registration-remaster',
    styleUrls: ['user-param-registration-remaster.component.scss'],
    templateUrl: 'user-param-registration-remaster.component.html',
    providers: [FormHelperService]
})

export class UserParamRegistrationRemasterComponent implements OnInit, OnDestroy {
    @Input() defaultTitle: string;
    @Input() defaultUser: any;
    @Input() mainUser?;
    @Input() openingTab: number = 0;
    @Input() appMode: IUserSettingsModes;
    @Input() isCurrentSettings?: boolean;

    @Output() DefaultSubmitEmit: EventEmitter<any> = new EventEmitter();
    public fieldGroupsForRegistration: Map<number, string> = new Map([
        [0, 'Документ (РК)'],
        [1, 'Корр./Адресаты'],
        [2, 'Сканирование и печать штрих-кода'],
        [3, 'Связки и автопоиск'],
        [4, 'Проект документа (РКПД)'],
    ]);
    public currTab = 0;
    public hash: Map<any, string>;
    public defaultValues: any;
    public isLoading: boolean = false;
    public DopOperationChangeFlag: boolean = false;
    public AddressesChengeFlag: boolean = false;
    public ScanChengeFlag: boolean = false;
    public AutoSearchChangeFlag: boolean = false;
    public RcChangeflag: boolean = false;
    public editFlag: boolean = false;
    public accessSustem: Array<string>;
    public currentUser;
    public isSave: boolean;
    public errorS: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject();
    get titleHeader() {
        if (this.currentUser) {
            if (this.currentUser.isTechUser) {
                return this.defaultTitle ? 'Регистрация по умолчанию' : this.currentUser.CLASSIF_NAME + '- Регистрация';
            }
            return this.defaultTitle ? 'Регистрация по умолчанию' : `${this.currentUser['DUE_DEP_SURNAME']} - Регистрация`;
        }
        return '';
    }
    get isDefaultSettingsPage() {
        return !!this.defaultUser;
    }

    private DopOperationChangeValue: any;
    private AddressesChengeValue: any;
    private ScanChengeValue: any;
    private AutoSearchChangeValue: any;
    private RcChangeValue: any;
    private newValuesDopOperation: Map<string, any> = new Map();
    private newValuesAddresses: Map<string, any> = new Map();
    private newValuesScan: Map<string, any> = new Map();
    private newValuesAutoSearch: Map<string, any> = new Map();
    private newValuesRc: Map<string, any> = new Map();

    constructor(
        private _userSrv: UserParamsService,
        private _apiSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _RemasterService: RemasterService,
        private _errorSrv: ErrorHelperServices,
        private _formHelper: FormHelperService,
    ) {
        this._userSrv.canDeactivateSubmit$
        .pipe(
            takeUntil(this.ngUnsubscribe)
            )
        .subscribe((rout: RouterStateSnapshot) => {
            this._userSrv.submitSave = this.submit('');
        });
    }
    ngOnInit() {
        if (this.isCurrentSettings) {
            if (!this.appMode.tkDoc) {
                if (this.appMode.arm) {
                    this.fieldGroupsForRegistration.set(3, 'Связки и переписка');
                }
            } else {
                this.fieldGroupsForRegistration.set(2, 'Сканирование');
            }
            this.editFlag = true;
        }
        if (this.appMode && this.appMode.cbr) {
            // Скрываем вкладки "Сканирование и печать штрих-кода" и "Связки и автопоиск" для mode=ARMCBR
            this.fieldGroupsForRegistration.delete(2);
            this.fieldGroupsForRegistration.delete(3);
        }
        if (
            this.openingTab &&
            this.fieldGroupsForRegistration.has(this.openingTab - 1)
        ) {
            this.currTab = Number(this.openingTab) - 1;
        }
        if (this.defaultTitle) {
            this.currentUser = this.defaultTitle;
            this.defaultValues = this.defaultUser;
            this.hash = this.defaultUser;
            this.accessSustem = `1111111111111111111111111111111111111111`.split('');
            this.isLoading = true;
        } else {
            const config = {expand: 'USER_PARMS_List'};
            if (this.mainUser) {
                config['isn_cl'] = this.mainUser;
            }
            this._userSrv.getUserIsn(config)
            .then(() => {
                this.accessSustem = this._userSrv.curentUser.ACCESS_SYSTEMS;
                this.hash = this._userSrv.hashUserContext;
                this.currentUser = this._userSrv.curentUser;
                this._apiSrv.read(this._formHelper.getObjQueryInputsField()).then(data => {
                    this.defaultValues = this._formHelper.createhash(data);
                    this.isLoading = true;
                }).catch(error => {
                    this._errorSrv.errorHandler(error);
                });
            })
            .catch(err => {
            });
        }
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    get btnDisabled(): boolean {
        if ( this.DopOperationChangeFlag
            || this.AddressesChengeFlag
            || this.ScanChengeFlag
            || this.AutoSearchChangeFlag
            || this.RcChangeflag
        ) {
            return true;
        }
        return false;
    }

    isRegTabAndDefaultSettings(key: number) {
        return key === 2 && this.isDefaultSettingsPage;
    }

    setTab(i: number) {
        // отмена выбора вкладки "Сканирование и печать штрих-кода" в настройках по умолчанию
        if (this.isRegTabAndDefaultSettings(i)) {
             return;
        }
        // проверка валидности ориентации печати штрихкода
        if (!this.checkSelectBarcode()) {
            this.currTab = i;
        }
    }

    emitChanges($event) {
        if (this.defaultUser) {
            this.DopOperationChangeValue = $event[1];
        }
        if ($event) {
            this.DopOperationChangeFlag = $event[0].btn;
            this.newValuesDopOperation = $event[0].data;
        } else {
            this.DopOperationChangeFlag = false;
            this.newValuesDopOperation.clear();
        }
        this._pushState();
    }
    emitChangesAddresses($event) {
        if (this.defaultUser) {
            this.AddressesChengeValue = $event[1];
        }
        if ($event) {
            this.AddressesChengeFlag = $event[0].btn;
            this.newValuesAddresses = $event[0].data;
        } else {
            this.AddressesChengeFlag = false;
            this.newValuesAddresses.clear();
        }
        this._pushState();
    }
    emitChangesScan($event) {
        if (this.defaultUser) {
            this.ScanChengeValue = $event[1];
        }
        if ($event) {
            this.ScanChengeFlag = $event[0].btn;
            this.newValuesScan = $event[0].data;
        } else {
            this.ScanChengeFlag = false;
            this.newValuesScan.clear();
        }
        this._pushState();
    }
    emitChangesAutoSearch($event) {
        if (this.defaultUser) {
            this.AutoSearchChangeValue = $event[1];
        }
        if ($event) {
            this.AutoSearchChangeFlag = $event[0].btn;
            this.newValuesAutoSearch = $event[0].data;
        } else {
            this.AutoSearchChangeFlag = false;
            this.newValuesAutoSearch.clear();
        }
        this._pushState();
    }
    emitChangesRc($event) {
        if (this.defaultUser) {
            this.RcChangeValue = $event[1];
        }
        if ($event) {
            this.RcChangeflag = $event[0].btn;
            this.newValuesRc = $event[0].data;
        } else {
            this.RcChangeflag = false;
            this.newValuesRc.clear();
        }
        this._pushState();
    }

    defaultUserSubmit() {
        let obj = {};
        if (this.DopOperationChangeValue !== undefined) {
            obj = Object.assign(this.DopOperationChangeValue, obj);
        }
        if (this.AddressesChengeValue !== undefined) {
            obj = Object.assign(this.AddressesChengeValue, obj);
        }
        if (this.ScanChengeValue !== undefined) {
            obj = Object.assign(this.ScanChengeValue, obj);
        }
        if (this.AutoSearchChangeValue !== undefined) {
            obj = Object.assign(this.AutoSearchChangeValue, obj);
        }
        if (this.RcChangeValue !== undefined) {
            obj = Object.assign(this.RcChangeValue, obj);
        }
        this.DefaultSubmitEmit.emit(obj);
    }
    errorSave($event) {
        this.errorS = $event;
    }
    edit(event) {
        this.editFlag = event;
        this._RemasterService.editEmit.next(this.editFlag);
    }
    submit(event): Promise<any> {
        if (this.errorS) {
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Изменения не сохранены',
                msg: 'Значение поля, \"Количество копий\" должно быть целым положительным числом',
                dismissOnTimeout: 5000
            });
            return Promise.resolve(null);
        }
        if (this.newValuesScan.size && this.checkSelectBarcode()) {
            return Promise.resolve(null);
        }
        this.isSave = true;
        if (this.defaultUser) {
            this.defaultUserSubmit();
        }
        return this._apiSrv.batch(this.createObjRequest(), '').then(response => {
            this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            this.defaultSetFlagBtn();
            this.hash = this._userSrv.hashUserContext;
            if (!this.isCurrentSettings) {
                this.editFlag = false;
            }
            this._RemasterService.submitEmit.next();
            // this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
            this.isSave = false;
            notifyOpener();
            // return this._userSrv.getUserIsn(String(userId)).then(res => {
            // });
        }).catch(error => {
            this._errorSrv.errorHandler(error);
            this.cancel(false);
            this._RemasterService.submitEmit.next();
            this.isSave = false;
        });
    }
    checkSelectBarcode() {
        let error = false;
        if (this.newValuesScan.has('SHABLONBARCODE') || this.newValuesScan.has('SHABLONBARCODEL')) {
            const bookSizeValue = this.newValuesScan.has('SHABLONBARCODE') ? this.newValuesScan.get('SHABLONBARCODE') : this.hash['SHABLONBARCODE'] ;
            const albumSizeValue = this.newValuesScan.has('SHABLONBARCODEL') ? this.newValuesScan.get('SHABLONBARCODEL') : this.hash['SHABLONBARCODEL'];
            if (bookSizeValue === 'barcode5.dot' && albumSizeValue !== 'barcodeL5.dot' || albumSizeValue === 'barcodeL5.dot' && bookSizeValue !== 'barcode5.dot') {
                alert('Штрих-код на наклейке рекомендуется использовать и для книжной, и для альбомной ориентации.');
                error = true;
            }
        }
        return error;
    }

    defaultSetFlagBtn() {
        this.emitChanges(false);
        this.emitChangesAddresses(false);
        this.emitChangesScan(false);
        this.emitChangesAutoSearch(false);
        this.emitChangesRc(false);
    }

    createObjRequest(): any[] {
        const req = [];
        if (this.defaultUser) {
            if (this.newValuesDopOperation.size) {
                req.concat(this._formHelper.CreateDefaultRequest(req, this.newValuesDopOperation));
            }
            if (this.newValuesAddresses.size) {
                req.concat(this._formHelper.CreateDefaultRequest(req, this.newValuesAddresses));
            }
            if (this.newValuesScan.size) {
                req.concat(this._formHelper.CreateDefaultRequest(req, this.newValuesScan));
            }
            if (this.newValuesAutoSearch.size) {
                req.concat(this._formHelper.CreateDefaultRequest(req, this.newValuesAutoSearch));
            }
            if (this.newValuesRc.size) {
                req.concat(this._formHelper.CreateDefaultRequest(req, this.newValuesRc));
            }
        } else {
            const userId = this._userSrv.userContextId;
            if (this.newValuesDopOperation.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesDopOperation, userId));
            }
            if (this.newValuesAddresses.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesAddresses, userId));
            }
            if (this.newValuesScan.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesScan, userId));
            }
            if (this.newValuesAutoSearch.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesAutoSearch, userId));
            }
            if (this.newValuesRc.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesRc, userId));
            }
        }
        return req;
    }
    cancel(event) {
        if (this.btnDisabled) {
            this._msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.emitChanges(false);
            this.emitChangesAddresses(false);
            this.emitChangesScan(false);
            this.emitChangesAutoSearch(false);
            this.emitChangesRc(false);
            this._pushState();
        }
        this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
        this.editFlag = event;
        this._RemasterService.cancelEmit.next();
    }
    default(event) {
        this._RemasterService.defaultEmit.next(this.currTab);
    }
    private _pushState() {
        this._userSrv.setChangeState({ isChange: this.btnDisabled });
    }
}
