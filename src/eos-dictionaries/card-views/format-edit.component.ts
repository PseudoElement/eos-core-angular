import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-format-edit',
    templateUrl: 'format-edit.component.html',
    styleUrls: ['format-edit.component.scss']
})
export class FormatEditComponent extends BaseCardEditComponent implements OnDestroy, OnInit {
    private ngUnsubscribe: Subject<any> = new Subject();
    get getCheckColor(): boolean {
        const value: string = this.form.controls['rec.FORMAT_GNAME'].value;
        if (value) {
            return !(value.toLowerCase() === 'pdf' || value.toLowerCase() === 'no');
        } else {
            return false;
        }
    }
    get getCheckCompr(): boolean {
        const value: string = this.form.controls['rec.FORMAT_GNAME'].value;
        if (value) {
            return value.toLowerCase() === 'tif';
        } else {
            return false;
        }
    }
    get getDisablePrioritet(): boolean {
        return !(this.editMode) || this.inputs['rec.PRIORITET'].value;
    }
    get getTooltip(): string {
        return this.inputs['rec.PRIORITET'].value ? '' : '';
    }
    constructor(injector: Injector) {
        super(injector);
    }
    ngOnInit(): void {
        this.form.controls['rec.FORMAT_GNAME'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe((value: string) => {
            this.updateColor(value);
        });
        this.form.controls['rec.COLOR'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            this.updateCOMPR(value);
        });
        this.updateCOMPR(this.data.rec['COLOR']);
        this.updateForm(this.data.rec['FORMAT_GNAME']);
        if (this.data.rec['FORMAT_GNAME'] && this.data.rec['FORMAT_GNAME'].toLowerCase() !== 'tif') {
            this.updateColor(this.data.rec['FORMAT_GNAME']);
        }
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
    updateColor(value: string) {
        if (value && (value.toLowerCase() === 'bmp' || value.toLowerCase() === 'png' )) {
            this.inputs['rec.COLOR'].options = [
                {value: 1, title: 'Черно-белый'},
                {value: 2, title: 'Оттенки серого'},
                {value: 3, title: 'Цветной'},
            ];
            if (this.form.controls['rec.COLOR'].value !== 2) {
                setTimeout(() => {
                    this.form.controls['rec.COLOR'].setValue(1);
                }, 0);
            }
        }
        if (value && (value.toLowerCase() === 'tif' || value.toLowerCase() === 'jpg')) {
            this.inputs['rec.COLOR'].options = [
                {value: 2, title: 'Оттенки серого'},
                {value: 3, title: 'Цветной'},
            ];
            if (this.form.controls['rec.COLOR'].value !== 2) {
                setTimeout(() => {
                    this.form.controls['rec.COLOR'].setValue(2);
                }, 0);
            }
        }
        if (value && (value.toLowerCase() === 'pdf' || value.toLowerCase() === 'no')) {
            setTimeout(() => {
                this.form.controls['rec.COMPR'].setValue(null);
            }, 0);
        }
        if (value && value.toLowerCase() !== 'tif') {
            setTimeout(() => {
                this.form.controls['rec.COMPR'].setValue(null);
            }, 0);
        } else {
            this.form.controls['rec.COMPR'].setValue(1);
        }
    }
    updateForm(value: string) {
        if (value && value.toLowerCase() === 'tif') {
            this.inputs['rec.COLOR'].options = [
                {value: 2, title: 'Оттенки серого'},
                {value: 3, title: 'Цветной'},
            ];
            if (this.form.controls['rec.COLOR'].value === 1) {
                this.inputs['rec.COMPR'].options = [
                    {value: 1, title: 'без сжатия'},
                    {value: 2, title: 'CCITT3'},
                    {value: 3, title: 'CCITT4'},
                    {value: 4, title: 'PACKBITS'},
                ];
            }
            if (this.form.controls['rec.COLOR'].value === 2) {
                this.inputs['rec.COMPR'].options = [
                    {value: 1, title: 'без сжатия'},
                    {value: 4, title: 'PACKBITS'},
                    {value: 5, title: 'JPEG'},
                ];
            }
            if (this.form.controls['rec.COLOR'].value === 3) {
                this.inputs['rec.COMPR'].options = [
                    {value: 1, title: 'без сжатия'},
                    {value: 5, title: 'JPEG'},
                ];
            }
        }
    }
    updateCOMPR(value?: number) {
        const formCompr: number = this.form.controls['rec.COMPR'].value;
        if (value === 1) {
            this.inputs['rec.COMPR'].options = [
                {value: 1, title: 'без сжатия'},
                {value: 2, title: 'CCITT3'},
                {value: 3, title: 'CCITT4'},
                {value: 4, title: 'PACKBITS'},
            ];
            if (formCompr === 5) {
                setTimeout(() => {
                    this.form.controls['rec.COMPR'].setValue(1);
                }, 0);
            }
        }
        if (value === 2) {
            this.inputs['rec.COMPR'].options = [
                {value: 1, title: 'без сжатия'},
                {value: 4, title: 'PACKBITS'},
                {value: 5, title: 'JPEG'},
            ];
            if (formCompr === 2 || formCompr === 3) {
                setTimeout(() => {
                    this.form.controls['rec.COMPR'].setValue(1);
                }, 0);
            }
        }
        if (value === 3) {
            this.inputs['rec.COMPR'].options = [
                {value: 1, title: 'без сжатия'},
                {value: 5, title: 'JPEG'},
            ];
            if (formCompr === 2 || formCompr === 3 || formCompr === 4) {
                setTimeout(() => {
                    this.form.controls['rec.COMPR'].setValue(1);
                }, 0);
            }
        }
    }
}
