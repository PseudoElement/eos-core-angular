import { EosUtils } from 'eos-common/core/utils';
import { E_FIELD_TYPE } from 'eos-parameters/parametersSystem/shared/interfaces/parameters.interfaces';
import { FormGroup, FormControl } from '@angular/forms';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from './../shared/consts/eos-parameters.const';
import { FILES_PARAM } from '../shared/consts/files-consts';
import { BaseParamComponent } from '../shared/base-param.component';
import { Component, Injector } from '@angular/core';

@Component({
    selector: 'eos-param-files',
    templateUrl: 'param-files.component.html'
})
export class ParamFielsComponent extends BaseParamComponent {
    hiddenFieldPath = false;
    formAttachChoice: FormGroup;
    _currentFormAttachStatus;
    dataAttachDb;
    prepDataAttach = {rec: {}};
    inputAttach;
    hiddenFieldAttach = false;
    formAttach: FormGroup;
    prepInputsAttach;
    isChangeFormAttach = false;
    newDataAttach;
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
        DG_FILE_CONSTRAINT: {
            criteries: {
                ISN_DOCGROUP: '0'
            }
        }
    };
    constructor( injector: Injector ) {
        super(injector, FILES_PARAM);
        this.init()
        .then(() => {
            this.formAttachChoice = new FormGroup({
                attachFile: new FormControl('rc')
            });
             this.prepInputsAttach = this.prepareInputField(FILES_PARAM.fieldsChild);
            this.afterInit();
        });
    }
    cancel() {
        if (this.isChangeForm || this.isChangeFormAttach) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.isChangeFormAttach = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.init()
            .then(() => {
                this.afterInit();
            });
        }
    }
    afterInit() {
        if (this.form.controls['rec.EDMSPARM'].value !== 'STORAGE') {
            this.hiddenFieldPath = true;
        }
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
        this.paramApiSrv.getData(Object.assign({}, this.queryFileConstraint))
        .then(data => {
            this.dataAttachDb = data;
            this.prepDataAttachField(data);
            this.inputAttach = this.getInputAttach();
            this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
            this.subscriptions.push(
                this.formAttach.valueChanges
                .debounceTime(200)
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
        })
        .catch(err => {
            if (err.code === 434) {
                this._router.navigate(['/login']);
            }
            console.log(err);
        });
    }
    submit() {
        if (this.newData || this.newDataAttach) {
            let dataRes = [];
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this.isChangeFormAttach = false;
            if (this.newData) {
                dataRes = this.createObjRequest();
            }
            if (this.newDataAttach) {
                this.dataAttachDb.forEach((item) => {
                    dataRes.push({
                        method: 'MERGE',
                        requestUri: `DOCGROUP_CL('0.')/DG_FILE_CONSTRAINT_List('${item.CompositePrimaryKey}')`,
                        data: {
                            MAX_SIZE: this.newDataAttach.rec[`${item.CATEGORY}_MAX_SIZE`],
                            ONE_FILE: this.newDataAttach.rec[`${item.CATEGORY}_ONE_FILE`],
                            EXTENSIONS: this.newDataAttach.rec[`${item.CATEGORY}_EXTENSIONS`]
                        }
                    });
                });
            }
            this.paramApiSrv
                .setData(dataRes)
                .then(data => {
                    if (this.newData) {
                        this.prepareData.rec = Object.assign({}, this.newData.rec);
                    }
                    if (this.newDataAttach) {
                        this.newDataAttach.rec = Object.assign({}, this.newDataAttach.rec);
                    }
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                .catch(data => console.log(data));
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
    prepareInputField(fields) {
        const inputs = {_list: [], rec: {}};
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
    changeByPathAttach(path: string, value: any) {
        const key = path.split('_').pop();
        let _value = null;
        if (key === 'FILE') {
            _value = +value;
        } else if (key === 'SIZE') {
            _value = (!value || value === '0') ? null : value;
        } else if (key === 'EXTENSIONS') {
            _value = value ? value : '';
        } else {
            _value = value;
        }
        this.newDataAttach = EosUtils.setValueByPath(this.newDataAttach, path, _value);
        const oldValue = EosUtils.getValueByPath(this.prepDataAttach, path, false);

        if (oldValue !== _value) {
            // console.log('changed', path, oldValue, 'to', _value, this.prepDataAttach.rec);
        }
        return _value !== oldValue;
    }
}
