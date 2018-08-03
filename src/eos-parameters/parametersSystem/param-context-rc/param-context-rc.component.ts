import { EosUtils } from 'eos-common/core/utils';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from './../shared/consts/eos-parameters.const';
import { FormGroup, FormControl } from '@angular/forms';
import { CONTEXT_RC_PARAM } from './../shared/consts/context-rc-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { Component, Injector } from '@angular/core';

@Component({
    selector: 'eos-param-context-rc',
    templateUrl: 'param-context-rc.component.html'
})
export class ParamContextRcComponent extends BaseParamComponent {
    formContextChoice: FormGroup;
    formReadonli: boolean;
    tempData; // deleted mi
    hiddenFilesContext = false;
    inputChoiceFiles = {
            key: 'contextFile',
            label: 'Форматировать и индексировать файлы контекста'
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
                this.tempData = dataDb[0].PARM_VALUE
                .slice(1, -1).split(','); // deleted mi
                return data;
            }
            return null;
        })
        .then(data => {
            // console.log(data);
            this.prepareData = this.prepDataContext(data);
            this.inputs = this.getInputs();
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            this.subscribeChangeForm();
            this.subscribeChoiceForm();
            // console.log(data);
            if (data) {
                this.formContextChoice.controls.contextFile.patchValue(true);
            } else {
                this.formContextChoice.controls.contextFile.patchValue(false);
            }
            // console.log(this.form);
        })
        .catch(err => {
            console.log(err);
        });
    }
    prepDataContext(data) {
        const prepareData = {rec: {}};
        if (data) {
            this.prepInputs._list.forEach(key => {
                prepareData.rec[key] = data.hasOwnProperty(key);
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
        console.log('cansel', this.isChangeForm);
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
            // console.log(this.createObjRequestCotext());
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this.paramApiSrv
                .setData(this.createObjRequestCotext())
                .then(data => {
                    this.prepareData.rec = Object.assign({}, this.newData.rec);
                    console.log(data);
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
        for (const key in this.newData.rec) {
            if (key) {
                if (this.newData.rec[key] === true) {
                    value = value === '' ? ',' : value;
                    value += key + ',';
                }
            }
        }
        console.log(value);
        return [{
            method: 'POST',
            requestUri: `SYS_PARMS_Update?PARM_NAME='CONTEXT_SECTIONS_ENABLED'&PARM_VALUE='${value}'`
        }];
    }
    subscribeChoiceForm() {
        this.subscriptions.push(
            this.formContextChoice.controls.contextFile.valueChanges
                .subscribe(value => {
                    // console.log('chenged choice files', value);
                    if (value) {
                        this.form.enable();
                        this.formReadonli = false;
                        this.formContextChoice.controls.contextRC.enable();
                        this.formContextChoice.controls.contextResolution.enable();
                    } else {
                        this.prepInputs._list.forEach(key => {
                            this.form.controls['rec.' + key].patchValue(false);
                        });
                        setTimeout(() => {
                            this.form.disable();
                        }, 0);
                        this.formContextChoice.controls.contextRC.disable();
                        this.formContextChoice.controls.contextResolution.disable();
                        // console.log(this.form);
                        this.formReadonli = true;
                    }
                })
        );
    }
}
