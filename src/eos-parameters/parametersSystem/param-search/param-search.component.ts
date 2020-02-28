import { Component, Injector, Input } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from './../shared/consts/eos-parameters.const';
import { SEARCH_PARAM } from './../shared/consts/search-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'eos-param-search',
    templateUrl: 'param-search.component.html'
})
export class ParamSearchComponent extends BaseParamComponent {
    @Input() btnError;
    public masDisable: any[] = [];
    constructor(injector: Injector) {
        super(injector, SEARCH_PARAM);
        this.init()
            .then(() => {
                this.afterInitRC();
                this.setValidators();
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
                    // this.cancelEdit();
                    this.afterInitRC();
                    this.setValidators();
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
        this.cancelEdit();
    }
    edit() {
        Object.keys(this.form.controls).forEach(key => {
            if (this.masDisable.indexOf(key) >= 0) {
                this.form.controls[key].enable({ emitEvent: false });
            }
        });
    }

    submit() {
        if (this.newData) {
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this.paramApiSrv
            .setData(this.createObjRequest())
            .then(data => {
                    this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this.cancelEdit();
                })
                .catch(data => {
                    this.formChanged.emit(true);
                    this.isChangeForm = true;
                    this.msgSrv.addNewMessage({
                        type: 'danger',
                        title: 'Ошибка сервера',
                        msg: data.message ? data.message : data
                    });
                    this.cancelEdit();
                });
        }
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
    private setValidators() {
        this.form.controls['rec.FULLTEXT_EXTENSIONS'].setAsyncValidators((control: AbstractControl) => {
            if (control.value) {
                if (control.value.search(/^[^\\\/\|\:\.\*?]{0,2000}$/) !== -1) {
                    for (let index = 0; index < control.value.length; index++) {
                        if (control.value[index].charCodeAt(0) < 31) {
                            control.setErrors({ errorPattern: true });
                            return Promise.resolve({ errorPattern: true });
                        }
                    }
                } else {
                    control.setErrors({ errorPattern: true });
                    return Promise.resolve({ errorPattern: true });
                }
            }
            return Promise.resolve(null);
        });
    }
}
