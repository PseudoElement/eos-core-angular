import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { UserParamsService } from '../../shared/services/user-params.service';
import { PipRX } from 'eos-rest';
import { RemasterService } from '../shared-user-param/services/remaster-service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { PARM_SUCCESS_SAVE } from '../../../eos-user-params/user-params-set/shared-user-param/consts/eos-user-params.const';
@Component({
    selector: 'eos-user-param-other',
    templateUrl: 'user-param-other.component.html',
    providers: [RemasterService]
})

export class UserParamOtherForwardingComponent implements OnDestroy, OnInit {
    public userId: string;
    public disableSave: boolean;
    public isChanged: boolean;
    public prepInputsAttach;
    public currTab = 0;
    public defaultValues: any;
    public editFlag: boolean = false;
    readonly fieldGroups: string[] = ['Пересылка РК', 'Адресаты документа', 'Реестр передачи документов', 'Шаблоны'];
    readonly fieldTemplates: string[] = ['Имя шаблона', 'Значение по умолчанию', 'Текущее значение'];
    private _ngUnsubscribe: Subject<any> = new Subject();
    private newValuesTransfer: Map<string, any> = new Map();
    private flagTransfer: boolean;
    constructor(
        private _userSrv: UserParamsService,
        private _pipRx: PipRX,
        private remaster: RemasterService,
        private _msgSrv: EosMessageService,

    ) {
    }
    get btnDisabled() {
        return false;
    }
    ngOnInit() {
        const prep = this.getObjQueryInputsField();
        Promise.all([this._userSrv.getUserIsn(), this._pipRx.read(prep)]).then(([bool, data]) => {
            this.create_hash_default(data);
        });
    }
    create_hash_default(data) {
        const hashDefault = {};
        data.forEach(item => {
            hashDefault[item['PARM_NAME']] = item.PARM_VALUE;
        });
        this.defaultValues = hashDefault;
    }
    getObjQueryInputsField() {
        return {
            USER_PARMS: {
                criteries: {
                    ISN_USER_OWNER: '-99'
                }
            }
        };
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
        console.log(this.newValuesTransfer);
        this._pushState();
    }

    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    edit($event?) {
        this.remaster.editEmit.next();

    }
    submit() {
        return this._pipRx.batch(this.createObjRequest(), '').then(response => {
            this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            this.remaster.submitEmit.next();
            this._pushState();
        });
    }
    createObjRequest(): any[] {
        const req = [];
        const userId = this._userSrv.userContextId;
        if (this.newValuesTransfer.size) {
            req.concat(this.pushIntoArrayRequest(req, this.newValuesTransfer, userId));
        }
        return req;
    }
    pushIntoArrayRequest(storeReq: Array<any>, data: Map<string, any>, id): Array<any> {
        Array.from(data).forEach(val => {
            let parn_Val;
            if (typeof val[1] === 'boolean') {
                val[1] === false ? parn_Val = 'NO' : parn_Val = 'YES';
            } else {
                String(val[1]) === 'null' ? parn_Val = '' : parn_Val = val[1];
            }
            storeReq.push({
                method: 'MERGE',
                requestUri: `USER_CL(${id})/USER_PARMS_List(\'${id} ${val[0]}\')`,
                data: {
                    PARM_VALUE: `${parn_Val}`
                }
            });
        });
        return storeReq;
    }
    cancel($event) {
        this.emitChangesTransfer(false);
        this.editFlag = false;
        this.remaster.cancelEmit.next();
    }
    close($event?) {

    }
    default($event?) {
        this.remaster.defaultEmit.next();
    }
    private _pushState() {
        this._userSrv.setChangeState({ isChange: this.btnDisabled });
    }
}
