import { ValidatorFn, AbstractControl, AsyncValidatorFn } from '@angular/forms';

export enum VALIDATOR_TYPE  {
    EXTENSION_DOT = 0,
}

export interface ValidatorOptions {
    ignoreCase?: boolean;
    ignoreWhiteSpace?: boolean;
}
export class ValidatorsControl {

    static optionInvalidValue = -0xDEADBEEF;

    static appendAsyncValidator(control: AbstractControl, fn: AsyncValidatorFn | AsyncValidatorFn[]): any {
        const v = Array.isArray(fn) ? fn : [fn];
        if (control.asyncValidator) {
            v.push(control.asyncValidator);
        }
        control.setAsyncValidators(v);
        control.updateValueAndValidity();
        if (!control.valid) {
            control.markAsDirty();
        }
    }

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

   static controlsNonUniq(control1: any, control2: any, err: string, opts: ValidatorOptions): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (control1 && control2) {
                if (control1.value && control2.value) {
                    let v1: string = String(control1.value);
                    let v2: string = String(control2.value);
                    if (opts && opts.ignoreCase) {
                        v1 = v1.toUpperCase();
                        v2 = v2.toUpperCase();
                    }
                    if (opts && opts.ignoreWhiteSpace) {
                        v1 = v1.trim();
                        v2 = v2.trim();
                    }
                    if (v1 === v2) {
                        return { valueError: err};
                    }
            }
            }
            return null;
        };
    }

//    static controlsNonUniq(control1: any, control2: any, err: string, ignoreCase: boolean, ignoreWhiteSpace: boolean): ValidatorFn {
//         return (control: AbstractControl): { [key: string]: any } => {
//             if (control1 && control2) {
//                 if (control1.value && control2.value) {
//                     let v1: string = String(control1.value);
//                     let v2: string = String(control2.value);
//                     if (ignoreCase) {
//                         v1 = v1.toUpperCase();
//                         v2 = v2.toUpperCase();
//                     }
//                     if (ignoreWhiteSpace) {
//                         v1 = v1.trim();
//                         v2 = v2.trim();
//                     }
//                     if (v1 === v2) {
//                         return { valueError: err};
//                     }
//             }
//             }
//             return null;
//         };
//     }

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
