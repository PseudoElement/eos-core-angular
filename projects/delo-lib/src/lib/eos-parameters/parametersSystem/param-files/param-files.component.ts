import { Component, Injector, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, /* ValidatorFn */ } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { debounceTime } from 'rxjs/operators';

import { ALL_ROWS } from '../../../eos-rest/core/consts';
import { EosUtils } from '../../../eos-common/core/utils';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from './../shared/consts/eos-parameters.const';
import { FILES_PARAM } from '../shared/consts/files-consts';
import { BaseParamComponent } from '../shared/base-param.component';
import { ValidatorsControl, VALIDATOR_TYPE } from '../../../eos-dictionaries/validators/validators-control';
import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';
@Component({
    selector: 'eos-param-files',
    templateUrl: 'param-files.component.html'
})
export class ParamFielsComponent extends BaseParamComponent {
    @ViewChild('infoAttachFilesModal') infoAttachFilesModal: ModalDirective;
    @Input() btnError;
    validChengeValueStr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZабвгдежзиклмнопрстуфхцчшщъыьэюяАБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЫЬЭЮЯ';
    defaultValidCharsFileDesc = ' !$()’,-.;=_';
    formAttachChoice: FormGroup;
    _currentFormAttachStatus;
    dataAttachDb;
    updateDataAttach = {};
    prepDataAttach = { rec: {} };
    inputAttach;
    hiddenFieldAttach = false;
    formAttach: FormGroup;
    prepInputsAttach;
    isChangeFormAttach = false;
    newDataAttach;
    editMode: boolean;
    validValue;
    newMesTrue = true;
    checkBlur: boolean = false;
    readonly arrSetValidation = ['DOC_RC_EXTENSIONS', 'PRJ_VISA_SIGN_EXTENSIONS', 'REPLY_EXTENSIONS', 'RESOLUTION_EXTENSIONS', 'PRJ_RC_EXTENSIONS'];
    formAttachfields = [
        {
            value: 'rc',
            text: 'РК'
        },
        {
            value: 'prj-rc',
            text: 'РКПД'
        }
    ];
    queryFileConstraint = {
        'DOCGROUP_CL(\'0.\')/DG_FILE_CONSTRAINT_List': ALL_ROWS
    };
    get strimScan() {
        if (this._appContext.CurrentUser.STREAM_SCAN_RIGHTS) {
            return this._appContext.CurrentUser.STREAM_SCAN_RIGHTS[1] !== '1';
        } else {
            return true;
        }
    }
    get sreamScaneContext() {
        return this._appContext.sreamScane;
    }
    constructor(injector: Injector) {
        super(injector, FILES_PARAM);
        this.init()
            .then(() => {
                 // b-119380
                this.updateFormInput();
                this.formAttachChoice = new FormGroup({
                    attachFile: new FormControl('rc')
                });
                this.prepInputsAttach = this.prepareInputField(FILES_PARAM.fieldsChild);
                this.afterInit();
            }).catch(err => {
                if (err.code !== 401) {
                    console.log(err);
                }
            });
    }
    _updateValidators(controls: any): any {
        this.arrSetValidation.forEach(el => {
            ValidatorsControl.appendValidator(controls['rec.' + el],
                ValidatorsControl.existValidator(VALIDATOR_TYPE.EXTENSION_DOT));
            ValidatorsControl.appendValidator(controls['rec.' + el],
                (control: AbstractControl): { [key: string]: any } => {
                    const v = control.value;
                    if (v) {
                        if (v.length > 255) {
                            return { valueError: 'Максимальная длинна 255 символ(а|ов)' };
                        }
                    }
                    return null;
                });
        });
    }
    unique(str) {
        const result = [];
        for (let index = 0; index < str.length; index++) {
            if (result.indexOf(str[index]) === -1) {
                result.push(str[index]);
            }
        }
        return result.join('');
    }
    // b-119380
    updateFormInput() {
        let newValueControl = this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].value;
        if (newValueControl && newValueControl.indexOf(this.validChengeValueStr) !== -1) {
            newValueControl = newValueControl.replace(this.validChengeValueStr, '');
            this.prepareData.rec['FILE_DESCRIPTION_VALID_CHARS'] = newValueControl;
            this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].setValue(newValueControl, );
            this.inputs['rec.FILE_DESCRIPTION_VALID_CHARS'].value = newValueControl;
        }
        if (!this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].value) {
            this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].setValue('');
            this.prepareData.rec['FILE_DESCRIPTION_REPLACE'] = '';
            this.inputs['rec.FILE_DESCRIPTION_REPLACE'].value = '';
        }
    }
    checkReplace()  {
        const validRepeat: string = this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].value;
        const valid: string = this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].value;
        if (valid && validRepeat && valid.indexOf(validRepeat) === -1) {
            const provElem: string = this.validChengeValueStr + 'й';
            if (provElem.indexOf(validRepeat.toLowerCase()) === -1) {
                return true;
            }
        }
        return false;
    }
    checkValid() {
        this.validValue = this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].value;
        if (this.validValue) {
            // b-119382
            this.validValue = this.validValue.replace(/[0-9a-zA-Zа-яА-Я\n]/g, '');
            this.validValue = this.unique(this.validValue);
            if (this.validValue.length !== this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].value.length) {
                return true;
            }
        }
        return false;
    }
    deletReplace() {
        this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].setValue('');
    }
    deletValid() {
        // b-119479
        this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].setValue(this.validValue);
        if (this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].value.length < 255) {
            this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].setErrors(null);
        }
    }
    validBlur() {
        if (!this.checkBlur) {
            if (this.checkValid()) {
                alert('В параметре "Допустимые символы" описания файлов есть повторяющиеся символы или буквы/цифры. Лишние будут удалены.');
                this.deletValid();
            }
            // b-119403
            this.replaceBlur();
        }
        this.checkBlur = false;
    }
    replaceBlur() {
        if (!this.checkBlur) {
            if (this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].value && this.checkReplace()) {
                alert('В параметре "Символ для замены" описания файлов введен не допустимый символ. Он будет удален');
                this.deletReplace();
            }
        }
        this.checkBlur = false;
    }
    preSubmit() {
        if (this.checkValid()) {
            alert('В параметре "Допустимые символы" описания файлов есть повторяющиеся символы или буквы/цифры. Лишние будут удалены.');
            this.deletValid();
            if (this.newData) {
                this.newData.rec['FILE_DESCRIPTION_VALID_CHARS'] = this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].value;
            }
            if (this.prepareData.rec['FILE_DESCRIPTION_VALID_CHARS'] === this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].value) {
                delete this.updateData['FILE_DESCRIPTION_VALID_CHARS'];
            }
            if (!this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].value) {
                this.updateData['FILE_DESCRIPTION_REPLACE'] = '';
            }
        }
        if (this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].valid && this.checkReplace()) {
            alert('В параметре "Символ для замены" описания файлов введен не допустимый символ. Он будет удален');
            this.deletReplace();
            if (this.newData && this.prepareData.rec['FILE_DESCRIPTION_REPLACE'] !== this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].value) {
                this.newData.rec['FILE_DESCRIPTION_REPLACE'] = this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].value;
                this.updateData['FILE_DESCRIPTION_REPLACE'] = this.newData.rec['FILE_DESCRIPTION_REPLACE'];
            }
            if (this.prepareData.rec['FILE_DESCRIPTION_REPLACE'] === this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].value) {
                delete this.updateData['FILE_DESCRIPTION_REPLACE'];
            }
        }
        // if (Object.keys(this.updateData).length !== 0) {
            this.submit();
        // }
        this.cancelEdit();
    }
    buttonDefault() {
        const strFile: string = this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].value;
        if (!strFile || strFile === this.defaultValidCharsFileDesc) {
            this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].setValue(this.defaultValidCharsFileDesc);
        } else {
            const result = confirm('В параметре есть не пустое значение. Заменить его значением по умолчанию?');
            if (result) {
                this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].setValue(this.defaultValidCharsFileDesc);
            }
        }
    }
    chenge($event) {
        const inputValue: string = this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].value;
        if ($event.keyCode === 32) {
            $event.preventDefault();
            $event.stopPropagation();
            this.mesInfoNew();
        }
        if ($event.keyCode !== 39 && $event.keyCode !== 37 && $event.keyCode !== 8 && $event.keyCode !== 46 && inputValue && inputValue.length === 1) {
            $event.preventDefault();
            $event.stopPropagation();
        }
    }

    cancelDown() {
        if (!this.btnError) {
            this.checkBlur = true;
        }
    }
    cancelUp() {
        this.checkBlur = false;
    }
    cancel() {
        if (this.isChangeForm || this.isChangeFormAttach) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.formAttach.reset();
            this.isChangeForm = false;
            this.isChangeFormAttach = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.init()
                .then(() => {
                    // b-119380
                    this.updateFormInput();
                    this.afterInit();
                })
                .catch(err => {
                    if (err.code !== 401) {
                        console.log(err);
                    }
                });
        } else {
            this.cancelEdit();
        }
    }
     mesInfoNew() {
        if (this.newMesTrue) {
            this.msgSrv.addNewMessage({
                type: 'info',
                title: 'Ввод данных',
                msg: 'Данный символ вводить нельзя.'
            });
            this.newMesTrue = false;
            setTimeout(() => {
                this.newMesTrue = true;
            }, 3000);
        }
    }
    /* chengeValid($event) {
        if (this.validChengeValueStr.indexOf($event.key.toLowerCase()) !== -1) {
            $event.preventDefault();
            $event.stopPropagation();
            this.mesInfoNew();
        }
    } */
    afterInit() {
        this.subscriptions.push(
            this.formAttachChoice.controls.attachFile.valueChanges
                .subscribe(value => {
                    if (value === 'rc') {
                        this.hiddenFieldAttach = false;
                    } else {
                        this.hiddenFieldAttach = true;
                    }
                })
        );
        this.subscriptions.push(
            this.form.controls['rec.FILE_DESCRIPTION_VALID_CHARS'].valueChanges
                .subscribe(value => {
                    if (!value) {
                        this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].setValue('');
                        setTimeout(() => {
                            this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].disable({emitEvent: false}); 
                        }, 0);
                    } else {
                        this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].enable({emitEvent: false});
                    }
                })
        );
        // b-119393
        this.subscriptions.push(
            this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].valueChanges
                .subscribe(value => {
                    if (value && value.length > 1) {
                        this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].setValue(value[value.length - 1], {emitEvent: false});
                    }
                    if (this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].value === ' ') {
                        this.form.controls['rec.FILE_DESCRIPTION_REPLACE'].setValue('', {emitEvent: false});
                        this.mesInfoNew();
                    }
                })
        );
        this.paramApiSrv.getData(Object.assign({}, this.queryFileConstraint))
            .then(data => {
                this.dataAttachDb = data;
                this.prepDataAttachField(data);
                this.inputAttach = this.getInputAttach();
                this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
                this._updateValidators(this.formAttach.controls);
                this.subscriptions.push(
                    this.formAttach.valueChanges
                        .pipe(
                            debounceTime(200)
                        )
                        .subscribe(newValue => {
                            let changed = false;
                            Object.keys(newValue).forEach(path => {
                                if (this.changeByPathAttach(path, newValue[path])) {
                                    changed = true;
                                }
                            });
                            this.formChanged.emit(changed);
                            this.isChangeFormAttach = changed;
                        })
                );
                this.subscriptions.push(
                    this.formAttach.statusChanges.subscribe(status => {
                        if (this._currentFormAttachStatus !== status) {
                            this.formInvalid.emit(status === 'INVALID');
                        }
                        this._currentFormAttachStatus = status;
                    })
                );
                this.cancelEdit();
            })
            .catch(err => {
                this._errorSrv.errorHandler(err);
            });
    }

    submit() {
        if (this.newData || this.newDataAttach) {
            if (this.newData && this.newData.rec['FILE_DESCRIPTION_VALID_CHARS'].indexOf(this.validChengeValueStr) && this.updateData['FILE_DESCRIPTION_VALID_CHARS']) {
                this.newData.rec['FILE_DESCRIPTION_VALID_CHARS'] = this.newData.rec['FILE_DESCRIPTION_VALID_CHARS'] + this.validChengeValueStr;
                this.updateData['FILE_DESCRIPTION_VALID_CHARS'] = this.newData.rec['FILE_DESCRIPTION_VALID_CHARS'];
            }
            let dataRes = [];
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this.isChangeFormAttach = false;
            if (this.updateData) {
                dataRes = this.createObjRequest();
            }
            this.updateData = {};
            if (this.updateDataAttach) {
                const dataAttachReq = this.dataAttachObjectReq(this.updateDataAttach);
                dataRes = [...dataRes, ...dataAttachReq];
                this.updateDataAttach = {};
                /* this.dataAttachDb.forEach((item) => {
                    console.log(item);
                    dataRes.push({
                        method: 'MERGE',
                        requestUri: `DOCGROUP_CL('0.')/DG_FILE_CONSTRAINT_List('${item.CompositePrimaryKey}')`,
                        data: {
                            MAX_SIZE: this.newDataAttach.rec[`${item.CATEGORY}_MAX_SIZE`],
                            ONE_FILE: this.newDataAttach.rec[`${item.CATEGORY}_ONE_FILE`],
                            EXTENSIONS: this.newDataAttach.rec[`${item.CATEGORY}_EXTENSIONS`]
                        }
                    });
                }); */
            }
            this.paramApiSrv
                .setData(dataRes)
                .then(data => {
                    this.formAttach.reset();
                    this.ngOnDestroy();
                    this.init()
                    .then(() => {
                        // b-119380
                        this.updateFormInput();
                        this.afterInit();
                    })
                    .catch(err => {
                        if (err.code !== 401) {
                            console.log(err);
                        }
                    });
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                .catch(data => {
                    this._errorSrv.errorHandler(data);
                });
        }
    }
    getInputAttach() {
        return this.dataSrv.getInputs(this.prepInputsAttach, this.prepDataAttach);
    }
    prepDataAttachField(data) {
        data.forEach(field => {
            this.prepDataAttach.rec[field.CATEGORY + '_MAX_SIZE'] = field.MAX_SIZE;
            this.prepDataAttach.rec[field.CATEGORY + '_ONE_FILE'] = field.ONE_FILE;
            this.prepDataAttach.rec[field.CATEGORY + '_EXTENSIONS'] = field.EXTENSIONS;
        });
    }

    createDataRequset(arr, data) {
        const obj = {};
        arr.map((item) => {
            if (/MAX_SIZE/.test(item)) {
                obj['MAX_SIZE'] = data[item];
            } else if (/ONE_FILE/.test(item)) {
                obj['ONE_FILE'] = data[item];
            } else {
                obj['EXTENSIONS'] = data[item];
            }
        });

        return obj;

    }

    dataAttachObjectReq(data) {
        const res = [];
        const keys = Object.keys(data);
        const DOC = keys.filter((item) => /DOC/.test(item));
        const RESOLUTION = keys.filter((item) => /RESOLUTION/.test(item));
        const REPLY = keys.filter((item) => /REPLY/.test(item));
        const PRJ_RC = keys.filter((item) => /PRJ_RC/.test(item));
        const PRJ_VISA_SIGN = keys.filter((item) => /PRJ_VISA_SIGN/.test(item));

        if (DOC.length) {
            res.push({
                method: 'MERGE',
                requestUri: `DOCGROUP_CL('0.')/DG_FILE_CONSTRAINT_List('0. DOC_RC')`,
                data: this.createDataRequset(DOC, data)
            });
        }
        if (RESOLUTION.length) {
            res.push({
                method: 'MERGE',
                requestUri: `DOCGROUP_CL('0.')/DG_FILE_CONSTRAINT_List('0. RESOLUTION')`,
                data: this.createDataRequset(RESOLUTION, data)
            });
        }
        if (REPLY.length) {
            res.push({
                method: 'MERGE',
                requestUri: `DOCGROUP_CL('0.')/DG_FILE_CONSTRAINT_List('0. REPLY')`,
                data: this.createDataRequset(REPLY, data)
            });
        }
        if (PRJ_RC.length) {
            res.push({
                method: 'MERGE',
                requestUri: `DOCGROUP_CL('0.')/DG_FILE_CONSTRAINT_List('0. PRJ_RC')`,
                data: this.createDataRequset(PRJ_RC, data)
            });
        }
        if (PRJ_VISA_SIGN.length) {
            res.push({
                method: 'MERGE',
                requestUri: `DOCGROUP_CL('0.')/DG_FILE_CONSTRAINT_List('0. PRJ_VISA_SIGN')`,
                data: this.createDataRequset(PRJ_VISA_SIGN, data)
            });
        }
        return res;
    }

    prepareInputField(fields) {
        const inputs = { _list: [], rec: {} };
        fields.forEach(field => {
            inputs._list.push(field.key);
            inputs.rec[field.key] = {
                title: field.title,
                type: E_FIELD_TYPE[field.type],
                foreignKey: field.key,
                pattern: field.pattern,
                length: field.length,
                options: field.options,
                readonly: field.readonly
            };
        });
        return inputs;
    }
    edit() {
        this.form.enable({ emitEvent: false });
        this.formAttach.enable({ emitEvent: false });
        this.formAttachChoice.enable({ emitEvent: false });
        this.editMode = true;
    }
    cancelEdit() {
        this.form.disable({ emitEvent: false });
        this.formAttach.disable({ emitEvent: false });
        this.formAttachChoice.disable({ emitEvent: false });
        this.editMode = false;
    }
    changeByPathAttach(path: string, value: any) {
        const key = path.split('_').pop();
        const fieldName = path.split('.')[1];
        let _value = null;
        if (key === 'FILE') {
            _value = +value;
        } else if (key === 'SIZE') {
            _value = (!value) ? null : +value;
        } else if (key === 'EXTENSIONS') {
            _value = value ? value : null;
        } else {
            _value = value;
        }
        this.newDataAttach = EosUtils.setValueByPath(this.newDataAttach, path, _value);
        const oldValue = EosUtils.getValueByPath(this.prepDataAttach, path, false);
        if (oldValue !== _value) {
            this.updateDataAttach[fieldName] = _value;
        } else if (oldValue === _value && this.updateDataAttach[fieldName] !== undefined) {
            delete this.updateDataAttach[fieldName];
        }
        return _value !== oldValue;
    }
    showInfoAttachFiles() {
        // if (this.editMode) {
        //     this.infoAttachFilesModal.show();
        // }
        this.infoAttachFilesModal.show();
    }
    hideInfoAttachFiles() {
        this.infoAttachFilesModal.hide();
    }
}
