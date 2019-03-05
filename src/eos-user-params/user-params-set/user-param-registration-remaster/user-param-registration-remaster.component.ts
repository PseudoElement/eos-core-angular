import {Component, OnInit} from '@angular/core';
import { UserParamsService } from '../../shared/services/user-params.service';
import { Router} from '@angular/router';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from '../../../eos-user-params/user-params-set/shared-user-param/consts/eos-user-params.const';
import { PipRX } from 'eos-rest/services/pipRX.service';
import {RemasterService} from '../shared-user-param/services/remaster-service';

@Component({
    selector: 'eos-registration-remaster',
    styleUrls: ['user-param-registration-remaster.component.scss'],
    templateUrl: 'user-param-registration-remaster.component.html'
})

export class UserParamRegistrationRemasterComponent implements OnInit {
    readonly fieldGroupsForRegistration: string[] = ['Доп. операции', 'Корр./адресаты', 'Эл. почта', 'Сканирование', 'Автопоиск', 'СЭВ', 'РКПД'];
    public currTab = 0;
    public hash: Map<any, string>;
    public defaultValues: any;
    public isLoading: boolean = false;
    public EmailChangeFlag: boolean = false;
    public DopOperationChangeFlag: boolean = false;
    public AddressesChengeFlag: boolean = false;
    public ScanChengeFlag: boolean = false;
    public AutoSearchChangeFlag: boolean = false;
    public editFlag: boolean = false;
    private newValuesMap = new Map();
    private newValuesDopOperation: Map<string, any> = new Map();
    private newValuesAddresses: Map<string, any> = new Map();
    private newValuesScan: Map<string, any> = new Map();
    private newValuesAutoSearch: Map<string, any> = new Map();


    constructor(
        private _userSrv: UserParamsService,
        private _apiSrv: PipRX,
        private _route: Router,
        private _msgSrv: EosMessageService,
        private _RemasterService: RemasterService,
        ) {
            this.hash = this._userSrv.hashUserContext;
    }
    ngOnInit() {
        this._apiSrv.read(this.getObjQueryInputsField()).then(data => {
            this.create_hash_default(data);
            this.isLoading = true;
        }).catch(error => {
            this._msgSrv.addNewMessage({
                title: 'Предупреждение',
                type: 'warning',
                msg: error.message || 'Не установленно соединение с базой'
            });
        });
    }
    create_hash_default(data) {
        const hashDefault = {};
        data.forEach(item => {
            hashDefault[item['PARM_NAME']] = item.PARM_VALUE;
        });
        this.defaultValues = hashDefault;
    }
    get btnDisabled(): boolean {
        if (this.EmailChangeFlag
            || this.DopOperationChangeFlag
            || this.AddressesChengeFlag
            || this.ScanChengeFlag
            || this.AutoSearchChangeFlag) {
            return true;
        }
        return false;
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
    }

    emitChanges($event) {
        if ($event) {
            this.DopOperationChangeFlag = $event.btn;
            this.newValuesDopOperation = $event.data;
        } else {
            this.DopOperationChangeFlag = false;
            this.newValuesDopOperation.clear();
        }
    }
    emitChangesAddresses($event) {
        if ($event) {
            this.AddressesChengeFlag = $event.btn;
            this.newValuesAddresses = $event.data;
        } else {
            this.AddressesChengeFlag = false;
            this.newValuesAddresses.clear();
        }
    }
    emitChangesScan($event) {
        if ($event) {
            this.ScanChengeFlag = $event.btn;
            this.newValuesScan = $event.data;
        } else {
            this.ScanChengeFlag = false;
            this.newValuesScan.clear();
        }
    }
    emitChangesAutoSearch($event) {
        if ($event) {
            this.AutoSearchChangeFlag = $event.btn;
            this.newValuesAutoSearch = $event.data;
        } else {
            this.AutoSearchChangeFlag = false;
            this.newValuesAutoSearch.clear();
        }
    }

    edit(event) {
        this.editFlag = event;
        this._RemasterService.editEmit.next(this.editFlag);
    }
    submit(event) {
        this._apiSrv.batch(this.createObjRequest(), '').then(response => {
            this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            this.defaultSetFlagBtn();
            const userId = this._userSrv.userContextId;
            this._userSrv.getUserIsn(String(userId)).then(res => {
                this.hash = this._userSrv.hashUserContext;
                this._RemasterService.submitEmit.next();
            });
        });
    }
    defaultSetFlagBtn() {
        this.getChanges(false);
        this.emitChanges(false);
        this.emitChangesAddresses(false);
        this.emitChangesScan(false);
        this.emitChangesAutoSearch(false);
    }

    createObjRequest(): any[] {
        const req = [];
        const userId = this._userSrv.userContextId;
        if (this.newValuesMap.size) {
            req.concat(this.pushIntoArrayRequest(req, this.newValuesMap, userId ));
        }
        if (this.newValuesDopOperation.size) {
            req.concat(this.pushIntoArrayRequest(req, this.newValuesDopOperation, userId ));
        }
        if (this.newValuesAddresses.size) {
            req.concat(this.pushIntoArrayRequest(req, this.newValuesAddresses, userId ));
        }
        if (this.newValuesScan.size) {
            req.concat(this.pushIntoArrayRequest(req, this.newValuesScan, userId));
        }
        if (this.newValuesAutoSearch.size) {
            req.concat(this.pushIntoArrayRequest(req, this.newValuesAutoSearch, userId));
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

    cancel(event) {
        if (this.btnDisabled) {
            this._msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.getChanges(false);
            this.emitChanges(false);
            this.emitChangesAddresses(false);
            this.emitChangesScan(false);
            this.emitChangesAutoSearch(false);
        }
        this.editFlag = event;
        this._RemasterService.cancelEmit.next();
    }
    close(event?) {
        this._route.navigate(['user_param']);
     }
    default(event) {
        this._RemasterService.defaultEmit.next();
    }
}
