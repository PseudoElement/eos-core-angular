import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { SETTINGS_MANAGEMENT_INPUTS, CUT_RIGHTS_INPUTS } from 'eos-user-select/shered/consts/settings-management.const';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { OPEN_CLASSIF_USER_CL } from 'eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { PipRX, USER_CL } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_CUT_USER, CONFIRM_COPY_USER } from 'eos-dictionaries/consts/confirm.consts';
import { Subscription } from 'rxjs';
import { RtUserSelectService } from 'eos-user-select/shered/services/rt-user-select.service';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { AppContext } from 'eos-rest/services/appContext.service';
import { IMessage } from '../../../eos-common/core/message.interface';
import { WARNING_CUT_OWN_RIGHTS } from 'eos-user-select/consts/user-select.consts';


@Component({
    selector: 'eos-setting-management',
    templateUrl: 'setting-management.component.html',
})
export class SettingManagementComponent implements OnInit, OnDestroy {
    @Output() closedModal = new EventEmitter();
    @Input() checkedUsers: number[];
    inputsManage: any;
    inputsCut: any;
    isLoading: boolean = false;
    isShell: boolean = false;
    formCopy: FormGroup;
    formCut: FormGroup;
    private _isnCopyFrom: number;
    private _subscription: Subscription;

    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        private _pipeSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices,
        private _confirmSrv: ConfirmWindowService,
        private _rtSrv: RtUserSelectService,
        private _userSrv: UserParamsService,
        private _appCtx: AppContext,
    ) { }

    get disabledCopy(): boolean {
        return this._isnCopyFrom && this._checkForm(this.formCopy);
    }

    get disabledCutRights(): boolean {
        return this._checkForm(this.formCut);
    }

    ngOnInit() {
        this.inputsManage = this._inputCtrlSrv.generateInputs(SETTINGS_MANAGEMENT_INPUTS);
        this.formCopy = this._inputCtrlSrv.toFormGroup(this.inputsManage, false);
        this.inputsCut = this._inputCtrlSrv.generateInputs(CUT_RIGHTS_INPUTS);
        this.formCut = this._inputCtrlSrv.toFormGroup(this.inputsCut, false);
        this._pathForm(true);
        this._subscribeForm();
    }

    copySettings(): Promise<any> {
        this._rtSrv.hashUsers.clear();
        const url = this._createUrlForSop(this.formCopy, true);
        this.isLoading = true;
        return this._confirmSrv.confirm(CONFIRM_COPY_USER).then(res => {
            if (res) {
                return this._pipeSrv.read({
                    [url]: ALL_ROWS
                }).then(() => {
                    this.checkedUsers.forEach(u => {
                        this._userSrv.ProtocolService(u, 5);
                        if (this.formCopy.controls[7].value) {
                            this._userSrv.ProtocolService(u, 6);
                        }
                    });
                    this._rtSrv.updateSettings = true;
                    this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                    this._pathForm(true);
                    this.isLoading = false;
                    this._isnCopyFrom = null;
                });
            } else {
                this.isLoading = false;
            }
        }).catch((e) => {
            this._errorSrv.errorHandler(e);
            this.isLoading = false;
            this._isnCopyFrom = null;
        });
    }

    cutRights(): Promise<any> {
        const currentUserIsn = this._appCtx.CurrentUser['ISN_LCLASSIF'];
        if (this.checkedUsers && this.checkedUsers.length === 1 && this.checkedUsers[0] === currentUserIsn) {
            this._msgSrv.addNewMessage(WARNING_CUT_OWN_RIGHTS);
            this.close();
            return Promise.resolve(null);
        }

        const url = this._createUrlForSop(this.formCut);
        this.isLoading = true;
        return this._confirmSrv.confirm(CONFIRM_CUT_USER).then(res => {
            if (res) {
                return this._pipeSrv.read({
                    [url]: ALL_ROWS
                }).then(() => {
                    this.checkedUsers.forEach(u => {
                        this._userSrv.ProtocolService(u, 5);
                    });
                    this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                    this.formCut.reset();
                    this.isLoading = false;
                });
            } else {
                this.isLoading = false;
                return;
            }
        }).catch((e) => {
            this._errorSrv.errorHandler(e);
            this.isLoading = false;
        });
    }

    close(): void {
        this.closedModal.emit();
    }

    selectUser(): Promise<any> {
        this.isShell = true;
        return this._waitClassifSrv.openClassif(OPEN_CLASSIF_USER_CL)
            .then(data => {
                if (this.checkedUsers.length === 1 && this.checkedUsers.indexOf(+data) !== -1) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Выберите другого пользователя',
                    });
                    this.isShell = false;
                    return;
                }
                if (this.checkedUsers.indexOf(+data) !== -1) {
                    this.checkedUsers = this.checkedUsers.filter(isn => isn !== +data);
                }
                this._isnCopyFrom = +data;
                return this._getUserCl(data);
            })
            .then(data => {
                if (data) {
                    if (this._appCtx.limitCardsUser.length) {
                        const msg: IMessage = {
                            type: 'warning',
                            title: 'Предупреждение',
                            msg: 'Выберите пользователя, от которого необходимо скопировать права, относящегося к доступному подразделению для ограниченного технолога',
                        };
                        if (data[0]['TECH_DUE_DEP']) {
                            return this._getDepDue(data[0]['TECH_DUE_DEP']).then((dep) => {
                                this.isShell = false;
                                if (this._appCtx.limitCardsUser.length ) {
                                    const parentDue = dep[0]['DEPARTMENT_DUE'];
                                    if (!(this._appCtx.limitCardsUser.indexOf(parentDue) !== -1)) {
                                        this._isnCopyFrom = null;
                                        this._msgSrv.addNewMessage(msg);
                                        return;
                                    }
                                }
                                this.formCopy.get('USER_COPY').patchValue(data[0]['SURNAME_PATRON']);
                                this._pathForm();
                            });
                        } else {
                            this.isShell = false;
                            this._isnCopyFrom = null;
                            this._msgSrv.addNewMessage(msg);
                            return;
                        }

                    } else {
                        this.isShell = false;
                        if (data) {
                            this.formCopy.get('USER_COPY').patchValue(data[0]['SURNAME_PATRON']);
                            this._pathForm();
                        }
                    }
                }

            })
            .catch((e) => {
                if (e) {
                    this._errorSrv.errorHandler(e);
                }
                this.isShell = false;
            });
    }

    cleanUser(): void {
        this.formCopy.controls['USER_COPY'].patchValue('');
        this._pathForm(true);
        this._isnCopyFrom = null;
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private _checkForm(form: FormGroup): boolean {
        let flag = false;
        Object.keys(form.controls).forEach(key => {
            if (key !== 'USER_COPY' && form.controls[key].value) {
                flag = true;
            }
        });
        return flag;
    }

    private _createUrlForSop(form: FormGroup, copy?: boolean): string {
        let url;
        if (copy) {
            url = !this._appCtx.cbBase ? 'UserRightsCopy?' : 'UserRightsCopy_CB?';
        } else {
            url = !this._appCtx.cbBase ? 'UserRightsReset?' : 'UserRightsReset_CB?';
        }
        url += `users=${this.checkedUsers.join('|')}`;
        if (copy) {
            url += `&user=${this._isnCopyFrom}`;
        }
        url += `&rights=${this._getRightsData(form)}`;
        return url;
    }

    private _getRightsData(form: FormGroup): string {
        let str = '';
        Object.keys(form.controls).forEach(key => {
            if (key !== 'USER_COPY') {
                str += form.controls[key].value ? '1' : '0';
            }
        });
        return str;
    }

    private _pathForm(init?: boolean): void {
        Object.keys(this.formCopy.controls).forEach(key => {
            if (key === '2' || key === '4') {
                this.formCopy.controls[key].patchValue(false, {emitEvent: false});
                if (init) {
                    this.formCopy.controls[key].disable();
                } else {
                    this.formCopy.controls[key].enable();
                }
            } else if (key === 'USER_COPY') {
                if (init) {
                    this.formCopy.controls[key].patchValue('', {emitEvent: false});
                }
            } else {
                if (init) {
                    this.formCopy.controls[key].patchValue(false, {emitEvent: false});
                    this.formCopy.controls[key].disable();
                } else {
                    this.formCopy.controls[key].patchValue(true, {emitEvent: false});
                    this.formCopy.controls[key].enable();
                }
            }
        });
    }

    private _getUserCl(isn): Promise<USER_CL[]> {
        const queryUser = {
            USER_CL: {
                criteries: {
                    ISN_LCLASSIF: isn
                }
            }
        };
        return this._pipeSrv.read<USER_CL>(queryUser);
    }


    private _getDepDue(due): Promise<USER_CL[]> {
        const queryUser = {
            DEPARTMENT: {
                criteries: {
                    DUE: due
                }
            }
        };
        return this._pipeSrv.read<USER_CL>(queryUser);
    }

    private _subscribeForm() {
        this._subscription = this.formCopy.valueChanges.subscribe(data => {
            if (!this.formCopy.controls['1'].value) {
                this.formCopy.controls['2'].patchValue(false, {emitEvent: false});
            }
            if (!this.formCopy.controls['3'].value) {
                this.formCopy.controls['4'].patchValue(false, {emitEvent: false});
            }
        });
    }
}
