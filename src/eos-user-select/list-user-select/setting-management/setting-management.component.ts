import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
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

@Component({
    selector: 'eos-setting-management',
    templateUrl: 'setting-management.component.html',
})
export class SettingManagementComponent implements OnInit {
    @Output() closedModal = new EventEmitter();
    @Input() checkedUsers: number[];
    inputsManage: any;
    inputsCut: any;
    isLoading: boolean = false;
    isShell: boolean = false;
    formCopy: FormGroup;
    formCut: FormGroup;
    private _isnCopyFrom: number;

    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        private _pipeSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices
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
    }

    copySettings(): Promise<any> {
        const url = this._createUrlForSop(this.formCopy, true);
        this.isLoading = true;
        return this._pipeSrv.read({
            [url]: ALL_ROWS
        }).then(() => {
            this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
            this.isLoading = false;
            this._isnCopyFrom = null;
        }).catch((e) => {
            this._errorSrv.errorHandler(e);
            this.isLoading = false;
            this._isnCopyFrom = null;
        });
    }

    cutRights(): Promise<any> {
        const url = this._createUrlForSop(this.formCut);
        this.isLoading = true;
        return this._pipeSrv.read({
            [url]: ALL_ROWS
        }).then(() => {
            this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
            this.isLoading = false;
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
                this._isnCopyFrom = +data;
                return this._getUserCl(data);
            })
            .then(data => {
                this.isShell = false;
                this.formCopy.get('USER_COPY').patchValue(data[0]['SURNAME_PATRON']);
                this._pathForm();
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
            url = 'UserRightsCopy?';
        } else {
            url = 'UserRightsReset?';
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
                form.controls[key].patchValue(false);
            } else {
                form.controls[key].patchValue('');
            }
        });
        return str;
    }

    private _pathForm(init?: boolean): void {
        Object.keys(this.formCopy.controls).forEach(key => {
            if (key === '2' || key === '4') {
                this.formCopy.controls[key].patchValue(false);
                if (init) {
                    this.formCopy.controls[key].disable();
                } else {
                    this.formCopy.controls[key].enable();
                }
            } else if (key === 'USER_COPY') {
                if (init) {
                    this.formCopy.controls[key].patchValue('');
                }
            } else {
                if (init) {
                    this.formCopy.controls[key].patchValue(false);
                    this.formCopy.controls[key].disable();
                } else {
                    this.formCopy.controls[key].patchValue(true);
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
}
