import { EosUtils } from 'eos-common/core/utils';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from './../shared/consts/eos-parameters.const';
import { FormGroup, FormControl } from '@angular/forms';
import { CONTEXT_RC_PARAM } from './../shared/consts/context-rc-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { Component, Injector, OnInit } from '@angular/core';

@Component({
    selector: 'eos-param-context-rc',
    templateUrl: 'param-context-rc.component.html'
})
export class ParamContextRcComponent extends BaseParamComponent implements OnInit {
    formContextChoice: FormGroup;
    formReadonli: boolean;
    hiddenFilesContext = false;
    hiddenInputRadioResolution: boolean;
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
    constructor( injector: Injector ) {
        super(injector, CONTEXT_RC_PARAM);
    }

    ngOnInit() {
        this.queryObj = this.getObjQueryInputsField(['CONTEXT_SECTIONS_ENABLED']);
        this.prepInputs = this.getObjectInputFields(this.constParam.fields);
        this.formContextChoice = new FormGroup({
            contextFile: new FormControl(''),
            contextRC: new FormControl('rc'),
            contextResolution: new FormControl('')
        });
        this.initContext();
    }
    initContext() {
        return this.getData(Object.assign({}, this.queryObj))
        .then(dataDb => {
            const data = {};
            if (dataDb[0].PARM_VALUE !== '' && dataDb[0].PARM_VALUE !== null) {
                /* Вторая проверка под вопросом, так как OData пустую строку записывает как NULL*/
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
            if (data) {
                this.formContextChoice.controls.contextFile.patchValue(true);
            } else {
                this.formContextChoice.controls.contextFile.patchValue(false);
            }
        })
        .catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });
    }
    prepDataContext(data) {
        const prepareData = {rec: {}};
        if (data) {
            this.prepInputs._list.forEach(key => {
                if (key === 'RESOLUTION') {
                    let resol: any = data.hasOwnProperty('RESOLUTION_ALL') ? 'RESOLUTION_ALL' : false;
                    resol = data.hasOwnProperty('RESOLUTION_FIRST') ? 'RESOLUTION_FIRST' : false;
                    if (resol) {
                        prepareData.rec[key] = resol;
                        this.formContextChoice.controls.contextResolution.patchValue(true);
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
                .catch(data => console.log(data));
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
        console.log(this.newData.rec);
        for (const key in this.newData.rec) {
            if (key === 'RESOLUTION' && this.newData.rec[key]) {
                console.log(key);
                value = value || ',';
                value += this.newData.rec[key] + ',';
            } else if (this.newData.rec[key]) {
                console.log(key);
                value = value || ',';
                value += key + ',';
            }
        }
        return [{
            method: 'POST',
            requestUri: `SYS_PARMS_Update?PARM_NAME='CONTEXT_SECTIONS_ENABLED'&PARM_VALUE='${value}'`
        }];
    }
    subscribeChangeForm() {
        this.subscriptions.push(
            this.form.valueChanges
                .debounceTime(200)
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
                            this.form.controls['rec.RESOLUTION'].enable();
                        }, 0);
                        this.hiddenInputRadioResolution = false;
                    } else {
                        this.form.controls['rec.RESOLUTION'].patchValue(false);
                        this.hiddenInputRadioResolution = true;
                        setTimeout(() => {
                            this.form.controls['rec.RESOLUTION'].disable({emitEvent: true});
                        }, 0);
                    }
                })
        );
    }
}
