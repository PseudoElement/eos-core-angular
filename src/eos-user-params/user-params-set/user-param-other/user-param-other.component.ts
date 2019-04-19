import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
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
    constructor(
        private _userSrv: UserParamsService,
        private _pipRx: PipRX,
        private remaster: RemasterService,
        private _msgSrv: EosMessageService,
        private _formHelper: FormHelperService,
        private _errorSrv: ErrorHelperServices,

    ) {}
    async ngOnInit() {
        this._userSrv.saveData$.takeUntil(this._ngUnsubscribe).subscribe(() => {
            this._userSrv.submitSave = this.submit(null);
        });

        await this._userSrv.getUserIsn();
        this.titleHeader = `${this._userSrv.curentUser.SURNAME_PATRON} - Прочее`;

        const prep = this._formHelper.getObjQueryInputsField();
        this._pipRx.read(prep).then((data) => {
            this.defaultValues = this._formHelper.createhash(data);
            this.remaster.emitDefaultFalues.next(this.defaultValues);
        });
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
            this.flagTransfer = $event.btn;
            this.newValuesTransfer = $event.data;
        } else {
            this.flagTransfer = false;
            this.newValuesTransfer.clear();
        }
        this._pushState();
    }
    emitChangesAddresses($event) {
        if ($event) {
            this.flagReestr = $event.btn;
            this.newValuesReestr = $event.data;
        } else {
            this.flagReestr = false;
            this.newValuesReestr.clear();
        }
        this._pushState();
    }
    emitChangesReestr($event) {
        if ($event) {
            this.flagAddresses = $event.btn;
            this.newValuesAddresses = $event.data;
        } else {
            this.flagAddresses = false;
            this.newValuesAddresses.clear();
        }
        this._pushState();
    }
    emitChangesShablony($event) {
        if ($event) {
            this.flagShablony = $event.btn;
            this.newValuesShablony = $event.data;
        } else {
            this.flagShablony = false;
            this.newValuesShablony.clear();
        }
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
    resetFlagsBtn() {
        this.emitChangesAddresses(false);
        this.emitChangesReestr(false);
        this.emitChangesShablony(false);
        this.emitChangesTransfer(false);
        // this.emitIncrementError(false);
    }
    createObjRequest(): any[] {
        const req = [];
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
