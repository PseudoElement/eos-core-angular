import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserParamsService } from '../../shared/services/user-params.service';
import { RC_USER } from '../shared-user-param/consts/rc.consts';
import { FormGroup } from '@angular/forms';
import { IOpenClassifParams } from '../../../eos-common/interfaces/interfaces';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from '../shared-user-param/consts/eos-user-params.const';
import { FormHelperService } from '../../shared/services/form-helper.services';
import { Subject } from 'rxjs/Subject';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { PipRX } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
@Component({
    selector: 'eos-user-param-rc',
    templateUrl: 'user-param-rc.component.html',
    providers: [FormHelperService],
})
export class UserParamRCComponent implements OnDestroy, OnInit {
    prepInputsAttach;
    flagEdit: boolean;
    public inputs;
    public form: FormGroup;
    public allData;
    public dopRec: Array<any> = null;
    public flagBacground;
    public cutentTab: number;
    public btnDisabled: boolean = true;
    public titleHeader;
    private originDocRc;
    private prepareData;
    private prepareInputs;
    private _ngUnsubscribe: Subject<any> = new Subject();
    private disabledFlagDelite = false;
    private mapChanges = new Map();
    private creatchesheDefault: any;
    private defoltInputs: any;

    constructor(
        private _userParamsSetSrv: UserParamsService,
        private formHelp: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private _waitClassifSrv: WaitClassifService,
        private _pipRx: PipRX,
        private _msg: EosMessageService,
        private _errorSrv: ErrorHelperServices,
    ) {
        this.allData = this._userParamsSetSrv.hashUserContext;
        this.titleHeader = `${this._userParamsSetSrv.curentUser.SURNAME_PATRON} - РК`;
        this.cutentTab = 0;
        this._userParamsSetSrv.saveData$
            .takeUntil(this._ngUnsubscribe)
            .subscribe(() => {
                this._userParamsSetSrv.submitSave = this.submit();
            });
    }
    ngOnInit() {
        this.init();
        this.getInfoFroCode(this.form.controls['rec.OPEN_AR'].value).then(() => {
            this.originDocRc = this.dopRec ? this.dopRec.slice() : null;
            this.checRcShowRes();
            this.editMode();
        }).catch(error => {
            this._msg.addNewMessage({
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Некорркетное значение в базе данных, попробуйте сбросить настройки по умолчанию'
            });
        });
    }
    setTab(i: number) {
        this.cutentTab = i;
    }
    checRcShowRes(): void {
        const value = this.form.controls['rec.SHOW_RES_HIERARCHY'].value;
        value === 'YES' ? this.disabDefault(true) : this.disabDefault(false);
    }
    disabDefault(flag: boolean): void {
        if (flag) {
            this.form.controls['rec.SHOW_ALL_RES'].disable({ onlySelf: true, emitEvent: false });
        } else {
            this.form.controls['rec.SHOW_ALL_RES'].enable({ emitEvent: false });
        }
    }
    init() {
        this.pretInputs();
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.subscribeChangeForm();
        this.editMode();
    }
    pretInputs(): void {
        this.prepareData = this.formHelp.parse_Create(RC_USER.fields, this.allData);
        this.prepareInputs = this.formHelp.getObjectInputFields(RC_USER.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
    }
    getInfoFroCode(code: string): Promise<any> {
        if (code && String(code) !== 'null') {
            const parsedCode = code.split(',').filter(el => (String(el) !== 'null')).join('||');
            const query = {
                DOCGROUP_CL: {
                    criteries: {
                        ISN_NODE: parsedCode
                    }
                }
            };
            return this._pipRx.read(query).then(result => {
                this.dopRec = result;
                this.dopRec.length > 0 ? this.disabledFlagDelite = false : this.disabledFlagDelite = true;
            });
        } else {
            this.disabledFlagDelite = true;
            return Promise.resolve();
        }
    }

    addRcDoc(): void {
        this.flagBacground = true;
        const query: IOpenClassifParams = {
            classif: 'DOCGROUP_CL',
            selectMulty: true,
            selectLeafs: true,
            selectNodes: false,
            return_due: false,
        };
        this._waitClassifSrv.openClassif(query, true).then(data => {
            this.addRcDocToInput(data);
            this.flagBacground = false;
        }).catch(error => {
            this.flagBacground = false;
        });
    }
    addRcDocToInput(data): void {
        let dateVal: string, newValue = [], oldValue = [];
        dateVal = this.form.controls['rec.OPEN_AR'].value;
        if (dateVal) {
            oldValue = dateVal.split(',');
        }
        if (data) {
            newValue = data.split('|');
            newValue = newValue.filter(isn => {
                const patt = new RegExp('^' + isn + ',?|,' + isn + '$|.*,' + isn + ',.*');
                return !patt.test(dateVal);
            });
        }
        if (newValue.length) {
            oldValue.push(...newValue);
            const addedValue = oldValue.join(',');
            this.form.controls['rec.OPEN_AR'].patchValue(addedValue);
            this.getInfoFroCode(addedValue).then(() => {
                this.checRcShowRes();
            }).catch(error => {
                this._msg.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: 'Некорркетное значение в базе данных, попробуйте сбросить настройки по умолчанию'
                });
            });
        }
    }

    deleteRcDoc(): void {
        let updateVield: Array<number>, arrayT: Array<number>;
        let valToSave;
        this.dopRec.splice(this.cutentTab, 1);
        arrayT = [];
        this.dopRec.forEach(value => {
            arrayT.push(value.ISN_NODE);
        });
        updateVield = arrayT;
        if (this.dopRec.length > 0) {
            this.disabledFlagDelite = false;
        } else {
            this.disabledFlagDelite = true;
            this.dopRec = null;
        }
        updateVield.join(',') === '' ? valToSave = '' : valToSave = updateVield.join(',');
        this.form.controls['rec.OPEN_AR'].patchValue(valToSave);
    }

    editMode() {
        if (this.flagEdit) {
            this.form.enable({ emitEvent: false });
        } else {
            this.form.disable({ emitEvent: false });
        }
    }

    subscribeChangeForm() {
        this.form.valueChanges.subscribe(dtat => {
            this.checkChanges(dtat);
        });
    }
    checkChanges(data) {
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
            this.btnDisabled = false;
        } else {
            this.btnDisabled = true;
        }
        this._pushState();
    }

    upInputs(inputs) {
        Object.keys(inputs).forEach(key => {
            const val = inputs[key].value;
            this.form.controls[key].patchValue(val);
        });
    }
    botInputs() {
        Object.keys(this.inputs).forEach(key => {
            const val = this.form.controls[key].value;
            this.inputs[key].value = val;
        });
    }

    submit(): Promise<any> {
        const query = this.createUrl();
        return this._pipRx.batch(query, '').then(res => {
            return this._userParamsSetSrv.getUserIsn().then(() => {
                this.mapChanges.clear();
                this.originDocRc = this.dopRec ? this.dopRec.slice() : null;
                this.botInputs();
                this.flagEdit = false;
                this.btnDisabled = true;
                this._pushState();
                this.editMode();
                this._msg.addNewMessage(PARM_SUCCESS_SAVE);
            });
        }).catch(error => {
            this._errorSrv.errorHandler(error);
        });
    }
    createUrl() {
        const arrayQuery = [];
        this.mapChanges.forEach((value, key, arr) => {
            let val;
            switch (typeof value) {
                case 'string':
                    val = value;
                    break;
                case 'boolean':
                    value ? val = 'YES' : val = 'NO';
                    break;
                default:
                    val = value;
                    break;
            }
            arrayQuery.push(this.createReq(key, val));
        });
        return arrayQuery;
    }
    createReq(name: string, value: any): any {
        return {
            method: 'MERGE',
            requestUri: `USER_CL(${this._userParamsSetSrv.userContextId})/USER_PARMS_List(\'${this._userParamsSetSrv.userContextId} ${name}\')`,
            data: {
                PARM_VALUE: `${value}`
            }
        };
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    cancel($event?) {
        if (!this.btnDisabled) {
            this._msg.addNewMessage(PARM_CANCEL_CHANGE);
        }
        this.mapChanges.clear();
        this.flagEdit = false;
        this.dopRec = this.originDocRc ? this.originDocRc.slice() : null;
        this.dopRec ? this.disabledFlagDelite = false : this.disabledFlagDelite = true;
        this.upInputs(this.inputs);
        this.editMode();
    }
    edit($event) {
        this.flagEdit = $event;
        this.editMode();
        this.checRcShowRes();
    }

    default() {
        this.prepareData = {};
        this.prepareInputs = {};
        const prep = this.formHelp.getObjQueryInputsFieldForDefault(this.formHelp.queryparams(RC_USER, 'fieldsDefaultValue'));
        this._pipRx.read(prep).then(data => {
            this.disabledFlagDelite = true;
            this.mapChanges.clear();
            this.dopRec = null;
            this.creatchesheDefault = this.formHelp.createhash(data);
            this.prepareData = this.formHelp.parse_Create(RC_USER.fields, this.creatchesheDefault);
            this.prepareInputs = this.formHelp.getObjectInputFields(RC_USER.fields);
            this.defoltInputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
            this.upInputs(this.defoltInputs);
            this.checRcShowRes();
        });
    }
    private _pushState() {
        this._userParamsSetSrv.setChangeState({ isChange: !this.btnDisabled });
    }

}
