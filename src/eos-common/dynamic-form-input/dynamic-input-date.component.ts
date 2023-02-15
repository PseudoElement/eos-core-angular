import { Component, ElementRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import {DynamicInputBaseDirective} from './dynamic-input-base';
import {BsDatepickerConfig, BsLocaleService} from 'ngx-bootstrap/datepicker';
import {EosUtils} from '../core/utils';
import { DatePickerStyleFixes } from 'eos-common/type/const.type';

@Component({
    selector: 'eos-dynamic-input-date',
    templateUrl: 'dynamic-input-date.component.html'
})
export class DynamicInputDateComponent extends DynamicInputBaseDirective implements OnInit, OnChanges {
    @Input() placementIn;
    @Input() customStyleIn: DatePickerStyleFixes | undefined;
    bsConfig: Partial<BsDatepickerConfig>;
    placement;
    bsDate: Date;

    hidePicker = false;

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
            minDate: new Date('01/01/1753'),
            maxDate: new Date('12/31/2999'),
        };
    }

    dpChanged(value: Date) {
        if (value !== undefined) { // при инициализации запускается инициализация и вызывается с undefined
            this.form.controls[this.input.key].setValue(value);
        }
        this.onBlur();
    }

    ngOnChanges(changes: SimpleChanges) {
        const control = this.control;
        this.input.dib = this;
        if (control) {
            /*
            данный код в иногда мог блокировать ввод даты с клавиатруы
            (пример: расширенный поиск в спр. организации)

            setTimeout(() => {
                this.toggleTooltip();
            }); */
            this.ngOnDestroy();
            this.subscriptions.push(control.statusChanges.subscribe(() => {
                 this.inputTooltip.visible = false;
                if (this.inputTooltip.force) {
                    this.updateMessage();
                    setTimeout(() => { // похоже тут рассинхрон, имя не успевает обновиться и если меняется с ошибки на ошибку, то имя ангулар не меняет
                        this.inputTooltip.visible = true;
                        this.inputTooltip.force = false;
                    }, 0);
                } else {
                    this.inputTooltip.visible = (this.inputTooltip.visible && control.invalid && control.dirty);
                }
            }));
        }
    }

    ngOnInit() {
        this.hidePicker = (this.viewOpts ? this.viewOpts.hidePicker : false);
        this.localeService.use('ru');
        this.updateDatePickerPlacement();
        this.updateDatePickerStyle();
    }

    onEnter() {
        this.updateMessage();
        this.inputTooltip.force = true;
        this.inputTooltip.visible = true;
    }

    onLeave() {
        this.inputTooltip.force = false;
        this.inputTooltip.visible = false;
    }

    // delayedTooltip() {
    //     this.updateMessage();
    //     if (this.inputTooltip.message !== '' && !this._syncTimer && !this.inputTooltip.force) {
    //         this.inputTooltip.visible = false;
    //         this._syncTimer = setTimeout(() => {
    //             this.inputTooltip.force = true;
    //             this.inputTooltip.visible = true;
    //             this._syncTimer = null;
    //         }, 0);
    //     }
    // }
    // toggleTooltip() {
    //     if (!this.readonly && this.control) {
    //         this.delayedTooltip();
    //     } else {
    //         super.toggleTooltip();
    //     }
    // }

    private updateDatePickerPlacement() {
        if (this.placementIn) {
            this.placement = this.placementIn;
            return ;
        }
        if (this.datePickerWrapper) {
            setTimeout(() => {
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
            }, 10);
        }
    }
    private updateDatePickerStyle() {
        this.bsConfig.containerClass = this.customStyleIn ? this.bsConfig.containerClass + ' ' + this.customStyleIn : this.bsConfig.containerClass;
    }
}
