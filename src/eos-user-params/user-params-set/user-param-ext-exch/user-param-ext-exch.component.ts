import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { FormHelperService } from 'eos-user-params/shared/services/form-helper.services';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { RemasterService } from 'eos-user-params/user-params-set/shared-user-param/services/remaster-service';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from 'eos-parameters/parametersSystem/shared/consts/eos-parameters.const';
import { IUserSettingsModes } from 'eos-user-params/shared/intrfaces/user-params.interfaces';

@Component({
    selector: 'eos-ext-exch',
    styleUrls: ['user-param-ext-exch.component.scss'],
    templateUrl: 'user-param-ext-exch.component.html',
    providers: [FormHelperService]
})

export class UserParamExtendExchComponent implements OnInit, OnDestroy {
    @Input() defaultTitle: string;
    @Input() defaultUser: any;
    @Input() mainUser?;
    @Input() openingTab: number = 0;
    @Input() appMode: IUserSettingsModes;
    @Input() isCurrentSettings?: boolean;

    @Output() DefaultSubmitEmit: EventEmitter<any> = new EventEmitter();
    readonly fieldGroupsForExhcExt: string[] = ['Эл. почта', 'СЭВ', 'МЭДО'];
    public currTab = 0;
    public hash: Map<any, string>;
    public defaultValues: any;
    public EmailChangeFlag: boolean = false;
    public SabChangeFlag: boolean = false;
    public MadoChangeFlag: boolean = false;
    public isLoading: boolean = false;
    public editFlag: boolean = false;
    public currentUser;
    private EmailChangeValue: any;
    private SabChangeValue: any;
    private MadoChangeValue: any;
    private newValuesMap = new Map();
    private newValuesSab: Map<string, any> = new Map();
    private newValuesMado: Map<string, any> = new Map();
    get titleHeader() {
        if (this.currentUser) {
            if (this.currentUser.isTechUser) {
                return this.defaultTitle ? 'Внешний обмен по умолчанию' : this.currentUser.CLASSIF_NAME + '- Внешний обмен';
            }
            return this.defaultTitle ? 'Внешний обмен по умолчанию' : `${this.currentUser['DUE_DEP_SURNAME']} - Внешний обмен`;
        }
        return '';
    }

    constructor(
        private _userSrv: UserParamsService,
        private _apiSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _RemasterService: RemasterService,
        private _errorSrv: ErrorHelperServices,
        private _formHelper: FormHelperService,
    ) {}
    ngOnInit() {
        if (this.openingTab && Number(this.openingTab) && Number(this.openingTab) <= this.fieldGroupsForExhcExt.length) {
            this.currTab = Number(this.openingTab) - 1;
        }
        if (this.defaultTitle) {
            this.currentUser = this.defaultTitle;
            this.defaultValues = this.defaultUser;
            this.hash = this.defaultUser;
            this.isLoading = true;
        } else {
            const config = {expand: 'USER_PARMS_List'};
            if (this.mainUser) {
                config['isn_cl'] = this.mainUser;
            }
            this._userSrv.getUserIsn(config)
            .then(() => {
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
    ngOnDestroy() {}
    get btnDisabled(): boolean {
        if (this.EmailChangeFlag || this.SabChangeFlag ||  this.MadoChangeFlag) {
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

    emitChangesMado($event) {
        if (this.defaultUser) {
            this.MadoChangeValue = $event[1];
        }
        if ($event) {
            this.MadoChangeFlag = $event[0].btn;
            this.newValuesMado = $event[0].data;
            if (this.newValuesMado.has('MEDO_RECEIVE_RUBRIC_CHECK')) {
                this.newValuesMado.delete('MEDO_RECEIVE_RUBRIC_CHECK');
            }
        } else {
            this.MadoChangeFlag = false;
            this.newValuesMado.clear();
        }
        this._pushState();
    }

    defaultUserSubmit() {
        let obj = {};
        if (this.EmailChangeValue !== undefined) {
            obj = Object.assign(this.EmailChangeValue, obj);
        }
        if (this.SabChangeValue !== undefined) {
            obj = Object.assign(this.SabChangeValue, obj);
        }
        if (this.MadoChangeValue !== undefined) {
            obj = Object.assign(this.MadoChangeValue, obj);
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
            this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
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
        this.emitChangesSab(false);
        this.emitChangesMado(false);
    }

    createObjRequest(): any[] {
        const req = [];
        if (this.defaultUser) {
            if (this.newValuesMap.size) {
                req.concat(this._formHelper.CreateDefaultRequest(req, this.newValuesMap));
            }
            if (this.newValuesSab.size) {
                req.concat(this._formHelper.CreateDefaultRequest(req, this.newValuesSab));
            }
            if (this.newValuesMado.size) {
                req.concat(this._formHelper.CreateDefaultRequest(req, this.newValuesMado));
            }
        } else {
            const userId = this._userSrv.userContextId;
            if (this.newValuesMap.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesMap, userId));
            }
            if (this.newValuesSab.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesSab, userId));
            }
            if (this.newValuesMado.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesMado, userId));
            }
        }
        return req;
    }
    cancel(event) {
        if (this.btnDisabled) {
            this._msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.getChanges(false);
            this.emitChangesSab(false);
            this.emitChangesMado(false);
            this._pushState();
        }
        this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
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
