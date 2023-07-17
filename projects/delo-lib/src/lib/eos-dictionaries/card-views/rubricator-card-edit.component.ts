import { Component, Injector } from '@angular/core';
import { BaseCardEditDirective } from './base-card-edit.component';

@Component({
    selector: 'eos-rubricator-card-edit',
    templateUrl: 'rubricator-card-edit.component.html',
})
export class RubricatorCardEditComponent extends BaseCardEditDirective {
    constructor(injector: Injector) {
        super(injector);
    }
    ngOnChanges() {
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => {
                if (this.form.controls['rec.RUBRIC_CODE'].errors) {
                    const error = Object.assign({}, this.form.controls['rec.RUBRIC_CODE'].errors)
                    this.form.controls['rec.RUBRIC_CODE'].setErrors(null);
                    setTimeout(() => {
                        this.form.controls['rec.RUBRIC_CODE'].setErrors(error);
                    }, 0);
                }
            });
        }
    }
}
