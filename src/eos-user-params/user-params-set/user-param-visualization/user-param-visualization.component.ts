import { Component, OnDestroy, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserParamsService } from '../../shared/services/user-params.service';
import { FormHelperService } from '../../shared/services/form-helper.services';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { PipRX, USER_PARMS } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { VISUALIZATION_USER } from '../shared-user-param/consts/visualization.consts';

@Component({
    selector: 'eos-user-param-visualization',
    templateUrl: 'user-param-visualization.component.html',
    providers: [FormHelperService],
})

export class UserParamVisualizationComponent implements OnDestroy, OnInit {
    @Input() defaultTitle: string;
    @Input() defaultUser: any;
    @Output() DefaultSubmitEmit: EventEmitter<any> = new EventEmitter();
    prepInputsAttach;
    public form: FormGroup;
    public inputs;
    public btnDisable;
    public flagEdit;
    public currentUser;
    get titleHeader() {
        if (this.currentUser) {
            if (this.currentUser.isTechUser) {
                return this.defaultTitle ? 'Визуализация по умолчанию' : this.currentUser.CLASSIF_NAME + '- Визуализация';
            }
            return this.defaultTitle ? 'Визуализация по умолчанию' : `${this.currentUser['DUE_DEP_SURNAME']} - Визуализация`;
        }
        return '';
    }
    private allData;
    private prepareData;
    private prepareInputs;
    private mapChanges = new Map();
    private defoltInputs;

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
    }
    ngOnInit() {
        if (this.defaultTitle) {
            this.currentUser = this.defaultTitle;
            this.allData = this.defaultUser;
            this.inint();
        } else {
            this._userParamsSetSr.getUserIsn({
                expand: 'USER_PARMS_List'
            })
            .then(() => {
                this.currentUser = this._userParamsSetSr.curentUser;
                this.allData = this._userParamsSetSr.hashUserContext;
                this.inint();
            })
            .catch(err => {
            });
        }
    }
    inint() {
        this.prepareData = this.formHelp.parse_Create(VISUALIZATION_USER.fields, this.allData);
        this.prepareInputs = this.formHelp.getObjectInputFields(VISUALIZATION_USER.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.editMode();
        this.formSubscriber();
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
            const arrayQuery = [];
            this.createUrl(arrayQuery);
            this.mapChanges.clear();
            return this._userParamsSetSr.BatchData(arrayQuery[0].method, arrayQuery[0].requestUri, arrayQuery[0].data).then(() => {
                this.prepFormForSave();
                this.btnDisable = true;
                this.flagEdit = false;
                this._pushState();
                this.editMode();
                this._msg.addNewMessage(this.createMessage('success', '', 'Изменения сохранены'));
                if (this.defaultTitle) {
                    this.DefaultSubmitEmit.emit(this.form.value);
                }
            }).catch((error) => {
                this._errorSrv.errorHandler(error);
                this.cancel();
                this._msg.addNewMessage(this.createMessage('warning', '', 'Изменения не сохранены'));
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
    createUrl(arrayQuery) {
        if (this.defaultTitle) {
            this.mapChanges.forEach((value, key, arr) => {
                arrayQuery.push(this.createReqDefault(key, value));
            });
        } else {
            this.mapChanges.forEach((value, key, arr) => {
                arrayQuery.push(this.createReq(key, value));
            });
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
        const prep = this.formHelp.getObjQueryInputsFieldForDefault(this.formHelp.queryparams(VISUALIZATION_USER, 'fields'));
        return this._pipRx.read(prep)
            .then((data: USER_PARMS[]) => {
                this.prepareData = this.formHelp.parse_Create(VISUALIZATION_USER.fields, this.formHelp.createhash(data));
                this.prepareInputs = this.formHelp.getObjectInputFields(VISUALIZATION_USER.fields);
                this.defoltInputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
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
    editMode() {
        if (this.flagEdit) {
            this.form.enable({ emitEvent: false });
        } else {
            this.form.disable({ emitEvent: false });
        }
    }
    ngOnDestroy() {}
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
    private _pushState() {
        this._userParamsSetSr.setChangeState({ isChange: !this.btnDisable });
    }
}
