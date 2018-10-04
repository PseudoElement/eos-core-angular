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
    titleHeader;
    constUserParam: IBaseUsers;
    userParamApiSrv: UserParamApiSrv;
    msgSrv: EosMessageService;
    prepareData;
    inputs: any;
    newData;
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
        return this.getData({
            USER_PARMS: {
                criteries: {
                    PARM_NAME: 'WINPOS||SORT||SRCH_CONTACT_FIELDS||SRCH_LIMIT_RESULT||SEARCH_CONTEXT_CARD_EMPTY||SEND_DIALOG||DELFROMCAB||MARKDOC||MARKDOCKND||RS_OUTER_DEFAULT_DELIVERY||MARKDOCKND1||GPD_FLAG||VOL_FLAG||CUR_CABINET' +
                    '||PARAM_WINDOW||SELECT_ITEMS||REESTR_ONE_TO_ONE||ORIG_FLAG||REESTR_NOT_INCLUDED||REESTR_DATE_INTERVAL||REESTR_COPY_COUNT',
                    ISN_USER_OWNER: '3611'
                }
            }
        }).then(data => {
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
    changeByPath(path: string, value: any) {
       // const key = path.split('.')[1];
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
    getObjQueryInputsField(inputs: Array<any>) {
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
        data.forEach(item => {
            d[item.PARM_NAME] = item.PARM_VALUE;
        });
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
    getInputs() {
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
                req.push({
                    method: 'POST',
                    requestUri: `SYS_PARMS_Update?PARM_NAME='${key}'&PARM_VALUE='${this.newData.rec[key]}'`
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
