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
import { UserParamsService } from '../../../shared/services/user-params.service';
import { USER_PARMS } from 'eos-rest';

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
    sortedData;
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
    userParams: USER_PARMS[];
    _currentFormStatus;
    isLoading: boolean = false;
    _userParamsSetSrv: UserParamsService;
    private _fieldsType = {};
    constructor(
        injector: Injector,
        paramModel,
    ) {
        this._userParamsSetSrv = injector.get(UserParamsService);
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
                this.default();
            })
        );
    }
    init() {
      this.prepareDataParam();
            const allData = this._userParamsSetSrv.hashUserContext;
            this.sortedData = this.linearSearchKeyForData(this.constUserParam.fields, allData);
            this.prepareData = this.convData(this.sortedData);
            this.inputs = this.getInputs();
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            this.subscribeChangeForm();
    }
    linearSearchKeyForData(arrayWithKeys, allData) {
        const readyObjectData = {};
        let readyElement;

        for (let i = 0; i < arrayWithKeys.length; i++) {
            readyElement = allData[arrayWithKeys[i].key];
            readyObjectData[arrayWithKeys[i].key] = readyElement;
        }

        return readyObjectData;
    }
    subscribeChangeForm() {
        this.subscriptions.push(
            this.form.valueChanges
                .debounceTime(200)
                .subscribe(newVal => {
                    let changed = false;
                    Object.keys(newVal).forEach(path => {
                        this.oldValue = EosUtils.getValueByPath(this.prepareData, path, false);
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
        let _value = null;
        const arrayKeysForBooleanType = ['FILELOCK', 'FILE_DONTDEL'];
        const pathWithoutRec = path.substr(4);
        if (typeof value === 'boolean' && arrayKeysForBooleanType.some(elem => elem === pathWithoutRec)) {
            _value = value ? '1' : '0';
        } else if (typeof value === 'boolean') {
            _value = value ? 'YES' : 'NO';
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
    convData(data: Object) {
        const d = {};
        for (const key of Object.keys(data)) {
            d[key] = data[key];
        }
        return { rec: d };
    }
    convDataForDefault(data: Array<any>) {
        const d = {};
        data.forEach(item => {
            d[item.PARM_NAME] = item.PARM_VALUE;
        });
        return { rec: d };
    }
    submit() {
        if (this.newData || this.prepareData) {
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this._userParamsSetSrv.getUserIsn();
            if (this.newData) {
            this.userParamApiSrv
                .setData(this.createObjRequest())
                .then(data => {
                   // this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.prepareData) {
                this.userParamApiSrv
                .setData(this.createObjRequestForDefaultValues())
                .then(data => {
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            }
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
        console.log('JJJJJJJJJJ');
        const changed = true;
        console.log(this.prepInputs);
        this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(this.prepInputs._list);
        return this.getData(this.queryObjForDefault).then(data => {
            console.log(data);
                this.prepareData = this.convDataForDefault(data);
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.formChanged.emit(changed);
                this.isChangeForm = changed;
                this.subscribeChangeForm();
            })
            .catch(err => {
                throw err;
            });
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
        const userId = this._userParamsSetSrv.userContextId;
        console.log(this.newData);
        for (const key in this.newData.rec) {
            if (key && key !== 'DEF_SEARCH_CITIZEN' && key.indexOf('FOLDERCOLORSTATUS') !== 0 &&
            key.indexOf('HILITE_PRJ_RC') !== 0 && key.indexOf('HILITE_RESOLUTION') !== 0 &&
            key.indexOf('RCSEND') !== 0) {
                console.log(key);
                console.log(this.newData.rec[key]);
                req.push({
                    method: 'MERGE',
                    requestUri: `USER_CL(${userId})/USER_PARMS_List(\'${userId} ${key}\')`,
                    data: {
                        PARM_VALUE: `${this.newData.rec[key]}`
                    }
                });
            }
        }
        console.log(req);
        return req;
    }
    createObjRequestForDefaultValues(): any[] {
        const req = [];
        const userId = this._userParamsSetSrv.userContextId;
        for (const key in this.prepareData.rec) {
            if (key) {
                req.push({
                    method: 'MERGE',
                    requestUri: `USER_CL(${userId})/USER_PARMS_List(\'${userId} ${key}\')`,
                    data: {
                        PARM_VALUE: `${this.prepareData.rec[key]}`
                    }
                });
            }
        }
        return req;
    }
    checkDataToDisabled(keyField, value) {
        console.log(keyField);
        console.log(value);
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
