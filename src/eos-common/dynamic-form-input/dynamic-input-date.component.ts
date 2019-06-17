import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { EosUtils } from '../core/utils';

@Component({
    selector: 'eos-dynamic-input-date',
    templateUrl: 'dynamic-input-date.component.html'
})
export class DynamicInputDateComponent extends DynamicInputBase implements OnInit {
    bsConfig: Partial<BsDatepickerConfig>;
    placement = 'bottom';
    bsDate: Date;

    get currentValue(): string {
        const control = this.control;
        if (control) {
            if (control.value) {
                return EosUtils.dateToStringValue(control.value);
            }
        }
        return '--.--.----';
    }

    @ViewChild('dpw') datePickerWrapper: ElementRef;

    constructor(
        private localeService: BsLocaleService,
    ) {
        super();
        this.bsConfig = {
            // locale: 'ru',
            showWeekNumbers: false,
            containerClass: 'theme-dark-blue',
            dateInputFormat: 'DD.MM.YYYY',
            isDisabled: this.readonly,
            minDate: new Date('01/01/1900'),
            maxDate: new Date('12/31/2100'),
        };
    }

    dpChanged(value: Date) {
        this.form.controls[this.input.key].setValue(value);
        this.onBlur();
    }

    ngOnInit() {
        this.localeService.use('ru');
        this.updateDatePickerPlacement();
    }

    private updateDatePickerPlacement() {
        if (this.datePickerWrapper) {
            const rect = this.datePickerWrapper.nativeElement.getBoundingClientRect();
            if (window.innerHeight - rect.bottom >= 308) {
                this.placement = 'bottom';
            } else if (rect.top >= 308) {
                this.placement = 'top';
            } else if (rect.left + rect.width - 24 >= 318) {
                this.placement = 'left';
            } else {
                this.placement = 'right';
            }
        }
    }
}
