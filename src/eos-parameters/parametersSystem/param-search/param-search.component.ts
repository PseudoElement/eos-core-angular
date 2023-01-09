import { Component, Injector, Input, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from './../shared/consts/eos-parameters.const';
import { SEARCH_PARAM } from './../shared/consts/search-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { AbstractControl, Validators } from '@angular/forms';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';

const UPDATE_INDEXKIND: IConfirmWindow2 = {
    title: 'Предупреждение',
    bodyList: [],
    body: 'Для настройки полнотекстового поиска средствами СУБД или внешней службы необходимо выполнить конфигурирование серверной части системы Дело (см. Руководство администратора)',
    buttons: [
        {title: 'Продолжить ', result: 1, isDefault: true, },
        {title: 'Отменить',  result: 2, },
    ],
};
@Component({
    selector: 'eos-param-search',
    templateUrl: 'param-search.component.html'
})
export class ParamSearchComponent extends BaseParamComponent {
    @ViewChild('headerElement') headerElement;
    @Input() btnError;
    public masDisable: any[] = [];
    private indexKing; // тут храниться значение INDEXKIND чтобы после изменения знать что за значение было до этого
    constructor(injector: Injector) {
        super(injector, SEARCH_PARAM);
        this.init()
            .then(() => {
                this.afterInitRC();
                this.setValidators();
                this.indexKing = this.form.controls['rec.INDEXKIND'].value;
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
                    this.indexKing = this.form.controls['rec.INDEXKIND'].value;
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
            }),
            this.form.controls['rec.INDEXKIND'].valueChanges
            .subscribe(value => {
                if (this.indexKing === 'ES') {
                    this.confirmSrv.confirm2(Object.assign({}, UPDATE_INDEXKIND)).then((button) => {
                        if (button && button['result'] === 1) {
                            this.updateEsSettings(value);
                        } else {
                            this.form.controls['rec.INDEXKIND'].setValue(this.indexKing, { emitEvent: false });
                        }
                    });
                } else {
                    this.updateEsSettings(value);
                }
            })
        );
        this.cancelEdit();
    }
    updateEsSettings(value) {
        if (value === 'ES') {
            this.form.controls['rec.ES_SETTINGS'].setValidators([Validators.required]);
            this.inputs['rec.ES_SETTINGS'].required = true;
        } else {
            this.form.controls['rec.ES_SETTINGS'].setValidators(null);
            this.inputs['rec.ES_SETTINGS'].required = false;
        }
        /* Данное действие нужно для того чтобы отрабатывала проверка и ставился или убирался tooltip об ошибке */
        this.form.controls['rec.ES_SETTINGS'].setValue(this.form.controls['rec.ES_SETTINGS'].value);
        this.indexKing = this.form.controls['rec.INDEXKIND'].value;
    }
    edit() {
        Object.keys(this.form.controls).forEach(key => {
            if (this.masDisable.indexOf(key) >= 0) {
                this.form.controls[key].enable({ emitEvent: false });
            }
        });
    }
    preSubmit() {
        if (this.updateData['INDEXKIND'] === 'ES' || this.updateData['ES_SETTINGS']) {
            const message = Object.assign({}, UPDATE_INDEXKIND);
            message.body = 'Для работы полнотекстового поиска необходимо выполнить настройку службы Elasticsearch (см. Руководство администратора)';
            this.confirmSrv.confirm2(message).then((button) => {
                if (button && button['result'] === 1) {
                    this.submit();
                } else {
                    this.headerElement.editMode = true;
                }
            });
        }
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
