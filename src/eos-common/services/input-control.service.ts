import { NOT_EMPTY_MULTYSTRING } from './../consts/common.consts';
import {Injectable} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

import {InputBase} from '../core/inputs/input-base';
import {EosDictService} from '../../eos-dictionaries/services/eos-dict.service';
import {IBaseInput, ISelectInput} from '../interfaces';
import {StringInput} from '../core/inputs/string-input';
import {TextInput} from '../core/inputs/text-input';
import {CheckboxInput} from '../core/inputs/checkbox-input';
import {DateInput} from '../core/inputs/date-input';
import {DropdownInput} from '../core/inputs/select-input';
import {ButtonsInput} from '../core/inputs/buttons-input';
import {E_FIELD_TYPE} from 'eos-dictionaries/interfaces';
import {EosUtils} from '../core/utils';
import {NOT_EMPTY_STRING} from '../consts/common.consts';

@Injectable()
export class InputControlService {
    constructor(private _dictSrv: EosDictService) {
    }

    generateInputs(inputs: IBaseInput[]): InputBase<any>[] {
        const set: InputBase<any>[] = [];
        inputs.forEach((input) => {
            switch (E_FIELD_TYPE[input.controlType]) {
                case E_FIELD_TYPE.text:
                    set.push(new TextInput(input));
                    break;
                case E_FIELD_TYPE.boolean:
                    set.push(new CheckboxInput(input));
                    break;
                case E_FIELD_TYPE.date:
                    set.push(new DateInput(input));
                    break;
                case E_FIELD_TYPE.select:
                    set.push(new DropdownInput(<ISelectInput>input));
                    break;
                case E_FIELD_TYPE.buttons:
                    set.push(new ButtonsInput(<ISelectInput>input));
                    break;
                default:
                    set.push(new StringInput(input));
                    break;
            }
        });
        return set;
    }

    /**
     * make FormGroup from array of InputBase<any>
     * @param inputs input which added to form
     * @param isNode flag for node
     */
    toFormGroup(inputs: InputBase<any>[], isNode?: boolean) {
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

    /**
     * custom validation function
     * check if value is unic
     * @param path path in data object
     * @param inDict must it be unic in dictionary
     */
    unicValueValidator(path: string, inDict: boolean): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            return this._dictSrv.isUnique(control.value, path, inDict);
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

            return (valid ? null : {dateCompare: errMessage});
        };
    }

    dateValueValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const value = control.value;
            let error = null;
            if (value && value instanceof Date) {
                if (isNaN(value.getTime()) || !this.isValidDate(value)) {
                    error = {'wrongDate': true};
                } else {
                    const ts = value.setHours(0, 0, 0, 0);
                    if (ts - new Date('01/01/1900').setHours(0, 0, 0, 0) < 0) {
                        error = {'minDate': true};
                    } else if (new Date('12/31/2100').setHours(0, 0, 0, 0) - ts < 0) {
                        error = {'maxDate': true};
                    }
                }
            }
            return error;
        };
    }
    isValidDate (dateValue: Date): boolean {
        const day = dateValue.getDate();
        const month = dateValue.getMonth() + 1;
        const year = dateValue.getFullYear();

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return false;
        }

        if (year < 1000 || year > 3000 || month === 0 || month > 12) {
            return false;
        }

        const monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
            monthLength[1] = 29;
        }

        return (day > 0 && day <= monthLength[month - 1]);
    }


    /**
     * add input to group
     * @param group data for FormGroup
     * @param input input which is added to group
     */
    private _addInput(group: any, input: InputBase<any>) {
        const value = input.value !== undefined ? input.value : null;
        const validators = [];

        if (input.disabled) {
            group[input.key] = new FormControl({value: value, disabled: true}, validators);
        } else {
            if (input.controlType === E_FIELD_TYPE.date) {
                validators.push(this.dateValueValidator());
                if (input.key === 'rec.END_DATE') {
                    validators.push(this.dateCompareValidator('rec.START_DATE', 'gt'));
                }
                if (input.key === 'rec.START_DATE') {
                    validators.push(this.dateCompareValidator('rec.END_DATE', 'lt'));
                }
            } else if (input.controlType === E_FIELD_TYPE.numberIncrement) {
                if (input.minValue || input.maxValue) {
                    validators.push(this.numberValidator(input.minValue, input.maxValue));
                }
            }

            if (input.pattern) {
                validators.push(Validators.pattern(input.pattern));
            } else if (input.controlType === E_FIELD_TYPE.text) {
                validators.push(Validators.pattern(NOT_EMPTY_MULTYSTRING));
            } else if (input.controlType === E_FIELD_TYPE.string) {
                validators.push(Validators.pattern(NOT_EMPTY_STRING));
            }
            if (input.isUnique) {
                validators.push(this.unicValueValidator(input.key, input.uniqueInDict));
            }
            if (input.required) {
                validators.push(Validators.required);
            }
            if (input.length) {
                validators.push(Validators.maxLength(input.length));
            }

            group[input.key] = new FormControl(value, validators);
        }
    }

    private numberValidator(minValue: number, maxValue: number) {
        return (control: AbstractControl): { [errKey: string]: any } => {
            let valid = true;
            let errMessage: string = null;
            const value = control.value;
            if (value && ((maxValue && (value > maxValue)) || (minValue && (value < minValue)))) {
                valid = false;
                errMessage = 'Значение задано неверно';
            }
            return (valid ? null : {pattern: errMessage});
        };
    }
}
