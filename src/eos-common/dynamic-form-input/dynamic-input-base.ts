import { ErrorTooltip, IDynamicInputOptions } from './dynamic-input.component';
import { Input, OnChanges, OnDestroy } from '@angular/core';
import { InputBase } from '../core/inputs/input-base';
import { FormGroup, AbstractControl } from '@angular/forms';
import { INPUT_ERROR_MESSAGES } from '../consts/common.consts';
import { Subscription } from 'rxjs';

export class DynamicInputBase implements OnChanges, OnDestroy {
    @Input() input: InputBase<any>;
    @Input() form: FormGroup;
    @Input() readonly: boolean;
    @Input() disabled: boolean;
    @Input() inputTooltip: ErrorTooltip;
    @Input() isGroup: boolean;
    @Input() hideLabel: boolean;
    @Input() viewOpts: IDynamicInputOptions;

    public isFocused: boolean;
    protected subscriptions: Subscription[] = [];

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
        this.toggleTooltip(true);
    }

    onBlur() {
        this.isFocused = false;
        this._updateMessage();
        this.toggleTooltip(false);
    }
    onInput(event) {
        event.stopPropagation();
        this._updateMessage();
        this.toggleTooltip(true);
    }

    forceTooltip() {
        // this._updateMessage();
        this.inputTooltip.force = true;
    }

    ngOnChanges() {
        const control = this.control;
        this.input.dib = this;
        if (control) {
            this.ngOnDestroy();
            this.subscriptions.push(control.statusChanges.subscribe((status) => {
                if (this.inputTooltip.force) {
                    this._updateMessage();
                    this.inputTooltip.visible = true;
                    this.inputTooltip.force = false;
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
                const len = this.control.value ? this.control.value.length : 0;
                const maxlen = this.input.length;
                return String(len) + '/' + String (maxlen);
            }
        }
        return '';
    }

    get control(): AbstractControl {
        return this.form.controls[this.input.key];
    }

    private _updateMessage() {
        let msg = '';
        const control = this.control;
        if (control && control.errors) {
            msg = Object.keys(control.errors)
                .map((key) => {
                    switch (key) {
                        case 'wrongDate':
                        case 'minDate':
                        case 'maxDate':
                        case 'pattern':
                        case 'required':
                            return INPUT_ERROR_MESSAGES[key];
                        case 'isUnique':
                            return INPUT_ERROR_MESSAGES[key][+(!!this.input.uniqueInDict)];
                        case 'maxlength':
                            return 'Максимальная длина ' + this.input.length + ' символ(а|ов).';
                        case 'valueError':
                        case 'dateCompare':
                            return control.errors[key];
                        default:
                            // console.warn('unhandled error key', key);
                            return INPUT_ERROR_MESSAGES.default;
                    }
                })
                .join(' ');
        }
        this.inputTooltip.message = msg;
    }

    private toggleTooltip(focused: boolean) {
        if (!this.readonly) {
            const control = this.control;
            if (control) {
                this.inputTooltip.visible = /*!focused &&*/ control.invalid /*&& control.dirty*/;
                this.inputTooltip.force = true;
                this._updateMessage();
            } else {
                this.inputTooltip.visible = false;
            }
        } else {
            this.inputTooltip.visible = false;
        }
    }
}
