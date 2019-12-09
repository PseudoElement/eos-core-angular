import { Component, Injector, Input, OnInit, OnDestroy } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { PRJ_RC_PARAM } from '../shared/consts/prj-rc.consts';
import { USER_LISTS } from 'eos-rest';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'eos-param-prj-rc',
    templateUrl: 'param-prj-rc.component.html'
})
export class ParamPrjRcComponent extends BaseParamComponent implements OnInit, OnDestroy {
    @Input() btnError;
    @Input() optionsRc: USER_LISTS[];
    private _unsubscribe = new Subject();
    constructor(injector: Injector) {
        super(injector, PRJ_RC_PARAM);
    }
    ngOnInit() {
        this.paramApiSrv.getData({
            USER_LISTS: {
                criteries: {
                    ISN_LCLASSIF: -99,
                    CLASSIF_ID: '105'
                }
            }
        }).then((list: USER_LISTS[]) => {
            this.fiillInputForCB(list);
            this.init()
                .then(() => {
                    this.cancelEdit();
                    this.subscribeUnputs();
                })
                .catch(err => {
                    if (err.code !== 434) {
                        console.log(err);
                    }
                });
        }).catch(e => {
            console.log(e);
        });
    }
    subscribeUnputs() {
        this.form.controls['rec.PRJ_STAGE_FILE_PROTECTED'].valueChanges.pipe(
            takeUntil(this._unsubscribe)
        ).subscribe(data => {
            if (data === '000000000') {
                this.form.controls['rec.PRJ_GROUP_FILE_PROTECTED'].patchValue('');
            }
        });
    }
    fiillInputForCB(list: USER_LISTS[]) {
        const field = this.getField('PRJ_GROUP_FILE_PROTECTED');
        if (this._appContext.cbBase) {
            if (list && list.length) {
                if (this.chekOptions(field[0].options)) {
                    list.forEach((l: USER_LISTS) => {
                        field[0].options.push({ value: l.ISN_LIST, title: l.NAME });
                    });
                }
            } else {
                field[0].options.splice(1);
            }
        }
    }
    getField(name: string): any {
        return PRJ_RC_PARAM.fields.filter(field => {
            return field.key === name;
        });
    }
    chekOptions(key: Array<any>): boolean {
        if (key.length > 1) {
            return false;
        }
        return true;
    }
    edit() {
        this.form.enable({ emitEvent: false });
    }
    cancelEdit() {
        this.form.disable({ emitEvent: false });
    }
    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}
