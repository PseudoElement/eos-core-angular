import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserParamsService } from '../../shared/services/user-params.service';
import { PipRX } from 'eos-rest';
import { RemasterService } from '../shared-user-param/services/remaster-service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { PARM_SUCCESS_SAVE } from '../../../eos-user-params/user-params-set/shared-user-param/consts/eos-user-params.const';
import { FormHelperService } from '../../shared/services/form-helper.services';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { AppContext } from 'eos-rest/services/appContext.service';
import { IUserSettingsModes } from 'eos-user-params/shared/intrfaces/user-params.interfaces';
@Component({
    selector: 'eos-user-param-other',
    templateUrl: 'user-param-other.component.html',
    providers: [RemasterService, FormHelperService]
})

export class UserParamOtherForwardingComponent implements OnDestroy, OnInit {
    @Input() defaultTitle: string;
    @Input() defaultUser: any;
    @Input() mainUser?;
    @Input() openingTab: number = 0;
    @Input() appMode: IUserSettingsModes;
    @Input() isCurrentSettings?: boolean;

    @Output() DefaultSubmitEmit: EventEmitter<any> = new EventEmitter();
    public userId: string;
    public disableSave: boolean;
    public isChanged: boolean;
    public prepInputsAttach;
    public currTab = 0;
    public defaultValues: any;
    public editFlag: boolean = false;
    public flagIncrementError: boolean = true;
    public currentUser;
    public cbBase: boolean = false;
    public fieldGroups: Map<number, string> = new Map([
        [0, 'Пересылка документа'],
        [1, 'Адресаты документа'],
        [2, 'Реестр передачи документов'],
    ]);
    get titleHeader() {
        if (this.currentUser) {
            if (this.currentUser.isTechUser) {
                return this.defaultTitle ? 'Передача по умолчанию' : this.currentUser.CLASSIF_NAME + '- Передача';
            }
            return this.defaultTitle ? 'Передача по умолчанию' : `${this.currentUser['DUE_DEP_SURNAME']} - Передача`;
        }
        return '';
    }
    readonly fieldTemplates: string[] = ['Имя шаблона', 'Значение по умолчанию', 'Текущее значение'];
    private newValuesTransfer: Map<string, any> = new Map();
    private flagTransfer: boolean = false;
    private newValuesAddresses: Map<string, any> = new Map();
    private flagAddresses: boolean = false;
    private newValuesReestr: Map<string, any> = new Map();
    private flagReestr: boolean = false;
    private TransferInputs: any;
    private AddressesInputs: any;
    private ReestInputsr: any;
    constructor(
        private _userSrv: UserParamsService,
        private _pipRx: PipRX,
        private remaster: RemasterService,
        private _msgSrv: EosMessageService,
        private _formHelper: FormHelperService,
        private _errorSrv: ErrorHelperServices,
        private _appContext: AppContext,
    ) {}
    ngOnInit() {
        this.editFlag = !!this.isCurrentSettings;
        if (this.isCurrentSettings) {
            this.fieldGroups.delete(2);
        }
        if (this.appMode && this.appMode.cbr) {
            // Скрываем вкладку "Пересылка документа" если mode=ARMCBR
            this.fieldGroups.delete(0);
        }
        if (this.openingTab && this.fieldGroups.has(this.openingTab - 1)) {
            this.currTab = Number(this.openingTab) - 1;
        }
        if (this._appContext.cbBase) {
            this.cbBase = true;
        }
        if (this.defaultUser) {
            this.currentUser = this.defaultTitle;
        } else {
            const config = {expand: 'USER_PARMS_List'};
            if (this.mainUser) {
                config['isn_cl'] = this.mainUser;
            }
            this._userSrv.getUserIsn(config)
                .then(() => {
                    this.currentUser = this._userSrv.curentUser;
                    const prep = this._formHelper.getObjQueryInputsField();
                    this._pipRx.read(prep).then((data) => {
                        this.defaultValues = this._formHelper.createhash(data);
                        this.remaster.emitDefaultFalues.next(this.defaultValues);
                    });
                })
                .catch(err => {
                    this._errorSrv.errorHandler(err);
                });
        }
    }

