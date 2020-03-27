import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { SETTINGS_MANAGEMENT_INPUTS, CUT_RIGHTS_INPUTS } from 'eos-user-select/shered/consts/settings-management.const';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OPEN_CLASSIF_USER_CL } from 'eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { PipRX, USER_CL } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';

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
    isnCopyFrom: number;
    formCopy: FormGroup;
    formCut: FormGroup;
    private _dataCopy: Map<string, any> = new Map();
    private _dataCut: Map<string, any> = new Map();
    private _ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        private _pipeSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices
    ) { }

    get disabledCopy(): boolean {
        return this.isnCopyFrom && this.checkForm(this.formCopy);
    }

    get disabledCutRights(): boolean {
        return this.checkForm(this.formCut);
    }

    ngOnInit() {
        this.inputsManage = this._inputCtrlSrv.generateInputs(SETTINGS_MANAGEMENT_INPUTS);
        this.formCopy = this._inputCtrlSrv.toFormGroup(this.inputsManage, false);
        this.inputsCut = this._inputCtrlSrv.generateInputs(CUT_RIGHTS_INPUTS);
        this.formCut = this._inputCtrlSrv.toFormGroup(this.inputsCut, false);
        this._subscribe();
    }

    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }

    copySettings(): Promise<any> {
        const url = this._createUrlForSop(this.formCopy, 'UserRightsCopy?');
        this.isLoading = true;
        return this._pipeSrv.read({
            [url]: ALL_ROWS
        }).then(() => {
            this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
            this.resetForm(true);
        }).catch((e) => {
            this._errorSrv.errorHandler(e);
            this.resetForm(true);
        });
    }

    cutRights(): Promise<any> {
        const url = this._createUrlForSop(this.formCut, 'UserRightsReset?');
        this.isLoading = true;
        return this._pipeSrv.read({
            [url]: ALL_ROWS
        }).then(() => {
            this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
            this.resetForm(false);
        }).catch((e) => {
            this._errorSrv.errorHandler(e);
            this.resetForm(false);
        });
    }

    close() {
        this.closedModal.emit();
    }

    resetForm(copyForm: boolean ) {
        if (copyForm) {
            this._dataCopy.clear();
        } else {
            this._dataCut.clear();
            this.formCopy.controls['USER_COPY'].patchValue('', { emitEvent: false });
        }
        this.isLoading = false;
        this.isnCopyFrom = null;
    }

    selectUser() {
        this.isShell = true;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_USER_CL)
            .then(data => {
                this.isnCopyFrom = +data;
                return this._getUserCl(data);
            })
            .then(data => {
                this.isShell = false;
                this.formCopy.get('USER_COPY').patchValue(data[0]['SURNAME_PATRON']);
            })
            .catch((e) => {
                if (e) {
                    this._errorSrv.errorHandler(e);
                }
                this.isShell = false;
            });
    }

    cleanUser() {
        this.formCopy.controls['USER_COPY'].patchValue('');
        this.isnCopyFrom = null;
    }

    checkForm(form: FormGroup): boolean {
        let flag = false;
        Object.keys(form.controls).forEach(key => {
            if (key !== 'USER_COPY' && form.controls[key].value) {
                flag = true;
            }
        });
        return flag;
    }

    private _createUrlForSop(form: FormGroup, soap: string) {
        let url = soap;
        url += `users=${this.checkedUsers.join('|')}`;
        url += `&user=${this.isnCopyFrom}`;
        url += `&rights=${this._getRightsData(form)}`;
        return url;
    }

    private _getRightsData(form: FormGroup): string {
        let str = '';
        Object.keys(form.controls).forEach(key => {
            if (key !== 'USER_COPY') {
                str += form.controls[key].value ? '1' : '0';
                form.controls[key].patchValue(false, { emitEvent: false });
            } else {
                form.controls[key].patchValue('', { emitEvent: false });
            }
        });
        return str;
    }

    private _subscribe() {
        this.formCopy.valueChanges
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                Object.keys(this.inputsManage).forEach(input => {
                    if (this.inputsManage[input].value !== this.formCopy.controls[input].value) {
                        this._dataCopy.set(input, this.formCopy.controls[input].value);
                    } else {
                        this._dataCopy.delete(input);
                    }
                });
            });
        this.formCut.valueChanges
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                Object.keys(this.inputsCut).forEach(input => {
                    if (this.inputsCut[input].value !== this.formCut.controls[input].value) {
                        this._dataCut.set(input, this.formCut.controls[input].value);
                    } else {
                        this._dataCut.delete(input);
                    }
                });
            });
    }

    private _getUserCl(isn) {
        const queryUser = {
            USER_CL: {
                criteries: {
                    ISN_LCLASSIF: isn
                }
            }
        };
        return this._pipeSrv.read<USER_CL>(queryUser);
    }
}
