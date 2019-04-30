import { Component, Injector } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

import { PARM_CANCEL_CHANGE } from './../shared/consts/eos-parameters.const';
import { SEARCH_PARAM } from './../shared/consts/search-consts';
import { BaseParamComponent } from './../shared/base-param.component';

@Component({
    selector: 'eos-param-search',
    templateUrl: 'param-search.component.html'
})
export class ParamSearchComponent extends BaseParamComponent {
    constructor( injector: Injector ) {
        super(injector, SEARCH_PARAM);
        this.init()
        .then(() => {
            this.afterInitRC();
        });
    }
    cancel() {
        if (this.isChangeForm) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.init()
            .then(() => {
                this.afterInitRC();
            })
            .catch(err => {
                if (err.code !== 434) {
                    console.log(err);
                }
            });
        }
    }
    afterInitRC() {
        this.subscriptions.push(
            this.form.controls['rec.FULLTEXT_EXTENSIONS'].valueChanges
            .pipe(
                debounceTime(300)
            )
            .subscribe(value => {
                if (this.changeByPath('rec.FULLTEXT_EXTENSIONS', value)) {
                    this.form.controls['rec.FULLTEXT_EXTENSIONS'].patchValue(value.toUpperCase());
                }
            })
        );
    }
}
