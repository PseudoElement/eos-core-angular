import { ErrorTooltip, IDynamicInputOptions } from './dynamic-input.component';
import { Input, OnChanges, OnDestroy, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { InputBase } from '../core/inputs/input-base';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EosUtils } from 'eos-common/core/utils';

export class DynamicInputBase implements OnChanges, OnDestroy {
    @Input() input: InputBase<any>;
    @Input() form: FormGroup;
    @Input() readonly: boolean;
    @Input() disabled: boolean;
    @Input() inputTooltip: ErrorTooltip;
    @Input() isGroup: boolean;
    @Input() hideLabel: boolean;
    @Input() viewOpts: IDynamicInputOptions;
    @Output() onControlBlur: EventEmitter<any> = new EventEmitter<any>();
    @Output() onControlFocus: EventEmitter<any> = new EventEmitter<any>();


    public isFocused: boolean;
    protected subscriptions: Subscription[] = [];
    private _syncTimer: NodeJS.Timer;

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
        this._updateMessage();
        this.toggleTooltip();
        this.onControlBlur.emit(this);
    }

    onInput(event) {
        event.stopPropagation();
        this._delayedTooltip();
    }

    _delayedTooltip(): void {
        this._updateMessage();
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
                const len = this.control.value ? String(this.control.value).length : 0;
                const maxlen = this.input.length;
                return String(len) + '/' + String (maxlen);
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
            msg = EosUtils.getControlErrorMessage(control, {uniqueInDict: !!this.input.uniqueInDict, maxLength: this.input.length });
        }

        return msg;
    }


    private _updateMessage() {
        this.inputTooltip.message = this.getErrorMessage();
    }

    private toggleTooltip() {
        if (!this.readonly) {
            const control = this.control;
            if (control) {
                this._updateMessage();
                this.inputTooltip.visible = /*!focused &&*/ control.invalid /*&& control.dirty*/;
                this.inputTooltip.force = true;
            } else {
                this.inputTooltip.visible = false;
            }
        } else {
            this.inputTooltip.visible = false;
        }
    }
}
