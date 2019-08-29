import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamsService } from '../../shared/services/user-params.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from '../../../eos-user-params/user-params-set/shared-user-param/consts/eos-user-params.const';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { RemasterService } from '../shared-user-param/services/remaster-service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { FormHelperService } from '../../shared/services/form-helper.services';
@Component({
    selector: 'eos-registration-remaster',
    styleUrls: ['user-param-registration-remaster.component.scss'],
    templateUrl: 'user-param-registration-remaster.component.html',
    providers: [FormHelperService]
})

export class UserParamRegistrationRemasterComponent implements OnInit, OnDestroy {
    @Input() defaultTitle: string;
    @Input() defaultUser: any;
    @Output() DefaultSubmitEmit: EventEmitter<any> = new EventEmitter();
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
    public accessSustem: Array<string>;
    private EmailChangeValue: any;
    private DopOperationChangeValue: any;
    private AddressesChengeValue: any;
    private ScanChengeValue: any;
    private AutoSearchChangeValue: any;
    private SabChangeValue: any;
    private RcChangeValue: any;
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
    ngOnInit() {
        if (this.defaultTitle) {
            this.titleHeader = this.defaultTitle;
            this.defaultValues = this.defaultUser;
            this.hash = this.defaultUser;
            this.accessSustem = `1111111111111111111111111111111111111111`.split('');
            this.isLoading = true;
        } else {
            this._userSrv.saveData$
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                this._userSrv.submitSave = this.submit(null);
            });
            this._userSrv.getUserIsn({
                expand: 'USER_PARMS_List'
            })
            .then(() => {
                this.accessSustem = this._userSrv.curentUser.ACCESS_SYSTEMS;
                this.hash = this._userSrv.hashUserContext;
                this.titleHeader = `${this._userSrv.curentUser.SURNAME_PATRON} - Регистрация`;
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
        const value = $event[0];
        if (this.defaultUser) {
            this.EmailChangeValue = $event[1];
        }
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
    emitChangesSab($event) {
        if (this.defaultUser) {
            this.SabChangeValue = $event[1];
        }
        if ($event) {
            this.SabChangeFlag = $event[0].btn;
            this.newValuesSab = $event[0].data;
        } else {
            this.SabChangeFlag = false;
            this.newValuesSab.clear();
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
        if (this.EmailChangeValue !== undefined) {
            obj = Object.assign(this.EmailChangeValue, obj);
        }
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
        if (this.SabChangeValue !== undefined) {
            obj = Object.assign(this.SabChangeValue, obj);
        }
        if (this.RcChangeValue !== undefined) {
            obj = Object.assign(this.RcChangeValue, obj);
        }
        this.DefaultSubmitEmit.emit(obj);
    }

    edit(event) {
        this.editFlag = event;
        this._RemasterService.editEmit.next(this.editFlag);
    }
    submit(event): Promise<any> {
        if (this.defaultUser) {
            this.defaultUserSubmit();
        }
        return this._apiSrv.batch(this.createObjRequest(), '').then(response => {
            this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            this.defaultSetFlagBtn();
            this.hash = this._userSrv.hashUserContext;
            this.editFlag = false;
            this._RemasterService.submitEmit.next();
            // return this._userSrv.getUserIsn(String(userId)).then(res => {
            // });
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
        if (this.defaultUser) {
            if (this.newValuesMap.size) {
                req.concat(this._formHelper.CreateDefaultRequest(req, this.newValuesMap));
            }
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
            if (this.newValuesSab.size) {
                req.concat(this._formHelper.CreateDefaultRequest(req, this.newValuesSab));
            }
            if (this.newValuesRc.size) {
                req.concat(this._formHelper.CreateDefaultRequest(req, this.newValuesRc));
            }
        } else {
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
