import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { TextInput } from 'eos-common/core/inputs/text-input';
import { CheckboxInput } from 'eos-common/core/inputs/checkbox-input';
import { DateInput } from 'eos-common/core/inputs/date-input';
import { StringInput } from 'eos-common/core/inputs/string-input';
import { IInputParamControl } from '../interfaces/sev.interface';
import { DropdownInput } from 'eos-common/core/inputs/select-input';
import { RadioInput } from 'eos-common/core/inputs/radio-input';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { NOT_EMPTY_STRING } from 'eos-common/consts/common.consts';
import { ISelectInput } from 'eos-common/interfaces';

export class SevControlService {

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
                    const a = {options: []};
                    const b = input;
                    const c = Object.assign(a, b);
                    const SELECT: ISelectInput = Object(c);
                    set[input.key] = new DropdownInput(SELECT);
                    break;
                case E_FIELD_TYPE.radio:
                    set[input.key] = new RadioInput(input);
                    break;
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
            if (
                inputs[input].forNode === undefined ||
                (inputs[input].forNode && isNode) ||
                (inputs[input].forNode === false && !isNode)
            ) {
                this._addInput(group, inputs[input]);
            }
        });
        return new UntypedFormGroup(group);
    }

    private _addInput(group: any, input: IInputParamControl) {
        const value = input.value !== undefined ? input.value : null;
        const validators = [];

        if (input.disabled) {
            group[input.key] = new UntypedFormControl({ value: value, disabled: true }, validators);
        } else {
            if (input.pattern) {
                validators.push(Validators.pattern(input.pattern));
            } else if (input.controlType === E_FIELD_TYPE.text || input.controlType === E_FIELD_TYPE.string) {
                validators.push(Validators.pattern(NOT_EMPTY_STRING));
            }
            if (input.required) {
                validators.push(Validators.required);
            }
            if (input.length) {
                validators.push(Validators.maxLength(input.length));
            }
            group[input.key] = new UntypedFormControl(value, validators);
        }
    }
}
