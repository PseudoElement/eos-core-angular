import { ValidatorFn, AbstractControl } from '@angular/forms';

export enum VALIDATOR_TYPE  {
    EXTENSION_DOT = 0,
}

export class ValidatorsControl {
    static appendValidator(control: AbstractControl, fn: ValidatorFn): any {
        const v = [fn];

        if (control.validator) {
            v.push(control.validator);
        }
        control.setValidators(v);
        control.updateValueAndValidity();
        if (!control.valid) {
            control.markAsDirty();
        }
    }

   static existValidator(type: VALIDATOR_TYPE): ValidatorFn {
       switch (type) {
           case VALIDATOR_TYPE.EXTENSION_DOT:
                return (control: AbstractControl): { [key: string]: any } => {
                    const v = control.value;
                    if (v && v !== '' && v.indexOf('.') === -1) {
                        return { valueError: 'Поле должно иметь сивол "."'};
                    }
                };
            default:
               break;
       }
   }
}
