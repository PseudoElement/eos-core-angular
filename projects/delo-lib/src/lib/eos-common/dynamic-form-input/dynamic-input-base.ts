import type { ErrorTooltip, IDynamicInputOptions } from './dynamic-input.component';
import { Input, OnChanges, OnDestroy, SimpleChanges, Output, EventEmitter, Directive } from '@angular/core';
import type { InputBase } from '../core/inputs/input-base';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EosUtils } from '../../eos-common/core/utils';
import { E_FIELD_TYPE } from '../../eos-dictionaries/interfaces';

const ENABLED_FIELD_TYPES = [E_FIELD_TYPE.string, E_FIELD_TYPE.text];
@Directive()
export class DynamicInputBaseDirective implements OnChanges, OnDestroy {
    @Input() input: InputBase<any>;
    @Input() form: FormGroup;
    @Input() readonly: boolean;
    @Input() disabled: boolean;
    @Input() inputTooltip: ErrorTooltip;
    @Input() isGroup: boolean;
    @Input() hideLabel: boolean;
    @Input() viewOpts: IDynamicInputOptions;
    @Input() shouldHideTooltipOnBlur?: boolean = false;
    @Output() onControlBlur: EventEmitter<any> = new EventEmitter<any>();
    @Output() onControlFocus: EventEmitter<any> = new EventEmitter<any>();

    public isFocused: boolean;
    protected subscriptions: Subscription[] = [];
    protected _syncTimer: NodeJS.Timer;

    get currentValue(): any {
        const control = this.control;
        if (control) {
            return control.value;
        } else {
            return this.input.label;
        }
    }

    get isRequired(): boolean {
        let required = false;
        const control = this.control;
        if (control && control.errors) {
            required = !!this.control.errors['required'];
        }
        return required;
    }
    hasValue(): boolean {
        const ctrl = this.control;
        return (ctrl && ctrl.value !== null && ctrl.value !== undefined);
    }

    onFocus() {
        this.isFocused = true;
        this.toggleTooltip();
        this.onControlFocus.emit(this);
    }

    onBlur() {
        this.isFocused = false;
        this.updateMessage();
        this.toggleTooltip();
        if(this.shouldHideTooltipOnBlur){
             this.inputTooltip.visible = false
             this.inputTooltip.message = '';
        };
        this.onControlBlur.emit(this);
    }

    onInput(event) {
        event.stopPropagation();
        // this.delayedTooltip(); @task161788 отключаем подсказку
        this.cutLongerValue(this.control.value);
    }
    onPaste(event) {
        const oldText = this.control.value ? this.control.value : '';
        this.cutLongerValue(oldText, true);
    }

    delayedTooltip(): void {
        this.updateMessage();
        if (this.inputTooltip.message !== '' && !this._syncTimer) {
            this.inputTooltip.visible = false;
            this._syncTimer = setTimeout(() => {
                this.inputTooltip.force = true;
                this.inputTooltip.visible = true;
                this._syncTimer = null;
            }, 300);
        }
    }

    forceTooltip() {
        this.inputTooltip.force = true;
    }
    ngOnChanges(changes: SimpleChanges) {
        const control = this.control;
        this.input.dib = this;
        if (control) {
            setTimeout(() => {
                this.toggleTooltip();
            });
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

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions = [];
    }

    getCounterLabel(): string {
        if (this.input.length) {
            const control = this.control;
            if (control) {
                const len = this.control.value ? String(this.control.value).length : 0;
                const maxlen = this.input.length;
                return String(len) + '/' + String(maxlen);
            }
        }
        return '';
    }

    get control(): AbstractControl {
        return this.form.controls[this.input.key];
    }

    public getErrorMessage(): string {
        let msg = '';
        const control = this.control;
        if (control && control.errors) {
            msg = EosUtils.getControlErrorMessage(control, { uniqueInDict: !!this.input.uniqueInDict, maxLength: this.input.length });
        }

        return msg;
    }


    protected updateMessage() {
        this.inputTooltip.message = this.getErrorMessage();
    }

    protected toggleTooltip() {
        if (!this.readonly) {
            const control = this.control;
            if (control) {
                this.updateMessage();
                this.inputTooltip.visible = /*!focused &&*/ control.invalid /*&& control.dirty*/;
                this.inputTooltip.force = true;
            } else {
                this.inputTooltip.visible = false;
            }
        } else {
            this.inputTooltip.visible = false;
        }
    }

    protected cutLongerValue(value: string, paste: boolean = false) {
        if (ENABLED_FIELD_TYPES.includes(this.input.controlType) && this.input.length) {
            if (value.length > this.input.length) { // @task161788 обрезка длинного значения
                this.control.patchValue(value.substring(0, this.input.length));
            } else {
                if (paste) {
                    this.control.patchValue(value);
                }
            }
        } else {
            this.control.patchValue(value);
        }
    }

}
