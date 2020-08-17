import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { EXTERNAL_APPLICATION_USER } from '../../user-params-set/shared-user-param/consts/external-application.consts';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from '../shared-user-param/consts/eos-user-params.const';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { IBaseUsers } from '../../shared/intrfaces/user-params.interfaces';
import { UserParamsService } from '../../shared/services/user-params.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

@Component({
    selector: 'eos-user-param-external-application',
    templateUrl: 'user-param-external-application.component.html'
})

export class UserParamEAComponent implements OnInit, OnDestroy {
    @Input() defaultTitle: string;
    @Input() defaultUser: any;
    @Output() DefaultSubmitEmit: EventEmitter<any> = new EventEmitter();
    public btnDisabled: boolean = true;
    public _fieldsType = {};
    public prepInputs;
    public constUserParam: IBaseUsers = EXTERNAL_APPLICATION_USER;
    public inputs;
    public form: FormGroup;
    public sortedData;
    public editFlag: boolean = false;
    public titleHeader: string;
    public currTab: number = 0;
    readonly fieldGroupsForDeskApl: string[] = ['Внешние приложения', 'Поиск'];
    private newData = new Map();
    private prepDate;
    private allData;
    private listForQuery: Array<string> = [];
    constructor(
        private dataSrv: EosDataConvertService,
        private _userParamsSetSrv: UserParamsService,
        private _inputCntlSrv: InputControlService,
        private apiSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices
    ) {}
    ngOnInit() {
        if (this.defaultTitle) {
            this.titleHeader = this.defaultTitle;
            this.allData = this.defaultUser;
            this.init();
        } else {
            this._userParamsSetSrv.getUserIsn({
                expand: 'USER_PARMS_List'
            })
            .then(() => {
                this.titleHeader = this._userParamsSetSrv.curentUser['SURNAME_PATRON'] + ' - ' + 'Приложение Документы';
                this.init();
            })
            .catch(err => {

            });
        }
    }
    ngOnDestroy() {}
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
        this.getList(this.prepDate);
        this.form = this._inputCntlSrv.toFormGroup(this.inputs);
        this.disableForEditAllForm(this.editFlag);
        this.suscribeChanges();
    }
    getList(listlistForQuery: Array<any>) {
        Object.keys(listlistForQuery['rec']).forEach(nameFields => {
            this.listForQuery.push(nameFields);
        });
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

    suscribeChanges() {
        let count_error = 0;
        this.form.valueChanges
        .pipe(
            debounceTime(200)
        )
        .subscribe(data => {
            Object.keys(data).forEach(val => {
                if (!this.getFactValueFuck(data[val], val)) {
                    this.setNewData(data, val, true);
                    count_error += 1;
                } else {
                    this.setNewData(data, val, false);
                }
            });
            if (count_error > 0) {
                this.btnDisabled = false;
            } else {
                this.btnDisabled = true;
            }
            this._pushState();
            count_error = 0;
        });
    }
    getFactValueFuck(newValue: any, val: string): boolean {
        const oldValue = this.inputs[val].value;
        return oldValue !== newValue ? false : true;
    }

    setNewData(newValObj, newValue, flag) {
        if (flag) {
            this.newData.set(newValue, newValObj[newValue]);
        } else {
            if (this.newData.has(newValue)) {
                this.newData.delete(newValue);
            }
        }
    }
    submit(event?): Promise<any> {
        let query;
        if (this.defaultTitle) {
            query = this.createReqDefault();
        } else {
            query = this.createObjRequest();
        }
        return this.apiSrv.batch(query, '').then(response => {
            this.btnDisabled = true;
            this.upStateInputs();
            this.editFlag = false;
            this.disableForEditAllForm(false);
            this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            this._pushState();
            if (this.defaultTitle) {
                this.DefaultSubmitEmit.emit(this.form.value);
            }
            // return this._userParamsSetSrv.getUserIsn();
        }).catch(error => {
            this._errorSrv.errorHandler(error);
            this.cancellation();
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

    cancellation(event?) {
        if (!this.btnDisabled) {
            this._msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
        }
        this.fillFormDefaultValues(this.inputs);
        this.editFlag = event;
        this.disableForEditAllForm(event);
    }
    fillFormDefaultValues(inputsForDefault) {
        Object.keys(inputsForDefault).forEach(key => {
            this.form.controls[key].patchValue(inputsForDefault[key].value);
        });
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
        const defaultListName = this.getQueryDefaultList(this.listForQuery);
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
            this.form.controls['rec.' + list['PARM_NAME']].patchValue(value);
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
