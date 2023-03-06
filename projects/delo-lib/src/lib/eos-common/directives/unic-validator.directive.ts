import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
    selector: '[eosUnic]',
    providers: [{ provide: NG_VALIDATORS, useExisting: UnicValidatorDirective, multi: true }]
})
export class UnicValidatorDirective implements Validator {
    @Input() eosUnic: boolean;
    @Input() checkingMethod: Function;
    @Input() key: string;
    @Input() inDict: boolean;

    validate(control: AbstractControl): { [key: string]: any } {
        if (this.eosUnic) {
            return this.checkingMethod(control.value, this.key, this.inDict) ? { 'isUnique': false } : null;
        } else {
            return null;
        }
    }
}
