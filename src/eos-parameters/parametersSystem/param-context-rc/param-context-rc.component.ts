import { EosUtils } from 'eos-common/core/utils';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from './../shared/consts/eos-parameters.const';
import { FormGroup, FormControl } from '@angular/forms';
import { CONTEXT_RC_PARAM } from './../shared/consts/context-rc-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { Component, Injector, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'eos-param-context-rc',
    templateUrl: 'param-context-rc.component.html'
})
export class ParamContextRcComponent extends BaseParamComponent implements OnInit, OnDestroy {
    @Input() btnError;
    masDisable: any[] = [];
    masDisableContextChoice: any[] = [];
    formContextChoice: FormGroup;
    formReadonli: boolean;
    hiddenFilesContext = false;
    hiddenInputRadioResolution: boolean;
    _unsubsCribe: Subject<any> = new Subject();
    inputChoiceFiles = {
        key: 'contextFile',
        label: 'Формировать и индексировать файлы контекста'
    };
    inputcontextResolution = {
        key: 'contextResolution',
        label: 'Резолюции'
    };
    inputChoiceContextRC = [
        {
            value: 'rc',
            text: 'РК документа'
        },
        {
            value: 'prj-rc',
            text: 'РК проекта документа'
        }
    ];
    constructor(injector: Injector) {
        super(injector, CONTEXT_RC_PARAM);
        this.descriptorSrv.saveData$
        .pipe(
            takeUntil(this._unsubsCribe)
        )
        .subscribe(() => {
            this.submit();
        });
    }
    ngOnDestroy() {
        this._unsubsCribe.next();
        this._unsubsCribe.complete();
    }

    ngOnInit() {
        this.queryObj = this.getObjQueryInputsField(['CONTEXT_SECTIONS_ENABLED']);
        this.prepInputs = this.getObjectInputFields(this.constParam.fields);
        this.formContextChoice = new FormGroup({
            contextFile: new FormControl(true),
            contextRC: new FormControl('rc'),
            contextResolution: new FormControl(true)
        });
        this.initContext();
    }
    initContext() {
        return this.getData(Object.assign({}, this.queryObj))
        .then(dataDb => {
            const data = {};
            if (dataDb[0].PARM_VALUE !== '' && dataDb[0].PARM_VALUE !== null) {
                dataDb[0].PARM_VALUE.slice(1, -1).split(',').forEach(key => {
                    data[key] = true;
                });
                return data;
            }
            return null;
        })
        .then(data => {
            this.prepareData = this.prepDataContext(data);
            this.inputs = this.getInputs();
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.subscribeChangeForm();
                this.subscribeChoiceForm();
                if (!data) {
                    this.formContextChoice.controls.contextFile.patchValue(false);
                }
                this.cancelEdit();
            })
            .catch(err => {
                if (err.code !== 434) {
                    console.log(err);
                }
            });
    }
    prepDataContext(data) {
        const prepareData = { rec: {} };
        if (data) {
            this.prepInputs._list.forEach(key => {
                if (key === 'RESOLUTION') {
                    const resol: any = data.hasOwnProperty('RESOLUTION_ALL') ? 'RESOLUTION_ALL' : false ||
                        data.hasOwnProperty('RESOLUTION_FIRST') ? 'RESOLUTION_FIRST' : false;
                    if (resol) {
                        prepareData.rec[key] = resol;
                    } else {
                        prepareData.rec[key] = false;
                        this.formContextChoice.controls.contextResolution.patchValue(false);
                    }
                } else {
                    prepareData.rec[key] = data.hasOwnProperty(key);
                }
            });
            return prepareData;
        }
        this.prepInputs._list.forEach(key => {
            prepareData.rec[key] = false;
        });
        return prepareData;
    }
    getInputs() {
        return this.dataSrv.getInputs(this.prepInputs, this.prepareData);
    }
    cancel() {
        if (this.isChangeForm) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.initContext();
        }
        this.cancelEdit();
    }
    submit() {
        if (this.newData) {
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this.paramApiSrv
                .setData(this.createObjRequestCotext())
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
    changeByPath(path: string, value: any) {
        this.newData = EosUtils.setValueByPath(this.newData, path, value);
        const oldValue = EosUtils.getValueByPath(this.prepareData, path, false);

        if (oldValue !== value) {
            // console.log('changed', path, oldValue, 'to', value, this.prepareData.rec, this.newData.rec);
        }
        return value !== oldValue;
    }
    createObjRequestCotext() {
        let value = '';
        for (const key in this.newData.rec) {
            if (key === 'RESOLUTION' && this.newData.rec[key]) {
                value = value || ',';
                value += this.newData.rec[key] + ',';
            } else if (this.newData.rec[key]) {
                value = value || ',';
                value += key + ',';
            }
        }
        return [{
            method: 'MERGE',
            requestUri: `SYS_PARMS(-99)/USER_PARMS_List('-99 CONTEXT_SECTIONS_ENABLED')`,
            data: {
                PARM_VALUE: value
            }
        }];
    }
    subscribeChangeForm() {
        this.subscriptions.push(
            this.form.valueChanges
                .pipe(
                    debounceTime(200)

                )
                .subscribe(newVal => {
                    if (!newVal.hasOwnProperty('rec.RESOLUTION')) {
                        newVal['rec.RESOLUTION'] = this.form.controls['rec.RESOLUTION'].value;
                    }
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
    edit() {
        if (this.formContextChoice.controls.contextFile.value) {
            this.form.enable({ emitEvent: false });
            this.formContextChoice.enable({ emitEvent: false });
        } else {
            this.formContextChoice.controls.contextFile.enable({ emitEvent: false });
        }
    }
    cancelEdit() {
        this.form.disable({ emitEvent: false });
        this.formContextChoice.disable({ emitEvent: false });
    }
    subscribeChoiceForm() {
        this.subscriptions.push(
            this.formContextChoice.controls.contextFile.valueChanges
                .subscribe(value => {
                    if (value) {
                        setTimeout(() => {
                            this.form.enable();
                        }, 0);
                        this.formReadonli = false;
                        this.formContextChoice.controls.contextRC.enable();
                        this.formContextChoice.controls.contextResolution.enable();
                    } else {
                        this.prepInputs._list.forEach(key => {
                            this.form.controls['rec.' + key].patchValue(false);
                        });
                        this.formContextChoice.controls.contextResolution.patchValue(false);
                        setTimeout(() => {
                            this.form.disable();
                        }, 0);
                        this.formContextChoice.controls.contextRC.disable();
                        this.formContextChoice.controls.contextResolution.disable();
                        this.formReadonli = true;
                    }
                })
        );
        this.subscriptions.push(
            this.formContextChoice.controls.contextRC.valueChanges
                .subscribe(value => {
                    if (value === 'rc') {
                        this.hiddenFilesContext = false;
                    } else {
                        this.hiddenFilesContext = true;
                    }
                })
        );
        this.subscriptions.push(
            this.formContextChoice.controls.contextResolution.valueChanges
                .subscribe(value => {
                    if (value) {
                        setTimeout(() => {
                            this.form.controls['rec.RESOLUTION'].patchValue('RESOLUTION_ALL');
                            this.form.controls['rec.RESOLUTION'].enable();
                        }, 0);
                        this.hiddenInputRadioResolution = false;
                    } else {
                        this.form.controls['rec.RESOLUTION'].patchValue(false);
                        this.hiddenInputRadioResolution = true;
                        setTimeout(() => {
                            this.form.controls['rec.RESOLUTION'].disable({ emitEvent: true });
                        }, 0);
                    }
                })
        );
    }
}
