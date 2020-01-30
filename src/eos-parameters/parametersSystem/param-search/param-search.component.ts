import { Component, Injector, Input } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { PARM_CANCEL_CHANGE } from './../shared/consts/eos-parameters.const';
import { SEARCH_PARAM } from './../shared/consts/search-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { Subject } from 'rxjs';

@Component({
    selector: 'eos-param-search',
    templateUrl: 'param-search.component.html'
})
export class ParamSearchComponent extends BaseParamComponent {
    @Input() btnError;
    public masDisable: any[] = [];
    public submitError: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(injector: Injector) {
        super(injector, SEARCH_PARAM);
        this.init()
            .then(() => {
                this.afterInitRC();
            });
    }
    cancel() {
        this.submitError = false;
        if (this.isChangeForm) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.init()
                .then(() => {
                    // this.cancelEdit();
                    this.afterInitRC();
                })
                .catch(err => {
                    if (err.code !== 434) {
                        console.log(err);
                    }
                });
        }
        this.cancelEdit();
    }
    afterInitRC() {
        this.subscriptions.push(
            this.form.controls['rec.FULLTEXT_EXTENSIONS'].valueChanges
            .pipe(
                debounceTime(300)
            )
            .subscribe(value => {
                if (this.changeByPath('rec.FULLTEXT_EXTENSIONS', value)) {
                    if (value !== value.toUpperCase()) {
                        this.form.controls['rec.FULLTEXT_EXTENSIONS'].patchValue(value.toUpperCase());
                    }
                } else {
                    this.formChanged.emit(false);
                }
            })
        );
        this.subscriptions.push(
            this.form.controls['rec.FULLTEXT_EXTENSIONS'].valueChanges
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state: boolean) => {
                if (!this.checkCorrectSymbol(this.form.controls['rec.FULLTEXT_EXTENSIONS'].value)) {
                    this.submitError = true;
                    this.form.controls['rec.FULLTEXT_EXTENSIONS'].setErrors({errorPattern: true}, {emitEvent: true});
                } else {
                    this.form.controls['rec.FULLTEXT_EXTENSIONS'].setErrors(null, {emitEvent: true});
                    this.submitError = false;
                }
            })
        );
        this.cancelEdit();
    }
    edit() {
        Object.keys(this.form.controls).forEach(key => {
            if (this.masDisable.indexOf(key) >= 0) {
                this.form.controls[key].enable({ emitEvent: false });
            }
        });
    }
    cancelEdit() {
        this.masDisable = [];
        Object.keys(this.form.controls).forEach(key => {
            if (!this.form.controls[key].disabled) {
                this.masDisable.push(key);
            }
        });
        this.form.disable({ emitEvent: false });
    }
    checkCorrectSymbol(value: string) {
        // если возвращает false то значит в строке есть не подходящие символы
        let flag = true;
        if (value.search(/^[^\\\/\|\:\.\*?]{0,2000}$/) !== -1) {
            for (let index = 0; index < value.length; index++) {
                if (value[index].charCodeAt(0) < 31) {
                    flag = false;
                    break;
                }
            }
        } else {
            flag = false;
        }
        return flag;
    }
}
