import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DIRECTORIES_USER } from '../../user-params-set/shared-user-param/consts/directories.consts';
import { UserParamsService } from '../../shared/services/user-params.service';
import { FormHelperService } from '../../shared/services/form-helper.services';
import { EosDataConvertService } from '../../../eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from '../../../eos-common/services/input-control.service';
import { PipRX, USER_PARMS } from '../../../eos-rest';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { IUserSettingsModes } from '../../../eos-user-params/shared/intrfaces/user-params.interfaces';
import { AppContext } from '../../../eos-rest/services/appContext.service';
import { takeUntil } from 'rxjs/operators';
import { RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';
@Component({
    selector: 'eos-user-param-directories',
    templateUrl: 'user-param-directories.component.html',
    providers: [FormHelperService],
})

export class UserParamDirectoriesComponent implements OnDestroy, OnInit {
    @Input() defaultTitle: string;
    @Input() defaultUser: any;
    @Input() mainUser?;
    @Input() appMode: IUserSettingsModes;
    @Input() isCurrentSettings?: boolean;

    @Output() DefaultSubmitEmit: EventEmitter<any> = new EventEmitter();
    prepInputsAttach;
    public form: FormGroup;
    public inputs;
    public btnDisable;
    public flagEdit;
    public currentUser;
    private allData;
    private prepareData;
    private prepareInputs;
    private mapChanges = new Map();
    private defoltInputs;
    private hashDefolt;
    private ngUnsubscribe: Subject<any> = new Subject();
    get titleHeader() {
        if (this.currentUser) {
            if (this.currentUser.isTechUser) {
                return this.defaultTitle ? 'Справочники по умолчанию' : this.currentUser.CLASSIF_NAME + '- Справочники';
            }
            return this.defaultTitle ? 'Справочники по умолчанию' : `${this.currentUser['DUE_DEP_SURNAME']} - Справочники`;
        }
        return '';
    }
    constructor(
        public _userParamsSetSr: UserParamsService,
        private formHelp: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private _pipRx: PipRX,
        private _msg: EosMessageService,
        private _errorSrv: ErrorHelperServices,
        private _appContext: AppContext
    ) {
        this.flagEdit = false;
        this.btnDisable = true;
        this._userParamsSetSr.canDeactivateSubmit$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((rout: RouterStateSnapshot) => {
                this._userParamsSetSr.submitSave = this.submit();
            });
    }

    ngOnInit() {
        this.flagEdit = !!this.isCurrentSettings;
        if (this.defaultTitle) {
            this.currentUser = this.defaultTitle;
            this.allData = this.defaultUser;
            this.inint();
        } else {
            const config = {expand: 'USER_PARMS_List'};
            if (this.mainUser) {
                config['isn_cl'] = this.mainUser;
            }
            this._userParamsSetSr.getUserIsn(config)
                .then((d) => {
                    this.allData = this._userParamsSetSr.hashUserContext;
                    this.currentUser = this._userParamsSetSr.curentUser;
                    this.inint();
                })
                .catch(err => {
                });
        }
    }
    inint() {
        this.prepareData = this.formHelp.parse_Create(DIRECTORIES_USER.fields, this.allData);
        this.prepareInputs = this.formHelp.getObjectInputFields(DIRECTORIES_USER.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.parseInputs(this.allData['SRCH_CONTACT_FIELDS'], this.inputs);
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.editMode();
        this.formSubscriber();
    }
    parseInputs(data, inputs) {
        const value = data ? data.split(',') : [];
        const surname = value.filter(val => {
            return val === 'SURNAME';
        });
        const duty = value.filter(val => {
            return val === 'DUTY';
        });
        const department = value.filter(val => {
            return val === 'DEPARTMENT';
        });
        if (surname.length) {
            inputs['rec.SRCH_CONTACT_FIELDS_SURNAME'].value = true;
        } else {
            inputs['rec.SRCH_CONTACT_FIELDS_SURNAME'].value = false;
        }
        if (duty.length) {
            inputs['rec.SRCH_CONTACT_FIELDS_DUTY'].value = true;
        } else {
            inputs['rec.SRCH_CONTACT_FIELDS_DUTY'].value = false;
        }
        if (department.length) {
            inputs['rec.SRCH_CONTACT_FIELDS_DEPARTMENT'].value = true;
        } else {
            inputs['rec.SRCH_CONTACT_FIELDS_DEPARTMENT'].value = false;
        }
    }
    checkTouch(data) {
        let countError = 0;
        Object.keys(data).forEach(key => {
            if (this.inputs[key].value !== data[key]) {
                countError += 1;
                this.mapChanges.set(key.substring(4), data[key]);
            } else {
                if (this.mapChanges.has(key.substring(4))) {
                    this.mapChanges.delete(key.substring(4));
                }
            }
        });
        if (countError > 0 || this.mapChanges.size) {
            this.btnDisable = false;
        } else {
            this.btnDisable = true;
        }
        this._pushState();
    }
    submit(): Promise<any> {
        if (this.mapChanges.size) {
            const query = this.parseMapForCreate();
            return this._pipRx.batch(query, '').then(() => {
                this.prepFormForSave();
                this.btnDisable = true;
                this._pushState();
                if (!this.isCurrentSettings) {
                    this.flagEdit = false;
                } else {
                    this.btnDisable = false;
                }
                // this._userParamsSetSr.closeWindowForCurrentSettings(this.isCurrentSettings);
                this.editMode();
                if (this.defaultTitle) {
                    this.DefaultSubmitEmit.emit(this.form.value);
                }
                if (this.currentUser.ISN_LCLASSIF === this._appContext.CurrentUser.ISN_LCLASSIF) {
                    const clickModeValue: string = this.form.controls['rec.CLASSIF_WEB_SUGGESTION'].value;
                    this._appContext.getClickModeSettings(clickModeValue);
                }
                this._msg.addNewMessage(this.createMessage('success', '', 'Изменения сохранены'));
            }).catch((error) => {
                this._errorSrv.errorHandler(error);
                this.cancel();
            });
        } else {
            return Promise.resolve(false);
        }
    }

    getValueWindowList(): string {
        const value = this.form.controls['rec.CLASSIF_WEB_SUGGESTION'].value === '1' ? '0' : '1';
        return this.inputs['rec.CLASSIF_WEB_SUGGESTION'].options[value].title;
    }

    prepFormForSave() {
        Object.keys(this.inputs).forEach((key) => {
            const value = this.form.controls[key].value;
            this.inputs[key].value = value;
        });
    }
    parseMapForCreate(): Array<any> {
        const arrayQuery = [];
        this.createUrl(arrayQuery);
        this.mapChanges.clear();
        return arrayQuery;
    }
    createUrl(arrayQuery) {
        const arrSrch = [];
        const surn = this.form.controls['rec.SRCH_CONTACT_FIELDS_SURNAME'].value;
        const duty = this.form.controls['rec.SRCH_CONTACT_FIELDS_DUTY'].value;
        const depart = this.form.controls['rec.SRCH_CONTACT_FIELDS_DEPARTMENT'].value;
        this.mapChanges.forEach((value, key, arr) => {
            if (typeof value !== 'boolean') {
                if (this.defaultTitle) {
                    arrayQuery.push(this.createReqDefault(key, value));
                } else {
                    arrayQuery.push(this.createReq(key, value));
                }
            }
        });
        if (surn) {
            arrSrch.push('SURNAME');
        }
        if (duty) {
            arrSrch.push('DUTY');
        }
        if (depart) {
            arrSrch.push('DEPARTMENT');
        }
        if (this.defaultTitle) {
            arrayQuery.push(this.createReqDefault('SRCH_CONTACT_FIELDS', arrSrch.length ? arrSrch.join(',') : ' '));
        } else {
            arrayQuery.push(this.createReq('SRCH_CONTACT_FIELDS', arrSrch.length ? arrSrch.join(',') : ' '));
        }
    }
    createReq(name: string, value: any): any {
        return {
            method: 'MERGE',
            requestUri: `USER_CL(${this._userParamsSetSr.userContextId})/USER_PARMS_List(\'${this._userParamsSetSr.userContextId} ${name}\')`,
            data: {
                PARM_VALUE: `${value}`
            }
        };
    }

    createReqDefault(name: string, value: any): any {
        return {
            method: 'MERGE',
            requestUri: `SYS_PARMS(-99)/USER_PARMS_List('-99 ${name}')`,
            data: {
                PARM_VALUE: `${value}`
            }
        };
    }

    default(event?) {
        this.prepareData = {};
        this.prepareInputs = {};
        const prep = this.getObjQueryInputsFieldForDefault(this.queryparams());
        return this._pipRx.read<USER_PARMS>(prep)
            .then((data: USER_PARMS[]) => {
                this.hashDefolt = this.createhash(data);
                this.prepareData = this.formHelp.parse_Create(DIRECTORIES_USER.fields, this.hashDefolt);
                this.prepareInputs = this.formHelp.getObjectInputFields(DIRECTORIES_USER.fields);
                this.defoltInputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
                // this.defoltInputs['rec.CLASSIF_WEB_SUGGESTION'].value = '0';
                this.parseInputs(this.hashDefolt['SRCH_CONTACT_FIELDS'], this.defoltInputs);
                this.prepFormCancel(this.defoltInputs, true);
            })
            .catch(err => {
                console.log(err);
            });
    }
    prepFormCancel(input, flag) {
        Object.keys(input).forEach((key) => {
            const val = input[key].value;
            this.form.controls[key].patchValue(val, { emitEvent: flag });
        });
    }
    getObjQueryInputsFieldForDefault(inputs: Array<any>) {
        return {
            USER_PARMS: {
                criteries: {
                    PARM_NAME: inputs.join('||'),
                    ISN_USER_OWNER: '-99'
                }
            }
        };
    }
    createhash(data: USER_PARMS[]) {
        const a = {};
        data.forEach((el: USER_PARMS) => {
            a[el.PARM_NAME] = el.PARM_VALUE;
        });
        return a;
    }
    queryparams() {
        const arraQlist = [];
        DIRECTORIES_USER.fieldsDefaultValue.forEach(el => {
            arraQlist.push(el.key);
        });
        return arraQlist;
    }
    editMode() {
        if (this.flagEdit) {
            this.form.enable({ emitEvent: false });
        } else {
            this.form.disable({ emitEvent: false });
        }
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    formSubscriber() {
        this.form.valueChanges.subscribe(data => {
            this.checkTouch(data);
        });
    }
    edit($event) {
        this.flagEdit = $event;
        this.editMode();
    }
    cancel($event?) {
        this.flagEdit = false;
        this.prepFormCancel(this.inputs, true);
        this.mapChanges.clear();
        this._userParamsSetSr.closeWindowForCurrentSettings(this.isCurrentSettings);
        this.btnDisable = true;
        this.flagEdit = false;
        this._pushState();
        this.editMode();
    }
    createMessage(type, title, msg) {
        return {
            type: type,
            title: title,
            msg: msg,
            dismissOnTimeout: 6000,
        };
    }
    get getMaxIncrement() {
        return this.form.controls['rec.SRCH_LIMIT_RESULT'].valid;
    }
    private _pushState() {
        this._userParamsSetSr.setChangeState({ isChange: !this.btnDisable });
    }

}
