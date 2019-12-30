import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
// import { CB_FUNCTIONS, AppContext } from 'eos-rest/services/appContext.service';
import { DictUtils, IDaysVariant } from 'eos-dictionaries/utils/dict-utils';

@Component({
    selector: 'eos-organizations-card-edit-group',
    templateUrl: 'organizations-card-edit-group.component.html',
})

export class OrganizationsCardEditGroupComponent extends BaseCardEditComponent implements OnChanges {
    isCBFunc = false;
    daysVariants: IDaysVariant[] = null;
    daysLabel = 'ДНЯ (ДНЕЙ)';
    constructor(injector: Injector) {
        super(injector);
       // const appctx = injector.get(AppContext);
       // this.isCBFunc = appctx.getParams(CB_FUNCTIONS) === 'YES';
    }

    ngOnChanges(changes) {
        if (this.form) {
            if (!this.daysVariants) {
                this.daysVariants = DictUtils.termExecOpts(this.inputs['rec.TERM_EXEC_TYPE'].options);
                this._updateDayLabels();
            }
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
    }

    private updateForm(changes) {
        this._updateDayLabels();
    }
    private _updateDayLabels() {
        const val = this.form.controls['rec.TERM_EXEC'].value;
        const v = this.daysVariants[DictUtils.termExecOptsVariant(val)];
        this.inputs['rec.TERM_EXEC_TYPE'].options = v.options;
        this.daysLabel = v.daysLabel;
    }
}