    get btnDisabled() {
        if (this.flagAddresses || this.flagReestr || this.flagTransfer) {
            return false;
        } else {
            return true;
        }
    }

    setTab(i: number) {
        this.currTab = i;
    }
    emitChangesTransfer($event) {
        if ($event) {
            if (this.defaultUser) {
                this.TransferInputs = $event[1];
            }
            this.flagTransfer = $event[0].btn;
            this.newValuesTransfer = $event[0].data;
        } else {
            this.flagTransfer = false;
            this.newValuesTransfer.clear();
        }
        this._pushState();
    }
    emitChangesReestr($event) {
        if (this.defaultUser) {
            this.ReestInputsr = $event[1];
        }
        if ($event) {
            this.flagReestr = $event[0].btn;
            this.newValuesReestr = $event[0].data;
        } else {
            this.flagReestr = false;
            this.newValuesReestr.clear();
        }
        this._pushState();
    }
    emitChangesAddresses($event) {
        if (this.defaultUser) {
            this.AddressesInputs = $event[1];
        }
        if ($event) {
            this.flagAddresses = $event[0].btn;
            this.newValuesAddresses = $event[0].data;
        } else {
            this.flagAddresses = false;
            this.newValuesAddresses.clear();
        }
        this._pushState();
    }

    emitIncrementError($event) {
        this.flagIncrementError = $event;
    }

    ngOnDestroy() {}

    edit($event?) {
        this.editFlag = $event;
        this.remaster.editEmit.next();
    }
    submit($event) {
        return this._pipRx.batch(this.createObjRequest(), '').then(response => {
            if (this.defaultTitle) {
                this.defaultUserSubmit();
            }
            this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            if (!this.isCurrentSettings) {
                this.editFlag = false;
                this.remaster.submitEmit.next();
            }
            this.resetFlagsBtn();
            this._pushState();
            this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
            // this._userSrv.getUserIsn().then(() => {
            // });
        }).catch(error => {
            this._errorSrv.errorHandler(error);
            this.cancel(false);
            this.remaster.submitEmit.next();
        });
    }

    defaultUserSubmit() {
        let obj = {};
        if (this.TransferInputs !== undefined) {
            obj = Object.assign(this.TransferInputs, obj);
        }
        if (this.AddressesInputs !== undefined) {
            obj = Object.assign(this.AddressesInputs, obj);
        }
        if (this.ReestInputsr !== undefined) {
            obj = Object.assign(this.ReestInputsr, obj);
        }
        this.DefaultSubmitEmit.emit(obj);
    }

    resetFlagsBtn() {
        this.emitChangesAddresses(false);
        this.emitChangesReestr(false);
        this.emitChangesTransfer(false);
        // this.emitIncrementError(false);
    }
    createObjRequest(): any[] {
        const req = [];
        if (this.defaultTitle) {
            if (this.newValuesTransfer.size) {
                this._formHelper.CreateDefaultRequest(req, this.newValuesTransfer);
            }
            if (this.newValuesAddresses.size) {
                this._formHelper.CreateDefaultRequest(req, this.newValuesAddresses);
            }
            if (this.newValuesReestr.size) {
                this._formHelper.CreateDefaultRequest(req, this.newValuesReestr);
            }
        } else {
            const userId = this._userSrv.userContextId;
            if (this.newValuesTransfer.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesTransfer, userId));
            }
            if (this.newValuesAddresses.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesAddresses, userId));
            }
            if (this.newValuesReestr.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesReestr, userId));
            }
        }
        return req;
    }

    cancel($event) {
        this.resetFlagsBtn();
        this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
        this.editFlag = $event;
        this.remaster.cancelEmit.next();
    }
    default($event?) {
        this.remaster.defaultEmit.next();
    }
    private _pushState() {
        this._userSrv.setChangeState({ isChange: !this.btnDisabled, disableSave: !this.flagIncrementError });
    }
}
