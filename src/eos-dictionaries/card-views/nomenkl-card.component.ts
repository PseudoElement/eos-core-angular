import {Component, Injector, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import {AbstractControl, ValidatorFn} from '@angular/forms';

@Component({
    selector: 'eos-nomenkl-card',
    templateUrl: 'nomenkl-card.component.html',
    styleUrls: ['./nomenkl-card.component.scss']
})

export class NomenklCardComponent extends BaseCardEditComponent implements OnChanges, OnInit {

    private previousValues: SimpleChanges;

    constructor(
        injector: Injector,
        // private _apiSrv: PipRX,
    ) {
        super(injector);
    }
    ngOnInit(): void {
        super.ngOnInit();
        const v = [this.endYearValueValidator()];
        if (this.form.controls['rec.END_YEAR'].validator) {
            v.push(this.form.controls['rec.END_YEAR'].validator);
        }
        this.form.controls['rec.END_YEAR'].setValidators(v);
        this.previousValues = {};
        this.previousValues['rec.END_YEAR'] = this.form.controls['rec.END_YEAR'].value;
        this.previousValues['rec.YEAR_NUMBER'] = this.form.controls['rec.YEAR_NUMBER'].value;
        setTimeout(() => {
            this._updateButtons();
        });

    }

    endYearValueValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            let error = null;
            if (this.form.controls['rec.END_YEAR'].value) {
                if (Number(this.form.controls['rec.END_YEAR'].value) < Number(this.form.controls['rec.YEAR_NUMBER'].value)) {
                    error = 'Год задан неверно';
                }
            }
            return error ? {valueError: error} : null;
        };
    }


    onChangeButtPer($event) {
        if (this.form.controls['rec.buttPer'].value === 0) {
            this.form.controls['rec.END_YEAR'].setValue(this.form.controls['rec.YEAR_NUMBER'].value);
        } else {
            this.form.controls['rec.END_YEAR'].setValue(null);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.form) {

        //     const i = this.inputs['rec.SECURITY'];
        //     const val = this.getValue('rec.SECURITY');
        //     if (i && i.options) {
        //         i.options = i.options.filter(o => (!o.disabled || val === o.value));
        //     }

        //     // i.options = [];
        //     // const req = {'SECURITY_CL': [], orderby: 'WEIGHT'};
        //     // this._apiSrv
        //     //     .read(req)
        //     //     .then((rdata: any[]) => {
        //     //         rdata.forEach((d) => {
        //     //             i.options.push({ title: d['CLASSIF_NAME'], value: d['CLASSIF_NAME'], disabled: d['DELETED']});
        //     //         });
        //     //     });
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
        setTimeout(() => {
            this._updateButtons();
        }, 100);
    }

    private updateForm(changes: SimpleChanges) {
        if ((Number(this.previousValues['rec.END_YEAR']) !== Number(changes['rec.END_YEAR']))) {
            this.previousValues['rec.END_YEAR'] = this.form.controls['rec.END_YEAR'].value;
            this._updateButtons();
        }
        if ((Number(this.previousValues['rec.YEAR_NUMBER']) !== Number(changes['rec.YEAR_NUMBER']))) {
            this.previousValues['rec.YEAR_NUMBER'] = this.form.controls['rec.YEAR_NUMBER'].value;
            this.form.controls['rec.END_YEAR'].updateValueAndValidity();
            this._updateButtons();
        }
    }

    private _updateButtons() {
        let ys: number;
        let ye1: number;
        let p = true;
        ye1 = Number(this.form.controls['rec.END_YEAR'].value);
        ys = Number(this.form.controls['rec.YEAR_NUMBER'].value);
        if (ye1 !== ys) {
            p = false;
        }
        this.form.controls['rec.buttPer'].setValue(p ? 0 : 1, {onlySelf: true, emitEvent: false });
    }
}
