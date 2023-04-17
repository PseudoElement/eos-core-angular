import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { /* debounceTime,  */takeUntil } from 'rxjs/operators';


import { InputControlService } from '../../../eos-common/services/input-control.service';
import { EosDataConvertService } from '../../../eos-dictionaries/services/eos-data-convert.service';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from '../shared-user-param/consts/eos-user-params.const';
import { PipRX } from '../../../eos-rest/services/pipRX.service';
import { IBaseUsers, IUserSettingsModes } from '../../shared/intrfaces/user-params.interfaces';
import { UserParamsService } from '../../shared/services/user-params.service';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';
import { RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';
import { INLINE_SCANNING_USER } from '../shared-user-param/consts/inline-scanning.cons';

@Component({
    selector: 'eos-inline-scaning-params',
    templateUrl: 'inline-scaning-params.component.html'
})
export class InlineScaningParamsComponent implements OnInit, OnDestroy {
    @Input() defaultTitle: string;
    @Input() defaultUser: any;
    @Input() mainUser?;
    @Input() openingTab: number = 0;
    @Input() appMode: IUserSettingsModes;
    @Input() isCurrentSettings?: boolean;

    @Output() DefaultSubmitEmit: EventEmitter<any> = new EventEmitter();
    public btnDisabled: boolean = true; // должно быть false иначе не сохраняется
    public _fieldsType = {};
    public prepInputs;
    public constUserParam: IBaseUsers = INLINE_SCANNING_USER;
    public inputs;
    public form: FormGroup;
    public sortedData;
    public editFlag: boolean = false;
    public titleHeader: string;
    public currTab: number = 0;
    private newData = new Map();
    private prepDate;
    private allData;
    // private listForQuery: Array<string> = [];
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        private dataSrv: EosDataConvertService,
        private _userParamsSetSrv: UserParamsService,
        private _inputCntlSrv: InputControlService,
        private apiSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices,
    ) {
        this._userParamsSetSrv.canDeactivateSubmit$
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe((rout: RouterStateSnapshot) => {
            if (this.form.status !== 'INVALID') {
                this._userParamsSetSrv.submitSave = this.submit();
            } else {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: '',
                    msg: `Нельзя сохранить некорректные данные.`,
                });
                this._userParamsSetSrv.submitSave = Promise.resolve('error');
            }
        });
    }
    ngOnInit() {
        this.editFlag = !!this.isCurrentSettings;
        if (this.defaultTitle) {
            this.titleHeader = this.defaultTitle;
            this.allData = this.defaultUser;
            this.init();
        } else {
            const config = {expand: 'USER_PARMS_List'};
            if (this.mainUser) {
                config['isn_cl'] = this.mainUser;
            }
            this._userParamsSetSrv.getUserIsn(config)
            .then(() => {
                this.titleHeader = this._userParamsSetSrv.curentUser['SURNAME_PATRON'] + ' - ' + 'Поточное сканирование';
                this.init();
                this.suscribeChanges();
            })
            .catch(err => {

            });
        }
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    init() {
        this.prepInputs = this.getObjectInputFields(this.constUserParam.fields);
        const allData = this._userParamsSetSrv.hashUserContext;
        if (this.defaultTitle) {
            this.sortedData = this.linearSearchKeyForData(this.constUserParam.fields, this.allData);
        } else {
            this.sortedData = this.linearSearchKeyForData(this.constUserParam.fields, allData);
        }
        this.prepDate = this.convData(this.sortedData);
        this.inputs = this.getInputs();
        this.form = this._inputCntlSrv.toFormGroup(this.inputs);
        if (this.form.controls['rec.LOCAL_MRSCAN'].value === 'localhost') {
            this.form.controls['rec.LOCAL_MRSCAN_CHECKBOX'].setValue(true, { emitEvent: false });
            this.form.controls['rec.LOCAL_MRSCAN'].setValue('Локальный', { emitEvent: false });
        }
        this.form.controls['rec.LOCAL_MRSCAN'].setValidators(Validators.required);
        this.disableForEditAllForm(this.editFlag);
    }
    getObjectInputFields(fields) {
        const inputs: any = { _list: [], rec: {} };
        fields.forEach(field => {
            this._fieldsType[field.key] = field.type;
            inputs._list.push(field.key);
            inputs.rec[field.key] = {
                title: field.title,
                type: E_FIELD_TYPE[field.type],
                foreignKey: field.key,
                pattern: field.pattern,
                length: field.length,
                options: field.options,
                readonly: !!field.readonly,
                formatDbBinary: !!field.formatDbBinary,
                maxValue: field.maxValue || undefined,
                minValue: field.minValue || undefined,
                default: '',
            };
        });
        return inputs;
    }

    convData(data: Object) {
        const d = {};
        for (const key of Object.keys(data)) {
            d[key] = data[key];
        }
        return { rec: d };
    }
    getInputs() {
        const dataInput = { rec: {} };
        Object.keys(this.prepInputs.rec).forEach(key => {
            if ((this._fieldsType[key] === 'boolean' || this._fieldsType[key] === 'toggle')) {
                if (this.prepDate.rec[key] === 'YES' || this.prepDate.rec[key] === '1') {
                    dataInput.rec[key] = true;
                } else {
                    dataInput.rec[key] = false;
                }
            } else {
                dataInput.rec[key] = this.prepDate.rec[key];
            }
        });
        return this.dataSrv.getInputs(this.prepInputs, dataInput);
    }
    linearSearchKeyForData(arrayWithKeys, allData) {
        const readyObjectData = {};
        let readyElement;
        for (let i = 0; i < arrayWithKeys.length; i++) {
            readyElement = allData[arrayWithKeys[i].key];
            readyObjectData[arrayWithKeys[i].key] = readyElement ? readyElement : '';
        }
        return readyObjectData;
    }

    setTab(i: number) {
        this.currTab = i;
    }
    checkUpdate(upData) {
        Object.keys(upData).forEach(key => {
            if (key === 'rec.LOCAL_MRSCAN_CHECKBOX' || key === 'rec.LOCAL_MRSCAN') {
                if (key === 'rec.LOCAL_MRSCAN') {
                    if (upData[key] === this.inputs[key].value) {
                        this.newData.delete(key);
                    } else {
                        const nDt = upData[key] !== 'Локальный' ? upData[key] : 'localhost';
                        if (this.inputs[key].value !== nDt) {
                            this.newData.set(key, nDt);
                        } else {
                            this.newData.delete(key);
                        }
                    }
                }
            } else {
                if (this.inputs[key].value !== upData[key]) {
                    this.newData.set(key, upData[key]);
                } else {
                    this.newData.delete(key);
                }
            }
        });
        if (this.newData.size > 0) {
            this._userParamsSetSrv.setChangeState({ isChange: true });
        } else {
            this._userParamsSetSrv.setChangeState({ isChange: false });
        }
    }
    suscribeChanges() {
        this.form.controls['rec.LOCAL_MRSCAN_CHECKBOX'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(data => {
            if (!data) {
                this.form.controls['rec.LOCAL_MRSCAN'].setValue('');
                this._pushState();
            } else {
                this.form.controls['rec.LOCAL_MRSCAN'].setValue('Локальный');
            }
        });
        this.form.valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(data => {
            this.checkUpdate(data);
        });
    }
    getFactValueFuck(newValue: any, val: string): boolean {
        const oldValue = this.inputs[val].value;
        return oldValue !== newValue ? false : true;
    }
    submit(event?): Promise<any> {
        let query;
        if (this.defaultTitle) {
            query = this.createReqDefault();
        } else {
            query = this.createObjRequest();
        }
        return this.apiSrv.batch(query, '').then(response => {
            this.upStateInputs();
            this.btnDisabled = true;
            this._pushState();
            if (!this.isCurrentSettings) {
                this.editFlag = false;
                this.disableForEditAllForm(false);
            } else {
                this.btnDisabled = false;
            }
            this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            if (this.defaultTitle) {
                this.DefaultSubmitEmit.emit(this.form.value);
            }
        }).catch(error => {
            this._errorSrv.errorHandler(error);
            this.cancel();
        });
    }
    upStateInputs() {
        Object.keys(this.inputs).forEach(inp => {
            const val = this.form.controls[inp].value;
            this.inputs[inp].value = val;
        });
    }
    createObjRequest(): any[] {
        const req = [];
        const userId = this._userParamsSetSrv.userContextId;
        Array.from(this.newData).forEach(val => {
            let parn_Val;
            if (typeof val[1] === 'boolean') {
                val[1] === false ? parn_Val = 'NO' : parn_Val = 'YES';
            } else {
                String(val[1]) === 'null' ? parn_Val = '' : parn_Val = val[1];
            }
            req.push({
                method: 'MERGE',
                requestUri: `USER_CL(${userId})/USER_PARMS_List(\'${userId} ${val[0].substr(4)}\')`,
                data: {
                    PARM_VALUE: `${parn_Val}`
                }
            });
        });
        return req;
    }

    createReqDefault(): any[] {
        const req = [];
        Array.from(this.newData).forEach(val => {
            let parn_Val;
            if (typeof val[1] === 'boolean') {
                val[1] === false ? parn_Val = 'NO' : parn_Val = 'YES';
            } else {
                String(val[1]) === 'null' ? parn_Val = '' : parn_Val = val[1];
            }
            req.push({
                method: 'MERGE',
                requestUri: `SYS_PARMS(-99)/USER_PARMS_List('-99 ${val[0].substr(4)}')`,
                data: {
                    PARM_VALUE: `${parn_Val}`
                }
            });
        });
        return req;
    }

    cancel(event?) {
        if (!this.btnDisabled) {
            this._msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
        }
        this.fillFormDefaultValues(this.inputs);
        // this._userParamsSetSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
        this.editFlag = event;
        this.disableForEditAllForm(event);
    }
    fillFormDefaultValues(inputsForDefault) {
        Object.keys(inputsForDefault).forEach(key => {
            if (key !== 'rec.LOCAL_MRSCAN_CHECKBOX' && key !== 'rec.LOCAL_MRSCAN') {
                this.form.controls[key].patchValue(inputsForDefault[key].value);
            }
        });
        if (inputsForDefault['rec.LOCAL_MRSCAN'].value === 'localhost') {
            this.form.controls['rec.LOCAL_MRSCAN_CHECKBOX'].setValue(true, { emitEvent: false });
            this.form.controls['rec.LOCAL_MRSCAN'].setValue('Локальный', { emitEvent: false });
        } else {
            this.form.controls['rec.LOCAL_MRSCAN_CHECKBOX'].setValue(false, { emitEvent: false });
        }
    }
    edit(event?) {
        this.editFlag = event;
        this.disableForEditAllForm(event);
    }

    disableForEditAllForm(event) {
        Object.keys(this.inputs).forEach(key => {
            if (!event) {
                this.form.controls[key].disable({ emitEvent: false });
            } else {
                this.form.controls[key].enable({ emitEvent: false });
            }
        });
    }
    defaults(event?) {
        let queryList = [];
        this.constUserParam.fieldsDefaultValue.forEach((item) => {
            queryList.push(item.key);
        })
        const defaultListName = this.getQueryDefaultList(queryList);
        this.apiSrv.read(defaultListName).then(result => {
            this.fillFormDefault(result);
        }).catch(error => {
            console.log(error);
        });
    }

    fillFormDefault(listForDefault: Array<any>) {
        listForDefault.forEach(list => {
            let value = String(list['PARM_VALUE']);
            if (value === 'null' || value === 'undefined') {
                value = '';
            } else {
                value = value;
            }
            if (this.inputs['rec.' + list['PARM_NAME']].controlType === 7) {
                this.form.controls['rec.' + list['PARM_NAME']].patchValue(value === 'YES' ? true : false);
            } else if(list['PARM_NAME'] === 'LOCAL_MRSCAN') {
                const flag = value === 'localhost';
                this.form.controls['rec.' + list['PARM_NAME']].patchValue(flag ? 'Локальный' : value);
                this.form.controls['rec.LOCAL_MRSCAN_CHECKBOX'].setValue(flag);
            } else {
                this.form.controls['rec.' + list['PARM_NAME']].patchValue(value);
            }
        });
    }
    getQueryDefaultList(list) {
        return {
            'USER_PARMS': {
                criteries: {
                    PARM_NAME: list.join('||'),
                    ISN_USER_OWNER: '-99'
                }
            }
        };
    }
    private _pushState() {
        this._userParamsSetSrv.setChangeState({ isChange: !this.btnDisabled });
    }
}
