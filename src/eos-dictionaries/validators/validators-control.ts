import { ValidatorFn, AbstractControl } from '@angular/forms';

export enum VALIDATOR_TYPE  {
    EXTENSION_DOT = 0,
}

export class ValidatorsControl {

    static optionInvalidValue = -0xDEADBEEF;

    static appendValidator(control: AbstractControl, fn: ValidatorFn | ValidatorFn[]): any {
        const v = Array.isArray(fn) ? fn : [fn];

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
                        return { valueError: 'Поле должно иметь символ "."'};
                    }
                };
            default:
               break;
       }
   }
   static onlyOneOfControl(control1: any, control2: any, err: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (control1 && control2) {
                if (control1.value && control2.value) {
                    return { valueError: err};
                }
            }
            return null;
        };
   }

   static controlsNonUniq(control1: any, control2: any, err: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (control1 && control2) {
            if (control1.value && control2.value) {
                if (control1.value === control2.value) {
                    return { valueError: err};
                }
            }
        }
        return null;
    };
}

   static optionsCorrect(options: any[]) {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return null;
            }
            const t = options.find( o => String(o.value) === String(control.value));
            if (!t) {
                return { valueError: 'Deleted option'};
            }
            return null;
        };
   }

   static optionCustomValidate(err: string) {
    return (control: AbstractControl): { [key: string]: any } => {
        if (control.value === ValidatorsControl.optionInvalidValue) {
            return { valueError: err};
        }
        return null;
    };

   }
}
