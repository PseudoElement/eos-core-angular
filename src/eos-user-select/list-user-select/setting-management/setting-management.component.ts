import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { SETTINGS_MANAGEMENT_INPUTS } from 'eos-user-select/shered/consts/settings-management.const';
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
    disabledSubmit: boolean = false;
    inputs: any;
    isLoading: boolean = false;
    isShell: boolean = false;
    isnCopyFrom: number;
    form: FormGroup;
    private _data: Map<string, any> = new Map();
    private _ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        private _pipeSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices
    ) { }

    get disabledCopy(): boolean {
        return this.isnCopyFrom && this._data.size > 1;
    }

    ngOnInit() {
        this.inputs = this._inputCtrlSrv.generateInputs(SETTINGS_MANAGEMENT_INPUTS);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this._subscribe();
    }

    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }

    copySettings(): Promise<any> {
        const url = this._createUrlForSop();
        this.isLoading = true;
        return this._pipeSrv.read({
            [url]: ALL_ROWS
        }).then(() => {
            this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
            this.resetForm();
        }).catch(() => {
            this.resetForm();
        });
    }
    close() {
        this.closedModal.emit();
    }

    resetForm() {
        this.form.reset();
        this._data.clear();
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
                this.form.get('USER_COPY').patchValue(data[0]['SURNAME_PATRON']);
            })
            .catch((e) => {
                console.log(e);
                this._errorSrv.errorHandler(e);
                this.isShell = false;
            });
    }

    private _createUrlForSop() {
        let url = 'UserRightsCopy?';
        url += `users=${this.checkedUsers.join('|')}`;
        url += `&user=${this.isnCopyFrom}`;
        url += `&rights=${this._getRightsData()}`;
        return url;
    }

    private _getRightsData(): string {
        let str = '';
        Object.keys(this.form.controls).forEach(key => {
            if (str !== 'USER_COPY') {
                str += this.form.controls[key].value ? '1' : '0';
            }
        });
        return str;
    }

    private _subscribe() {
        this.form.valueChanges
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                Object.keys(this.inputs).forEach(input => {
                    if (this.inputs[input].value !== this.form.controls[input].value) {
                        this._data.set(input, this.form.controls[input].value);
                    } else {
                        this._data.delete(input);
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
