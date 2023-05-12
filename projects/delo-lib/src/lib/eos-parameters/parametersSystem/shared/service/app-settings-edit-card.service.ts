import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class AppSettingsEditCardService {

    constructor() { }
    fillControls(dataProfile: any, form: FormGroup) {
        Object.keys(dataProfile).forEach(key => {
            const value = key !== "Password" ? dataProfile[key] : dataProfile[key]?.Key;
            const keyControl = 'rec.' + key;
            if (form.contains(keyControl)) {
                form.controls[keyControl].patchValue(value, { emitEvent: false });
            }
        })
    }
    resetForm(form: FormGroup) {
        form.reset(undefined, { emitEvent: false });
    }
}
