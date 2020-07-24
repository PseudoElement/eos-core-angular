import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE, } from '../shared/consts/eos-parameters.const';
import {CONVERSION_PARAM} from '../shared/consts/conversion.const';
import {Validators} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

@Component({
    selector: 'eos-parameters-conversion',
    templateUrl: 'param-conversion.component.html',
})
export class ParamConversionComponent extends BaseParamComponent implements OnInit {
    @Input() btnError;
    public editMode = false;
    public isLoading = true;
    public masDisable: any[] = [];
    public oldData: any;
    private maxLength2000 = [
        Validators.maxLength(2000)
    ];
    private outputSizeValid = [
        Validators.pattern(/[1-9][0-9]*/),
        Validators.maxLength(255)
    ];
    constructor( injector: Injector
    ) {
        super( injector, CONVERSION_PARAM);
    }

    subscribeChangeForm() {
        this.subscriptions.push(
            this.form.valueChanges
                .pipe(
                    debounceTime(200)
                )
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

    ngOnInit() {
       this.init();
    }

    init(): Promise<any> {
        this.isLoading = false;
        this.prepareDataParam();
        return  this.getData(this.queryObj)
        .then(data => {
            this.prepareData = this.convData(data);
            this.prepareData.rec.CONVERTER_USE = this.prepareData.rec.CONVERTER_USE !== '0';
            this.inputs = this.dataSrv.getInputs(this.prepInputs, this.prepareData);
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            this.form.controls['rec.CONVERTER_USE'].disable();
            this.setStartValidators();
            this.isLoading = true;
            this.subscribeChangeForm();
        })
        .catch(err => {
            this.prepareData = this.convData([]);
            this.inputs = this.dataSrv.getInputs(this.prepInputs, this.prepareData);
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            this.subscribeChangeForm();
            this.cancelEdit();
            this.isLoading = true;
            throw err;
        });
    }

    setStartValidators() {
        this.form.controls['rec.CONVERTER_INPUT_DIR'].setValidators(this.maxLength2000);
        this.form.controls['rec.CONVERTER_OUTPUT_DIR'].setValidators(this.maxLength2000);
        this.form.controls['rec.CONVERTER_TEMP_DIR'].setValidators(this.maxLength2000);
        this.form.controls['rec.CONVERTER_OUTPUT_SIZE'].setValidators(this.outputSizeValid);
    }

    edit() {
        this.form.enable({ emitEvent: false });
        this.editMode = true;
    }

    cancelEdit() {
        this.masDisable = [];
        Object.keys(this.form.controls).forEach(key => {
            if (!this.form.controls[key].disabled) {
                this.masDisable.push(key);
            }
        });
        this.form.disable({ emitEvent: false });
    }

    preSubmit() {
        const invalidControls = [];
        if (this.form.controls['rec.CONVERTER_USE'].value) {
            if (!this.form.controls['rec.CONVERTER_INPUT_DIR'].value) {
                invalidControls.push('Поле «Папка входящих файлов» не заполнено.');
            }
            if (!this.form.controls['rec.CONVERTER_OUTPUT_DIR'].value) {
                invalidControls.push('Поле «Папка результатов конвертации» не заполнено.');
            }
            if (!this.form.controls['rec.CONVERTER_TEMP_DIR'].value) {
                invalidControls.push('Поле «Папка временных файлов» не заполнено.');
            }
            if (!this.form.controls['rec.CONVERTER_OUTPUT_SIZE'].value) {
                invalidControls.push('Поле «Максимальный размер папки результатов, Гб» не заполнено.');
            }
        }

        if (invalidControls.length) {
            alert(`${invalidControls.join('\n')} `);
        } else {
            this.submit();
        }
    }

    submit() {
        this.isLoading = false;

        if (!this.newData) {
            this.cancel();
            return;
        }

        this.newData.rec.CONVERTER_USE = this.newData.rec.CONVERTER_USE === 'YES' ? 1 : 0;
        this.paramApiSrv.setData(this.createObjRequest())
            .then(() => {
                this.prepareData.rec = Object.assign({}, this.newData.rec);
                this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                this.formChanged.emit(false);
                this.cancelEdit();
                this.isLoading = true;
                this.editMode = false;
            })
            .catch(er => {
                this.formChanged.emit(true);
                this.isChangeForm = true;
                this.editMode = true;
                this.isLoading = true;
                this.msgSrv.addNewMessage({
                    type: 'danger',
                    title: 'Ошибка сервера',
                    msg: er.message ? er.message : er
                });
                this.cancelEdit();
            });
    }
    cancel() {
        this.cancelEdit();
        this.isLoading = false;
        if (this.isChangeForm) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.init();
        }
        this.editMode = true;
        this.isLoading = true;
    }

    changeValidators() {
        // if (this.form.controls['rec.CONVERTER_USE'].value) {
        //     this.form.controls['rec.CONVERTER_INPUT_DIR'].setValidators([...this.maxLength2000, Validators.required]);
        //     this.form.controls['rec.CONVERTER_OUTPUT_DIR'].setValidators([...this.maxLength2000, Validators.required]);
        //     this.form.controls['rec.CONVERTER_TEMP_DIR'].setValidators([...this.maxLength2000, Validators.required]);
        //     this.form.controls['rec.CONVERTER_OUTPUT_SIZE'].setValidators([...this.outputSizeValid, Validators.required]);
        // } else {
        //     this.setStartValidators();
        // }
        // this.edit();
    }
}
