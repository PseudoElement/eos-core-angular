import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { TextInput } from 'eos-common/core/inputs/text-input';
import { CheckboxInput } from 'eos-common/core/inputs/checkbox-input';
import { DateInput } from 'eos-common/core/inputs/date-input';
// import { DropdownInput } from 'eos-common/core/inputs/select-input';
// import { ISelectInput } from 'eos-common/interfaces';
// import { ButtonsInput } from 'eos-common/core/inputs/buttons-input';
import { StringInput } from 'eos-common/core/inputs/string-input';
import { IInputParamControl } from '../intrfaces/user-parm.intterfaces';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { NOT_EMPTY_STRING } from 'eos-common/consts/common.consts';
import { EosUtils } from 'eos-common/core/utils';
import { DropdownInput } from 'eos-common/core/inputs/select-input';

export class InputParamControlService {
    generateInputs(inputs: IInputParamControl[]) {
        const set = {};
        inputs.forEach(input => {
            switch (input.controlType) {
                case E_FIELD_TYPE.text:
                    set[input.key] = new TextInput(input);
                    break;
                case E_FIELD_TYPE.boolean:
                    set[input.key] = new CheckboxInput(input);
                    break;
                case E_FIELD_TYPE.date:
                    set[input.key] = new DateInput(input);
                    break;
                case E_FIELD_TYPE.select:
                    set[input.key] = new DropdownInput(Object.assign({options: []}, input));
                    break;
                // case E_FIELD_TYPE.buttons:
                //     set[input.key] = new ButtonsInput(<ISelectInput>input);
                //     break;
                default:
                    set[input.key] = new StringInput(input);
                    break;
            }
        });
        return set;
    }

    toFormGroup(inputs: IInputParamControl[], isNode?: boolean) {
        const group: any = {};

        Object.keys(inputs).forEach(input => {
            if (inputs[input].forNode === undefined) {
                this._addInput(group, inputs[input]);
            } else if (inputs[input].forNode && isNode) {
                this._addInput(group, inputs[input]);
            } else if (inputs[input].forNode === false && !isNode) {
                this._addInput(group, inputs[input]);
            }
        });
        return new FormGroup(group);
    }

    dateValueValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const value = control.value;
            let error = null;
            if (value && value instanceof Date) {
                if (isNaN(value.getTime())) {
                    error = { 'wrongDate': true };
                } else {
                    const ts = value.setHours(0, 0, 0, 0);
                    if (ts - new Date('01/01/1900').setHours(0, 0, 0, 0) < 0) {
                        error = { 'minDate': true };
                    } else if (new Date('12/31/2100').setHours(0, 0, 0, 0) - ts < 0) {
                        error = { 'maxDate': true };
                    }
                }
            }
            return error;
        };
    }

    dateCompareValidator(commparePath: string, operand: 'lt' | 'gt'): ValidatorFn {
        return (control: AbstractControl): { [errKey: string]: any } => {
            let valid = true;
            let errMessage: string = null;
            const value = control.value;
            if (value && value instanceof Date) {
                const group = <FormGroup>control.parent;
                if (group) {
                    const compareCtrl = group.controls[commparePath];
                    if (compareCtrl && compareCtrl.value && compareCtrl.value instanceof Date) {
                        switch (operand) {
                            case 'gt':
                                valid = value.getTime() > compareCtrl.value.getTime();
                                errMessage = 'Дата должна быть больше ' + EosUtils.dateToStringValue(compareCtrl.value);
                                break;
                            case 'lt':
                                valid = value.getTime() < compareCtrl.value.getTime();
                                errMessage = 'Дата должна быть меньше ' + EosUtils.dateToStringValue(compareCtrl.value);
                                break;
                        }

                        if (valid && compareCtrl.invalid) {
                            compareCtrl.updateValueAndValidity();
                        }
                    }
                }
            }

            return (valid ? null : { dateCompare: errMessage });
        };
    }

    private _addInput(group: any, input: IInputParamControl) {
        const value = input.value !== undefined ? input.value : null;
        const validators = [];

        if (input.disabled) {
            group[input.key] = new FormControl({ value: value, disabled: true }, validators);
        } else {
            if (input.controlType === E_FIELD_TYPE.date) {
                validators.push(this.dateValueValidator());
                // if (input.key === 'rec.END_DATE') {
                //     validators.push(this.dateCompareValidator('rec.START_DATE', 'gt'));
                // }
                // if (input.key === 'rec.START_DATE') {
                //     validators.push(this.dateCompareValidator('rec.END_DATE', 'lt'));
                // }
            }

            if (input.pattern) {
                validators.push(Validators.pattern(input.pattern));
            } else if (input.controlType === E_FIELD_TYPE.text || input.controlType === E_FIELD_TYPE.string) {
                validators.push(Validators.pattern(NOT_EMPTY_STRING));
            }
            // if (input.isUnique) {
            //     validators.push(this.unicValueValidator(input.key, input.uniqueInDict));
            // }
            if (input.required) {
                validators.push(Validators.required);
            }
            if (input.length) {
                validators.push(Validators.maxLength(input.length));
            }
            group[input.key] = new FormControl(value, validators);
        }
    }
}
