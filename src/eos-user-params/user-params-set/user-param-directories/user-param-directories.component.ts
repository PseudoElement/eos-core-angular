import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DIRECTORIES_USER } from '../../user-params-set/shared-user-param/consts/directories.consts';
import { UserParamsService } from '../../shared/services/user-params.service';
import { FormHelperService } from '../../shared/services/form-helper.services';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { PipRX, USER_PARMS } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import {ErrorHelperServices} from '../../shared/services/helper-error.services';
@Component({
    selector: 'eos-user-param-directories',
    templateUrl: 'user-param-directories.component.html',
    providers: [FormHelperService],
})

export class UserParamDirectoriesComponent implements OnDestroy, OnInit {
    prepInputsAttach;
    public titleHeader;
    public form: FormGroup;
    public inputs;
    public btnDisable;
    public flagEdit;
    _ngUnsubscribe: Subject<any> = new Subject();

    private allData;
    private prepareData;
    private prepareInputs;
    private mapChanges = new Map();
    private defoltInputs;
    private hashDefolt;
    constructor(
        public _userParamsSetSr: UserParamsService,
        private formHelp: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private _pipRx: PipRX,
        private _msg: EosMessageService,
        private _errorSrv: ErrorHelperServices,
    ) {
        this.flagEdit = false;
        this.btnDisable = true;
        this._userParamsSetSr.saveData$
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                this._userParamsSetSr.submitSave = this.submit();
            });
    }

    ngOnInit() {
        this._userParamsSetSr.getUserIsn().then(() => {
            this.allData = this._userParamsSetSr.hashUserContext;
            this.titleHeader = this._userParamsSetSr.curentUser['SURNAME_PATRON'] + ' - ' + 'Справочники';
            this.inint();
        });
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
                this.flagEdit = false;
                this._pushState();
                this.editMode();
                this._msg.addNewMessage(this.createMessage('success', '', 'Изменения сохранены'));
            }).catch((error) => {
                this._errorSrv.errorHandler(error);
                this.cancel();
            });
        } else {
            return Promise.resolve(false);
        }
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
                arrayQuery.push(this.createReq(key, value));
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
        arrayQuery.push(this.createReq('SRCH_CONTACT_FIELDS', arrSrch.length ? arrSrch.join(',') : ' '));
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
    default(event?) {
        this.prepareData = {};
        this.prepareInputs = {};
        const prep = this.getObjQueryInputsFieldForDefault(this.queryparams());
        return this._pipRx.read(prep)
            .then((data: USER_PARMS[]) => {
                this.hashDefolt = this.createhash(data);
                this.prepareData = this.formHelp.parse_Create(DIRECTORIES_USER.fields, this.hashDefolt);
                this.prepareInputs = this.formHelp.getObjectInputFields(DIRECTORIES_USER.fields);
                this.defoltInputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
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
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
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
        this.prepFormCancel(this.inputs, false);
        this.mapChanges.clear();
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
