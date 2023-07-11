import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CONVERSION_PARAM } from '../../../../eos-parameters/parametersSystem/shared/consts/conversion.const';
import { IConverterParam } from '../../../../eos-parameters/interfaces/app-setting.interfaces';

@Component({
    selector: 'eos-param-conversion-card',
    templateUrl: 'param-conversion-card.component.html',

})
export class ParamConversionCardComponent implements OnInit, OnDestroy {
    @Input() form: FormGroup;
    @Input() allData: any[];
    @Input() inputs;
    @Input() dataProfile;
    @Input() prepareData;
    @Output() submitEmit = new EventEmitter();
    @Output() cancelEmit = new EventEmitter();
    public isLoading = false;
    public errorPass = false;
    public title;
    private ngUnsubscribe: Subject<any> = new Subject();

    ngOnInit(): void {
        this.isLoading = true;
        if (this.dataProfile) {
            this.title = 'Редактирование cлужбы конвертации';
            this.editProfile();
        }
    }
    ngOnDestroy() {
        this.form.controls['rec.LibraryName'].setValidators([Validators.required]);
        this.form.controls['rec.LibraryDirectory'].setValidators([Validators.required]);
        this.form.controls['rec.MaxCacheSize'].setValidators([Validators.required]);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    cancel() {
        this.cancelEmit.next();
    }
    submit() {
        this.submitEmit.next();
    }
    editProfile() {
        this.updatePrepareData(this.dataProfile);
        this.updateFormForPrepare();
        this.isLoading = false;
    }
    addProfile() {
        CONVERSION_PARAM.fields.forEach((item) => {
            this.form.controls[`rec.${item.key}`].setValue(item.value, { emitEvent: false });
        });
        this.isLoading = false;
    }
    updatePrepareData(newConverter: IConverterParam) {
        Object.keys(newConverter).forEach((key) => {
            if (key === 'Library') {
                this.prepareData.rec['LibraryName'] = newConverter[key] ? newConverter[key].Name : '';
                this.prepareData.rec['LibraryDirectory'] = newConverter[key] ? newConverter[key].Directory : '';
            } else if (key === 'IsActive') {
                this.prepareData.rec[key] = newConverter[key] ? true : false;
            } else {
                this.prepareData.rec[key] = newConverter[key] === null || newConverter[key] === undefined ? '' : newConverter[key];
            }
        });
    }
    updateFormForPrepare() {
        Object.keys(this.prepareData.rec).forEach((key) => {
            if (this.form.controls['rec.' + key]) {
                this.form.controls['rec.' + key].setValue(this.prepareData.rec[key], { emitEvent: false });
            }
        });
    }
}
