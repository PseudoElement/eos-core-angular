import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
// import { CB_FUNCTIONS, AppContext } from 'eos-rest/services/appContext.service';
import { DictUtils, IDaysVariant } from 'eos-dictionaries/utils/dict-utils';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_CHANGE_ISN_ADDR_CATEGORY } from 'app/consts/confirms.const';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { PipRX, ORGANIZ_CL } from 'eos-rest';

@Component({
    selector: 'eos-organizations-card-edit-group',
    templateUrl: 'organizations-card-edit-group.component.html',
})

export class OrganizationsCardEditGroupComponent extends BaseCardEditComponent implements OnChanges {
    isCBFunc = false;
    daysVariants: IDaysVariant[] = null;
    daysLabel = 'ДНЯ (ДНЕЙ)';
    constructor(injector: Injector, private _confSrv: ConfirmWindowService, private _errSrv: ErrorHelperServices, private apiSrv: PipRX) {
        super(injector);
        // const appctx = injector.get(AppContext);
        // this.isCBFunc = appctx.getParams(CB_FUNCTIONS) === 'YES';
    }
    confirmSave(): Promise<any> {
        if (!this.isNewRecord) {
            if (+this.data.rec.ISN_ADDR_CATEGORY !== +this.data.rec._orig.ISN_ADDR_CATEGORY) {
                 return this._confSrv.confirm2(CONFIRM_CHANGE_ISN_ADDR_CATEGORY).then(ans => {
                    if (ans && ans.result === 2) {
                        this.upDateChildren();
                        return Promise.resolve(true);
                    } else {
                        return Promise.resolve(true);
                    }
                }).catch(e => {
                    this._errSrv.errorHandler(e);
                });
            }
        }
        return Promise.resolve(true);
    }
    upDateChildren() {
        return this.apiSrv.read({
            ORGANIZ_CL: {
                criteries: {
                    DUE: this.data.rec.DUE + '_%'
                }
            }
        }).then((data: ORGANIZ_CL[]) => {
            if (data && data.length) {
                const changes = [];
                data.forEach(_d => {
                    changes.push({
                        method: 'MERGE',
                        requestUri: `ORGANIZ_CL('${_d.DUE}')`,
                        data: {
                            ISN_ADDR_CATEGORY: this.data.rec.ISN_ADDR_CATEGORY
                        }
                    });
                });
                if (changes.length) {
                    this.apiSrv.batch(changes, '');
                }
            }
            return Promise.resolve(true);
        }).catch(e => {
            this._errSrv.errorHandler(e);
        });
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
