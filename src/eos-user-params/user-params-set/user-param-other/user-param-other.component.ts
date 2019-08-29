import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamsService } from '../../shared/services/user-params.service';
import { PipRX } from 'eos-rest';
import { RemasterService } from '../shared-user-param/services/remaster-service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { PARM_SUCCESS_SAVE } from '../../../eos-user-params/user-params-set/shared-user-param/consts/eos-user-params.const';
import { FormHelperService } from '../../shared/services/form-helper.services';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
@Component({
    selector: 'eos-user-param-other',
    templateUrl: 'user-param-other.component.html',
    providers: [RemasterService, FormHelperService]
})

export class UserParamOtherForwardingComponent implements OnDestroy, OnInit {
    @Input() defaultTitle: string;
    @Input() defaultUser: any;
    @Output() DefaultSubmitEmit: EventEmitter<any> = new EventEmitter();
    public userId: string;
    public disableSave: boolean;
    public isChanged: boolean;
    public prepInputsAttach;
    public currTab = 0;
    public defaultValues: any;
    public editFlag: boolean = false;
    public flagIncrementError: boolean = true;
    public titleHeader;
    readonly fieldGroups: string[] = ['Пересылка РК', 'Адресаты документа', 'Реестр передачи документов', 'Шаблоны'];
    readonly fieldTemplates: string[] = ['Имя шаблона', 'Значение по умолчанию', 'Текущее значение'];
    private _ngUnsubscribe: Subject<any> = new Subject();
    private newValuesTransfer: Map<string, any> = new Map();
    private flagTransfer: boolean = false;
    private newValuesAddresses: Map<string, any> = new Map();
    private flagAddresses: boolean = false;
    private newValuesReestr: Map<string, any> = new Map();
    private flagReestr: boolean = false;
    private newValuesShablony: Map<string, any> = new Map();
    private flagShablony: boolean = false;
    private TransferInputs: any;
    private AddressesInputs: any;
    private ReestInputsr: any;
    private ShablonyInputs: any;
    constructor(
        private _userSrv: UserParamsService,
        private _pipRx: PipRX,
        private remaster: RemasterService,
        private _msgSrv: EosMessageService,
        private _formHelper: FormHelperService,
        private _errorSrv: ErrorHelperServices,

    ) {}
    ngOnInit() {
        if (this.defaultUser) {
            this.titleHeader = this.defaultTitle;
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
                    this.titleHeader = `${this._userSrv.curentUser.SURNAME_PATRON} - Прочее`;
                    const prep = this._formHelper.getObjQueryInputsField();
                    this._pipRx.read(prep).then((data) => {
                        this.defaultValues = this._formHelper.createhash(data);
                        this.remaster.emitDefaultFalues.next(this.defaultValues);
                    });
                })
                .catch(err => {
                });
        }
    }

    get btnDisabled() {
        if (this.flagAddresses || this.flagReestr || this.flagShablony || this.flagTransfer) {
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
    emitChangesAddresses($event) {
        if (this.defaultUser) {
            this.AddressesInputs = $event[1];
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
    emitChangesReestr($event) {
        if (this.defaultUser) {
            this.ReestInputsr = $event[1];
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
    emitChangesShablony($event) {
        if (this.defaultUser) {
            this.ShablonyInputs = $event[1];
        }
        if ($event) {
            this.flagShablony = $event[0].btn;
            this.newValuesShablony = $event[0].data;
        } else {
            this.flagShablony = false;
            this.newValuesShablony.clear();
        }
        //   this.DefaultSubmitEmit.emit()
        this._pushState();
    }
    emitIncrementError($event) {
        this.flagIncrementError = $event;
    }

    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
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
            this.resetFlagsBtn();
            this.editFlag = false;
            this.remaster.submitEmit.next();
            this._pushState();
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
        if (this.ShablonyInputs !== undefined) {
            obj = Object.assign(this.ShablonyInputs, obj);
        }
        this.DefaultSubmitEmit.emit(obj);
    }

    resetFlagsBtn() {
        this.emitChangesAddresses(false);
        this.emitChangesReestr(false);
        this.emitChangesShablony(false);
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
            if (this.newValuesShablony.size) {
                this._formHelper.CreateDefaultRequest(req, this.newValuesShablony, true);
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
            if (this.newValuesShablony.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesShablony, userId, true));
            }
        }
        return req;
    }

    cancel($event) {
        this.resetFlagsBtn();
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
