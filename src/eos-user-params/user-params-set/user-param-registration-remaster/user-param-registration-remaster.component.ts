import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserParamsService } from '../../shared/services/user-params.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from '../../../eos-user-params/user-params-set/shared-user-param/consts/eos-user-params.const';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { RemasterService } from '../shared-user-param/services/remaster-service';
import { Subject } from 'rxjs/Subject';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { FormHelperService } from '../../shared/services/form-helper.services';
@Component({
    selector: 'eos-registration-remaster',
    styleUrls: ['user-param-registration-remaster.component.scss'],
    templateUrl: 'user-param-registration-remaster.component.html',
    providers: [FormHelperService]
})

export class UserParamRegistrationRemasterComponent implements OnInit, OnDestroy {
    readonly fieldGroupsForRegistration: string[] = ['Доп. операции', 'Корр./адресаты', 'Эл. почта', 'Сканирование', 'Автопоиск', 'СЭВ', 'РКПД'];
    public currTab = 0;
    public titleHeader;
    public hash: Map<any, string>;
    public defaultValues: any;
    public isLoading: boolean = false;
    public EmailChangeFlag: boolean = false;
    public DopOperationChangeFlag: boolean = false;
    public AddressesChengeFlag: boolean = false;
    public ScanChengeFlag: boolean = false;
    public AutoSearchChangeFlag: boolean = false;
    public SabChangeFlag: boolean = false;
    public RcChangeflag: boolean = false;
    public editFlag: boolean = false;
    private newValuesMap = new Map();
    private newValuesDopOperation: Map<string, any> = new Map();
    private newValuesAddresses: Map<string, any> = new Map();
    private newValuesScan: Map<string, any> = new Map();
    private newValuesAutoSearch: Map<string, any> = new Map();
    private newValuesSab: Map<string, any> = new Map();
    private newValuesRc: Map<string, any> = new Map();
    private _ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _userSrv: UserParamsService,
        private _apiSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _RemasterService: RemasterService,
        private _errorSrv: ErrorHelperServices,
        private _formHelper: FormHelperService,
    ) {}
    async ngOnInit() {
        this._userSrv.saveData$.takeUntil(this._ngUnsubscribe).subscribe(() => {
            this._userSrv.submitSave = this.submit(null);
        });
        await this._userSrv.getUserIsn();
        this.hash = this._userSrv.hashUserContext;
        this.titleHeader = `${this._userSrv.curentUser.SURNAME_PATRON} - Регистрация`;

        this._apiSrv.read(this._formHelper.getObjQueryInputsField()).then(data => {
            this.defaultValues = this._formHelper.createhash(data);
            this.isLoading = true;
        }).catch(error => {
            this._errorSrv.errorHandler(error);
        });
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    get btnDisabled(): boolean {
        if (this.EmailChangeFlag
            || this.DopOperationChangeFlag
            || this.AddressesChengeFlag
            || this.ScanChengeFlag
            || this.AutoSearchChangeFlag
            || this.SabChangeFlag
            || this.RcChangeflag
        ) {
            return true;
        }
        return false;
    }
    setTab(i: number) {
        this.currTab = i;
    }

    getChanges($event) {
        const value = $event;
        if (value) {
            this.EmailChangeFlag = true;
            value.forEach(val => {
                this.newValuesMap.set(val['key'], val.value);
            });
        } else {
            this.EmailChangeFlag = false;
            this.newValuesMap.delete('RCSEND');
            this.newValuesMap.delete('MAILRECIVE');
            this.newValuesMap.delete('RECEIP_EMAIL');
        }
        this._pushState();
    }

    emitChanges($event) {
        if ($event) {
            this.DopOperationChangeFlag = $event.btn;
            this.newValuesDopOperation = $event.data;
        } else {
            this.DopOperationChangeFlag = false;
            this.newValuesDopOperation.clear();
        }
        this._pushState();
    }
    emitChangesAddresses($event) {
        if ($event) {
            this.AddressesChengeFlag = $event.btn;
            this.newValuesAddresses = $event.data;
        } else {
            this.AddressesChengeFlag = false;
            this.newValuesAddresses.clear();
        }
        this._pushState();
    }
    emitChangesScan($event) {
        if ($event) {
            this.ScanChengeFlag = $event.btn;
            this.newValuesScan = $event.data;
        } else {
            this.ScanChengeFlag = false;
            this.newValuesScan.clear();
        }
        this._pushState();
    }
    emitChangesAutoSearch($event) {
        if ($event) {
            this.AutoSearchChangeFlag = $event.btn;
            this.newValuesAutoSearch = $event.data;
        } else {
            this.AutoSearchChangeFlag = false;
            this.newValuesAutoSearch.clear();
        }
        this._pushState();
    }
    emitChangesSab($event) {
        if ($event) {
            this.SabChangeFlag = $event.btn;
            this.newValuesSab = $event.data;
        } else {
            this.SabChangeFlag = false;
            this.newValuesSab.clear();
        }
        this._pushState();
    }
    emitChangesRc($event) {
        if ($event) {
            this.RcChangeflag = $event.btn;
            this.newValuesRc = $event.data;
        } else {
            this.RcChangeflag = false;
            this.newValuesRc.clear();
        }
        this._pushState();
    }

    edit(event) {
        this.editFlag = event;
        this._RemasterService.editEmit.next(this.editFlag);
    }
    submit(event): Promise<any> {
        return this._apiSrv.batch(this.createObjRequest(), '').then(response => {
            this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            this.defaultSetFlagBtn();
            const userId = this._userSrv.userContextId;
            return this._userSrv.getUserIsn(String(userId)).then(res => {
                this.hash = this._userSrv.hashUserContext;
                this.editFlag = false;
                this._RemasterService.submitEmit.next();
            });
        }).catch(error => {
            this._errorSrv.errorHandler(error);
            this.cancel(false);
            this._RemasterService.submitEmit.next();
        });
    }
    defaultSetFlagBtn() {
        this.getChanges(false);
        this.emitChanges(false);
        this.emitChangesAddresses(false);
        this.emitChangesScan(false);
        this.emitChangesAutoSearch(false);
        this.emitChangesSab(false);
        this.emitChangesRc(false);
    }

    createObjRequest(): any[] {
        const req = [];
        const userId = this._userSrv.userContextId;
        if (this.newValuesMap.size) {
            req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesMap, userId));
        }
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
        if (this.newValuesSab.size) {
            req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesSab, userId));
        }
        if (this.newValuesRc.size) {
            req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesRc, userId));
        }
        return req;
    }
    cancel(event) {
        if (this.btnDisabled) {
            this._msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.getChanges(false);
            this.emitChanges(false);
            this.emitChangesAddresses(false);
            this.emitChangesScan(false);
            this.emitChangesAutoSearch(false);
            this.emitChangesSab(false);
            this.emitChangesRc(false);
            this._pushState();
        }
        this.editFlag = event;
        this._RemasterService.cancelEmit.next();
    }
    default(event) {
        this._RemasterService.defaultEmit.next();
    }
    private _pushState() {
        this._userSrv.setChangeState({ isChange: this.btnDisabled });
    }
}
