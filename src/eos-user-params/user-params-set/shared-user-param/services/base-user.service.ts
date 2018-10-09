import { OnDestroy, OnInit, Injectable, Injector, Output, Input, EventEmitter } from '@angular/core';
import { E_FIELD_TYPE, IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';
import { UserParamApiSrv } from '../../../shared/services/user-params-api.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { Subscription } from 'rxjs/Rx';
import { UserParamsDescriptorSrv } from '../../../shared/services/user-params-descriptor.service';
import { EosUtils } from 'eos-common/core/utils';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from '../consts/eos-user-params.const';

@Injectable()
export class BaseUserSrv implements OnDestroy, OnInit {
    @Input() btnDisabled;
    @Output() formChanged = new EventEmitter();
    @Output() formInvalid = new EventEmitter();
    descriptorSrv: UserParamsDescriptorSrv;
    prepInputs: any;
    queryObj;
    queryObjForDefault;
    titleHeader;
    constUserParam: IBaseUsers;
    userParamApiSrv: UserParamApiSrv;
    msgSrv: EosMessageService;
    prepareData;
    inputs: any;
    newData;
    defaultData;
    oldValue: any;
    isChangeForm = false;
    disabledField = false;
    dataSrv: EosDataConvertService;
    inputCtrlSrv: InputControlService;
    form: FormGroup;
    subscriptions: Subscription[] = [];
    arrayData: string[] = [];
    userId: string;
    disableSave: boolean;
    isChanged: boolean;
    _currentFormStatus;
    private _fieldsType = {};
    constructor(
        injector: Injector,
        paramModel,
    ) {
        this.constUserParam = paramModel;
        this.titleHeader = this.constUserParam.title;
        this.userParamApiSrv = injector.get(UserParamApiSrv);
        this.dataSrv = injector.get(EosDataConvertService);
        this.inputCtrlSrv = injector.get(InputControlService);
        this.descriptorSrv = injector.get(UserParamsDescriptorSrv);
        this.msgSrv = injector.get(EosMessageService);
    }
    ngOnDestroy() {
        this.unsubscribe();
    }
    ngOnInit() {
        this.subscriptions.push(
            this.descriptorSrv.saveData$.subscribe(() => {
                this.submit();
            })
        );
    }
    init() {
        this.prepareDataParam();
        console.log(this.queryObj);
        return this.getData(this.queryObj).then(data => {
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
                .debounceTime(200)
                .subscribe(newVal => {
                    let changed = false;
                    Object.keys(newVal).forEach(path => {
                        this.oldValue = EosUtils.getValueByPath(this.prepareData, path, false);
                        if (this.oldValue !== newVal[path] && typeof newVal[path] === 'string') {
                            this.changeByPath(path, newVal[path]);
                            changed = true;
                        }
                      /*   if (this.changeByPath(path, newVal[path])) {
                            changed = true;
                         }*/
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
    changeByPath(path: string, value: any) {
       // const key = path.split('.')[1];
        console.log('LKJ');
        let _value = null;
        if (typeof value === 'boolean') {
            _value = value ? '1' : '0';
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
    prepareDataParam() {
        this.prepInputs = this.getObjectInputFields(this.constUserParam.fields);
        this.queryObj = this.getObjQueryInputsField(this.prepInputs._list);
        console.log(this.queryObj);
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
        console.log(inputs);
        console.log(inputs._list);
       /* for (let i = 0; i < inputs._list.length; i++) {
            for (let j = 0; j < inputs._list[i].length; j++) {
                if (inputs._list[i].charAt(j) === ' ') {
                    inputs._list[i].charAt(j) = '_';
                }
            }
        }*/
        return inputs;
    }
    getObjQueryInputsField(inputs: Array<any>) {
        console.log('Я тут');
        // inputs.join('||')
        console.log({
            [this.constUserParam.apiInstance]: {
                    criteries: {
                        PARM_GROUP: '12',
                        ISN_USER_OWNER: '3611||-99'
                }
            }
        });
        return {
            [this.constUserParam.apiInstance]: {
                    criteries: {
                        PARM_NAME: inputs.join('||'),
                        ISN_USER_OWNER: '-99'
                }
            }
        };
    }
    getObjQueryInputsFieldForDefault(inputs: Array<any>) {
        return {
            [this.constUserParam.apiInstance]: {
                    criteries: {
                        PARM_NAME: inputs.join('||'),
                        ISN_USER_OWNER: '-99'
                }
            }
        };
    }
    getData(req) {
        return this.userParamApiSrv.getData(req);
    }
    convData(data: Array<any>) {
        const d = {};
        let incrementValueOne = 0;
        let incrementValueTwo = 33;
        console.log(data);
        data.forEach(item => {
            if (item.PARM_GROUP === 12) {
               /* console.log(item);
                console.log(item.PARM_VALUE);
                console.log('' + 12 + '_' + ++incrementValueOne); */
               d['' + 12 + '_' + ++incrementValueOne] = item.PARM_VALUE;
               d['' + 12 + '_' + ++incrementValueTwo] = item.PARM_NAME;
            } else {
                console.log('Попал');
               d[item.PARM_NAME] = item.PARM_VALUE;
            }
        });
        console.log({ rec: d });
        return { rec: d };
    }
    submit() {
        if (this.newData) {
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this.userParamApiSrv
                .setData(this.createObjRequest())
                .then(data => {
                    this.prepareData.rec = Object.assign({}, this.newData.rec);
                   // console.log(this.prepareData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                .catch(data => console.log(data));
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
    default() {
        console.log('RED');
        this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(this.prepInputs._list);
        return this.getData(this.queryObjForDefault).then(data => {
                this.prepareData = this.convData(data);
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                console.log('Попал');
                console.log(this.form);
                this.subscribeChangeForm();
            })
            .catch(err => {
                throw err;
            });

          //  console.log(this.defaultData);
    }
    getInputs() {
        // !
        const dataInput = {rec: {}};
        Object.keys(this.prepareData.rec).forEach(key => {
            if ((this._fieldsType[key] === 'boolean' || this._fieldsType[key] === 'toggle') && !this.prepInputs.rec[key].formatDbBinary) {
                if (this.prepareData.rec[key] === 'YES') {
                    dataInput.rec[key] = true;
                } else {
                    dataInput.rec[key] = false;
                }
            } else {
                dataInput.rec[key] = this.prepareData.rec[key];
            }
        });
        return this.dataSrv.getInputs(this.prepInputs, dataInput);
    }
    createObjRequest(): any[] {
        const req = [];
        for (const key in this.newData.rec) {
            if (key) {
                console.log(this.newData, key);
                req.push({
                    method: 'POST',
                    requestUri: `PARM_NAME='${key}'&PARM_VALUE='${this.newData.rec[key]}'`
                });
            }
        }
        return req;
    }
    checkDataToDisabled(keyField, value) {
        if (this.form.controls['rec.' + keyField].value === value) {
            this.disabledField = true;
            this.constUserParam.disabledFields.forEach(key => {
                this.form.controls['rec.' + key].disable();
            });
        } else {
            this.disabledField = false;
            this.constUserParam.disabledFields.forEach(key => {
                this.form.controls['rec.' + key].enable();
            });
        }
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
