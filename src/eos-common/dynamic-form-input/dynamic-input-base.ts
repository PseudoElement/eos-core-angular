import { Input, OnChanges, OnDestroy } from '@angular/core';
import { InputBase } from '../core/inputs/input-base';
import { FormGroup, AbstractControl } from '@angular/forms';
import { INPUT_ERROR_MESSAGES } from '../consts/common.consts';
import { Subscription } from 'rxjs/Subscription';

export class DynamicInputBase implements OnChanges, OnDestroy {
    @Input() input: InputBase<any>;
    @Input() form: FormGroup;
    @Input() readonly: boolean;
    @Input() disabled: boolean;
    @Input() inputTooltip: any;

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
        this.toggleTooltip(true);
    }

    onBlur() {
        this.updateMessage();
        this.toggleTooltip(false);
    }

    ngOnChanges() {
        const control = this.control;
        if (control) {
            this.ngOnDestroy();
            this.subscriptions.push(control.statusChanges.subscribe((status) => {
                this.inputTooltip.visible = this.inputTooltip.visible && control.invalid && control.dirty;
            }));
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions = [];
    }

    protected get control(): AbstractControl {
        return this.form.controls[this.input.key];
    }

    private updateMessage() {
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
                this.inputTooltip.visible = !focused && control.invalid && control.dirty;
            } else {
                this.inputTooltip.visible = false;
            }
        } else {
            this.inputTooltip.visible = false;
        }
    }
}
