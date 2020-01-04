import { FormGroup } from '@angular/forms';
import { Output, EventEmitter, OnDestroy, OnInit, Input, Injector } from '@angular/core';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { ParamApiSrv } from './service/parameters-api.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EosUtils } from 'eos-common/core/utils';
import { IBaseParameters } from './interfaces/parameters.interfaces';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from './consts/eos-parameters.const';
import { AppContext } from 'eos-rest/services/appContext.service';
import { WaitClassifService } from 'app/services/waitClassif.service';

export class BaseParamComponent implements OnDestroy, OnInit {
    @Input() btnDisabled;
    @Output() formChanged = new EventEmitter();
    @Output() formInvalid = new EventEmitter();
    _waitClassifSrv: WaitClassifService;
    constParam: IBaseParameters;
    paramApiSrv: ParamApiSrv;
    dataSrv: EosDataConvertService;
    inputCtrlSrv: InputControlService;
    msgSrv: EosMessageService;
    _appContext: AppContext;
    titleHeader;
    disabledField = false;
    isChangeForm = false;
    newData;
    prepInputs: any;
    inputs: any;
    form: FormGroup;
    queryObj;
    subscriptions: Subscription[] = [];
    prepareData;
    _currentFormStatus;
    private _fieldsType = {};
    constructor(
        injector: Injector,
        paramModel,
    ) {
        this._appContext = injector.get(AppContext);
        this.constParam = this._appContext.cbBase ? this.paramModelCB(paramModel) : paramModel;
        this.titleHeader = this.constParam.title;
        this.paramApiSrv = injector.get(ParamApiSrv);
        this.dataSrv = injector.get(EosDataConvertService);
        this.inputCtrlSrv = injector.get(InputControlService);
        this.msgSrv = injector.get(EosMessageService);
        this._waitClassifSrv = injector.get(WaitClassifService);
    }
    ngOnDestroy() {
        this.unsubscribe();
    }
    ngOnInit() {}

    paramModelCB(paramModel) {
        paramModel['fields'].forEach(elem => {
          if (elem.key === 'VIEWPROT3') {
            elem.title = 'Просмотр и печать файла';
          }
        });
        return paramModel;
    }
    init() {
        this.prepareDataParam();
        return this.getData(this.queryObj)
            .then(data => {
                this.prepareData = this.convData(data);
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.subscribeChangeForm();
            })
            .catch(err => {
                throw err;
            });
    }
    subscribeChangeForm() {
        this.subscriptions.push(
            this.form.valueChanges
                .pipe(
                    debounceTime(200)
                )
                .subscribe(newVal => {
                    let changed = false;
                    Object.keys(newVal).forEach(path => {
                        if (this.changeByPath(path, newVal[path])) {
                            changed = true;
                        }
                    });
                    this.formChanged.emit(changed);
                    this.isChangeForm = changed;
            })
        );
        this.subscriptions.push(
            this.form.statusChanges.subscribe(status => {
                if (this._currentFormStatus !== status) {
                    this.formInvalid.emit(status === 'INVALID');
                }
                this._currentFormStatus = status;
            })
        );
    }

    getData(req): Promise<any> {
        return this.paramApiSrv.getData(req);
    }
    prepareDataParam() {
        this.prepInputs = this.getObjectInputFields(this.constParam.fields);
        this.queryObj = this.getObjQueryInputsField(this.prepInputs._list);
    }
    convData(data: Array<any>) {
        const d = {};
        data.forEach(item => {
            d[item.PARM_NAME] = item.PARM_VALUE;
        });
        return { rec: d };
    }
    submit() {
        if (this.newData) {
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this.paramApiSrv
            .setData(this.createObjRequest())
            .then(data => {
                    this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                .catch(data => {
                    this.formChanged.emit(true);
                    this.isChangeForm = true;
                    this.msgSrv.addNewMessage({
                        type: 'danger',
                        title: 'Ошибка сервера',
                        msg: data.message ? data.message : data
                    });
                });
        }
    }
    cancel() {
        if (this.isChangeForm) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.init();
        }
    }

    getObjQueryInputsField(inputs: Array<any>) {
        return {
            [this.constParam.apiInstance]: {
                    criteries: {
                        PARM_NAME: inputs.join('||'),
                        ISN_USER_OWNER: '-99'
                }
            }
        };
    }

    createObjRequest(): any[] {
        const req = [];
        for (const key in this.newData.rec) {
            if (key) {
                req.push({
                    method: 'MERGE',
                    requestUri: `SYS_PARMS(-99)/USER_PARMS_List('-99 ${key}')`,
                    data: {
                        PARM_VALUE: this.newData.rec[key]
                    }
                });
            }
        }
        return req;
    }
    checkDataToDisabled(keyField, value) {
        if (this.form.controls['rec.' + keyField].value === value) {
            this.disabledField = true;
            this.constParam.disabledFields.forEach(key => {
                this.form.controls['rec.' + key].disable();
            });
        } else {
            this.disabledField = false;
            this.constParam.disabledFields.forEach(key => {
                this.form.controls['rec.' + key].enable();
            });
        }
    }
    changeByPath(path: string, value: any) {
        const key = path.split('.')[1];
        let _value = null;
        if (typeof value === 'boolean' && !this.prepInputs.rec[key].formatDbBinary) {
            _value = value ? 'YES' : 'NO'; //  _value = +value;
        } else if (typeof value === 'boolean' && this.prepInputs.rec[key].formatDbBinary) {
            _value = value ? '1' : '0';
        } else if (value === 'null') {
            _value = null;
        } else if (value instanceof Date) {
            _value = EosUtils.dateToString(value);
        } else if (value === null) {
            _value = '';
        // } else if (value === '') {
        //     // fix empty strings in IE
        //     _value = null;
        } else {
            _value = value;
        }
        this.newData = EosUtils.setValueByPath(this.newData, path, _value);
        const oldValue = EosUtils.getValueByPath(this.prepareData, path, false);
        if (oldValue !== _value) {
            // console.log('changed', path, oldValue, 'to', _value, this.prepareData.rec, this.newData.rec);
        }
        return _value !== oldValue;
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
                formatDbBinary: !!field.formatDbBinary
            };
        });
        return inputs;
    }

    getInputs() {
        const dataInput = {rec: {}};
        Object.keys(this.prepareData.rec).forEach(key => {
            if ((this._fieldsType[key] === 'boolean' || this._fieldsType[key] === 'toggle') && !this.prepInputs.rec[key].formatDbBinary) {
                if (this.prepareData.rec[key] === 'YES') {
                    dataInput.rec[key] = true;
                } else {
                    dataInput.rec[key] = false;
                }
            } else if (this.prepInputs.rec[key].formatDbBinary) {
                if (this.prepareData.rec[key] === '1') {
                    dataInput.rec[key] = true;
                } else {
                    dataInput.rec[key] = false;
                }
            } else {
                if (this._fieldsType[key] === 'numberIncrement') {
                    if (this.prepareData.rec[key] === 'null' || this.prepareData.rec[key] === null) {
                        // для сравнения в методе changeByPath
                        this.prepareData.rec[key] = '';
                    }
                    dataInput.rec[key] = this.prepareData.rec[key];
                }   else {
                    dataInput.rec[key] = this.prepareData.rec[key];
                }
            }
        });
        return this.dataSrv.getInputs(this.prepInputs, dataInput);
    }
    private unsubscribe() {
        this.subscriptions.forEach(subscr => {
            if (subscr) {
                subscr.unsubscribe();
            }
        });
        this.subscriptions = [];
    }
}
