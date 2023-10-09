import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { PipRX } from '../../../eos-rest/services/pipRX.service';
import { FormHelperService } from '../../../eos-user-params/shared/services/form-helper.services';
import { UserParamsService } from '../../../eos-user-params/shared/services/user-params.service';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { RemasterService } from '../../../eos-user-params/user-params-set/shared-user-param/services/remaster-service';
import { ErrorHelperServices } from '../../../eos-user-params/shared/services/helper-error.services';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from '../../../eos-parameters/parametersSystem/shared/consts/eos-parameters.const';
import { IUserSettingsModes } from '../../../eos-user-params/shared/intrfaces/user-params.interfaces';
import { AppContext } from '../../../eos-rest/services/appContext.service';
import { Subject } from 'rxjs';
import { RouterStateSnapshot } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Features } from '../../../eos-dictionaries/';
declare function notifyOpener()

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
    public fieldGroupsForExhcExt: string[] = ['Эл. почта', 'СЭВ', 'МЭДО', 'ССТУ'];
    public currTabName = 'Эл. почта';
    // public currTab = 0;
    public hash: Map<any, string>;
    public defaultValues: any;
    public EmailChangeFlag: boolean = false;
    public SabChangeFlag: boolean = false;
    public SstuChangeFlag: boolean = false;
    public MadoChangeFlag: boolean = false;
    public isLoading: boolean = false;
    public editFlag: boolean = false;
    public currentUser;
    public notInVersion: boolean;
    private EmailChangeValue: any;
    private SabChangeValue: any;
    private MadoChangeValue: any;
    private SstuChangeValue: any;
    private newValuesMap = new Map();
    private newValuesSab: Map<string, any> = new Map();
    private newValuesMado: Map<string, any> = new Map();
    private newValuesSstu: Map<string, any> = new Map();
    private ngUnsubscribe: Subject<any> = new Subject();
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
        public _appContext: AppContext,
    ) {
        if(this._appContext.cbBase){
            const cbChannel = ['ЛК', 'ЕПВВ', 'СДС', 'АС ПСД'];
            this.fieldGroupsForExhcExt = [].concat(this.fieldGroupsForExhcExt, cbChannel)
        }
        this._userSrv.canDeactivateSubmit$
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe((rout: RouterStateSnapshot) => {
            this._userSrv.submitSave = this.submit('');
        });
        this.notInVersion = Features.cfg.variant !== 2;
    }

    ngOnInit() {
        this.editFlag = !!this.isCurrentSettings;

        if (!this.notInVersion) {
            this.fieldGroupsForExhcExt.push('ЕПП');
        }
        if (this.appMode.tkDoc) {
            this.fieldGroupsForExhcExt = this.fieldGroupsForExhcExt.filter((item) => {
                return item !== 'МЭДО';
            });
        }
        if (this._appContext.cbBase && (this.appMode.cbr)) { // this.appMode.arm ||
            this.fieldGroupsForExhcExt = this.fieldGroupsForExhcExt.filter((item) => {
                return item !== 'Эл. почта';
            });
        }
        this.currTabName = this.fieldGroupsForExhcExt[0];
        if (this.appMode.extExchParams) {
            switch (this.appMode.extExchParams) {
                case 51:
                    this.setTab('Эл. почта');
                    break;
                case 52:
                    this.setTab('СЭВ');
                    break;
                case 53:
                    this.setTab('МЭДО');
                    break;
                case 54:
                    this.setTab('ЕПП');
                    break;
                case 55:
                    this.setTab('ССТУ');
                    break;
                case 56:
                    this.setTab('ЛК');
                    break;
                case 57:
                    this.setTab('ЕПВВ');
                    break;
                case 58:
                    this.setTab('СДС');
                    break;
                case 59:
                    this.setTab('АС ПСД');
                    break;
                default:
                    this.setTab('Эл. почта');
                    break;
            }
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
                this._errorSrv.errorHandler(err);
            });
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    get btnDisabled(): boolean {
        if (this.EmailChangeFlag || this.SabChangeFlag ||  this.MadoChangeFlag || this.SstuChangeFlag) {
            return true;
        }
        return false;
    }

    setTab(tab: string) {
        this.currTabName = tab;
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

    getChangesCbChannel($event, channel: string) {
        const RCSEND_CHANNEL = 'RCSEND_' + channel;
        const MAILRECEIVE_CHANNEL = 'MAILRECEIVE_' + channel;
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
            this.newValuesMap.delete(RCSEND_CHANNEL);
            this.newValuesMap.delete(MAILRECEIVE_CHANNEL);
        }
        this._pushState();
    }

    private _pushState() {
        this._userSrv.setChangeState({ isChange: this.btnDisabled });
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
    emitChangesSstu($event) {
        if (this.defaultUser) {
            this.SstuChangeValue = $event[1];
        }
        if ($event) {
            this.SstuChangeFlag = $event[0].btn;
            this.newValuesSstu = $event[0].data;
        } else {
            this.SstuChangeFlag = false;
            this.newValuesSstu.clear();
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
        if (this.SstuChangeValue !== undefined) {
            obj = Object.assign(this.SstuChangeValue, obj);
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
            // this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
            if (!this.isCurrentSettings) {
                this.editFlag = false;
            }
            this._RemasterService.submitEmit.next();
            notifyOpener();
            /** Если открываем отдельный канал то после нажатия записать закрываем окно */
            if (this.appMode.extExchParams) {
                window.close();
            }
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
        this.emitChangesSstu(false);
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
            if (this.newValuesSstu.size) {
                req.concat(this._formHelper.CreateDefaultRequest(req, this.newValuesSstu));
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
            if (this.newValuesSstu.size) {
                req.concat(this._formHelper.pushIntoArrayRequest(req, this.newValuesSstu, userId));
            }
        }
        /** Не учитываю параметры регистрации по ЕПВВ @168637 */
        const reqFilter = req.filter((q) => {
            if (q['data']['PARM_VALUE'] === 'undefined') {
                return false;
            }
            return true
        })
        return reqFilter;
    }
    cancel(event) {
        if (this.btnDisabled) {
            this._msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.getChanges(false);
            this.emitChangesSab(false);
            this.emitChangesMado(false);
            this.emitChangesSstu(false);
            this._pushState();
        }
        this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
        this.editFlag = event;
        this._RemasterService.cancelEmit.next();
    }
    default(event) {
        this._RemasterService.defaultEmit.next(this.currTabName);
    }

}
