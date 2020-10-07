import { Component, Injector, Input } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { AUTH_PARAM } from '../shared/consts/auth-consts';
import { PARM_CANCEL_CHANGE } from '../shared/consts/eos-parameters.const';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AuthenticationCollectionComponent } from './collection/collection.component';

@Component({
    selector: 'eos-param-authentication',
    templateUrl: 'param-authentication.component.html'
})
export class ParamAuthenticationComponent extends BaseParamComponent {
    @Input() btnError;
    modalCollection: BsModalRef;
    readOnlyPassCase: boolean;
    readOnlyPassListSubstr: boolean;
    collectionVisible = true;
    public masDisable: any[] = [];
    editMode: boolean;
    constructor(
        private _modalSrv: BsModalService,
        injector: Injector
    ) {
        super(injector, AUTH_PARAM);
        this.init()
            .then(() => {
                this.afterInitRC();
            }).catch(err => {
                if (err.code !== 434) {
                    console.log(err);
                }
            });
    }
    cancel() {
        if (this.isChangeForm) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.formChanged.emit(false);
            this.form.controls['rec.MAX_LOGIN_ATTEMPTS'].reset();
            this.ngOnDestroy();
            this.init()
                .then(() => {
                    this.afterInitRC();
                    this.cancelEdit();
                })
                .catch(err => {
                    if (err.code !== 434) {
                        console.log(err);
                    }
                });
        }
        this.masDisable = [];
        this.cancelEdit();
    }
    afterInitRC() {
        this.subscriptions.push(
            this.form.controls['rec.CHANGE_PASS'].valueChanges
                .subscribe(newValue => {
                    this.checkDataToDisabled('CHANGE_PASS', true);
                })
        );
        this.form.controls['rec.CHANGE_PASS'].updateValueAndValidity();

        this.subscriptions.push(
            this.form.controls['rec.PASS_ALF'].valueChanges
                .subscribe(newValue => {
                    if (this.form.controls['rec.PASS_ALF'].enabled) {
                        if (+newValue > 1) {
                            this.readOnlyPassCase = false;
                            this.form.controls['rec.PASS_CASE'].enable();
                        } else {
                            this.readOnlyPassCase = true;
                            this.form.controls['rec.PASS_CASE'].patchValue(false);
                            this.form.controls['rec.PASS_CASE'].disable();
                        }
                    }
                })
        );
        this.form.controls['rec.PASS_ALF'].updateValueAndValidity();

        this.subscriptions.push(
            this.form.controls['rec.PASS_LIST'].valueChanges
                .subscribe(newValue => {
                    if (this.form.controls['rec.PASS_LIST'].enabled) {
                        if (newValue) {
                            this.readOnlyPassListSubstr = false;
                            this.form.controls['rec.PASS_LIST_SUBSTR'].enable();
                        } else {
                            this.readOnlyPassListSubstr = true;
                            this.form.controls['rec.PASS_LIST_SUBSTR'].disable();
                        }
                    }
                })
        );
        this.form.controls['rec.PASS_LIST'].updateValueAndValidity();
        this.masDisable = [];
        this.cancelEdit();

    }
    submit() {
        // добавил поле PASS_DATE чтобы убрать ошибку смены пароля
        ['PASS_SPEC', 'PASS_NUM', 'PASS_ALF', 'PASS_MINLEN', 'PASS_DATE'].forEach(VALUE => { // при сохранении пустой строки на новом пользователе при вервом входе будет ошибка 118057
            const control = this.form.controls[`rec.${VALUE}`];
            if (!control.value || control.value === '') {
                control.patchValue('0', {emitEvent: false});
                this.newData.rec[VALUE] = '0';
            }
        });
        super.submit();
    }
    edit() {
        Object.keys(this.form.controls).forEach(key => {
            if (this.masDisable.indexOf(key) >= 0) {
                this.form.controls[key].enable({ emitEvent: false });
            }
        });
        this.editMode = false;
    }
    cancelEdit() {
        Object.keys(this.form.controls).forEach(key => {
            if (!this.form.controls[key].disabled) {
                this.masDisable.push(key);
            }
        });
        this.form.disable({ emitEvent: false });
        this.editMode = true;
    }
    openCollection() {
        // this.collectionVisible = value;
        this.modalCollection = this._modalSrv.show(AuthenticationCollectionComponent, {
            class: 'modal-collection',
            ignoreBackdropClick: true
        });
        this.modalCollection.content.closeCollection.subscribe(() => {
            this.modalCollection.hide();
        });
    }
}
