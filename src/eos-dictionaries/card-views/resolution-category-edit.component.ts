import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { BaseCardEditComponent } from './base-card-edit.component';
/* import { EosMessageService } from 'eos-common/services/eos-message.service'; */
/* import { CONFIRM_REESTRTYPE_DELIVERY_CHANGE, BUTTON_RESULT_OK } from 'app/consts/confirms.const'; */
/* import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { PipRX } from 'eos-rest'; */
/* import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component'; */

@Component({
    selector: 'eos-resolution-category-edit',
    templateUrl: 'resolution-category-edit.component.html',
})
export class ResolutionCategoryEditComponent extends BaseCardEditComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(injector: Injector,
        ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.form.controls['rec.PLAN_DAY_COUNT'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe((changes: any) => {
            // при попытку удаления заменяем пустую строку 0
            if (this.form.controls['rec.PLAN_DAY_COUNT'].value === '') {
                this.form.controls['rec.PLAN_DAY_COUNT'].setValue('0', {emitEvent: false});
            }
        });
    }

    onAfterLoadRelated() {
        super.onAfterLoadRelated();
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }

}
