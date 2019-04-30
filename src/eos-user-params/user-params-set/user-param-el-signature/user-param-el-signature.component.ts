import { Component, TemplateRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';

import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { UserParamsService } from '../../shared/services/user-params.service';
import { ELECTRONIC_SIGNATURE } from '../shared-user-param/consts/electronic-signature';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { FormHelperService } from '../../shared/services/form-helper.services';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE, PARM_ERROR_DB } from '../shared-user-param/consts/eos-user-params.const';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import {ErrorHelperServices} from '../../shared/services/helper-error.services';
@Component({
    selector: 'eos-user-param-el-signature',
    // styleUrls: ['user-param-el-signature.component.scss'],
    templateUrl: 'user-param-el-signature.component.html',
    providers: [FormHelperService],
})

export class UserParamElSignatureComponent implements OnInit, OnDestroy {
    public titleHeader: string;
    public control: AbstractControl;
    public form: FormGroup;
    public inputs: any;
    public nameButton: string;
    public controlName: string;
    public btnDisabled: boolean = false;
    public isLoading: boolean = true;
    public editFlag: boolean = false;
    public disablebtnCarma: boolean = false;
    // sendFrom: string = '';
    // saveValueSendForm: string = '';
    private inputFields: any;
    // private modalRef: BsModalRef;
    private newDataForSave = new Map();
    private mapBtnName = new Map([
        ['CERT_WEB_STORES', 'Хранилища сертификатов для сервера удаленной проверки'],
        ['CERT_OTHER_STORES', 'Хранилища прочих сертификатов'],
        ['CERT_USER_STORES', 'Хранилища сертификатов пользователя']
    ]);

    private readonly first = ['CRYPTO_ACTIVEX', 'CRYPTO_INITSTR', 'SIGN_BASE64', 'PKI_ACTIVEX', 'PKI_INITSTR'];
    private readonly second = ['WEB_CRYPTO_ACTIVEX', 'WEB_CRYPTO_INITSTR', 'WEB_PKI_ACTIVEX', 'WEB_PKI_INITSTR'];
    private listForQuery: Array<string> = [];
    private _ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        private _userSrv: UserParamsService,
        private _router: Router,
        private _inputCtrlSrv: InputParamControlService,
        private _formHelper: FormHelperService,
        private _modalService: BsModalService,
        private apiSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices,
    ) {}
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    async ngOnInit() {
        this._userSrv.saveData$
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                this._userSrv.submitSave = this.submit();
            });

        await this._userSrv.getUserIsn();
        this.titleHeader = this._userSrv.curentUser['SURNAME_PATRON'] + ' - ' + 'Электронная подпись';

        this.init();
    }

    init() {
        this.inputFields = this._formHelper.fillInputFieldsSetParams(ELECTRONIC_SIGNATURE);
        this.getList(this.inputFields);
        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this.isLoading = false;
        this.subscribeForm();
        this.disableForEditAllForm(this.editFlag);
    }

    getList(listlistForQuery: Array<any>) {
        listlistForQuery.forEach(list => {
            this.listForQuery.push(list['key']);
        });
    }

    subscribeForm() {
        let count_error = 0;
        this.form.valueChanges
            .pipe(
                debounceTime(200)
            )
            .subscribe(newVal => {
                Object.keys(newVal).forEach(val => {
                    if (!this.getFactValueFuck(newVal[val], val)) {
                        this.setNewData(newVal, val, true);
                        count_error += 1;
                    } else {
                        this.setNewData(newVal, val, false);
                    }
                });
                if (count_error > 0) {
                    this.btnDisabled = true;
                } else {
                    this.btnDisabled = false;
                }
                this._pushState();
                count_error = 0;
            });
    }
    openPopup(template: TemplateRef<any>, controlName) {
        this.nameButton = this.mapBtnName.get(controlName);
        this.control = this.form.controls[controlName];
        this.controlName = controlName;
        /* this.modalRef =  */this._modalService.show(template, { class: 'modal-mode' });
    }

    getFactValueFuck(newValue: any, val: string): boolean {
        const oldValue = this.inputs[val].value;
        return oldValue !== newValue ? false : true;
    }

    setNewData(newValObj, newValue, flag) {
        if (flag) {
            this.newDataForSave.set(newValue, newValObj[newValue]);
        } else {
            if (this.newDataForSave.has(newValue)) {
                this.newDataForSave.delete(newValue);
            }
        }
    }

    disableForEditAllForm(event) {
        Object.keys(this.inputs).forEach(key => {
            if (!event) {
                this.form.controls[key].disable({ onlySelf: true, emitEvent: false });
            } else {
                this.form.controls[key].enable({ onlySelf: true, emitEvent: false });
            }
        });
    }

    submit(event?): Promise<any> {
        return this.apiSrv
            .batch(this.createObjRequest(), '')
            .then(data => {
                this.upStateInputs();
                this.btnDisabled = false;
                this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                // this._userSrv.getUserIsn(String(userId));
                this.editFlag = false;
                this.disableForEditAllForm(event);
                this._pushState();
                this.isLoading = false;
            })
            .catch(error => {
                this._errorSrv.errorHandler(error);
                this.cancellation();
            });
    }

    createObjRequest(): any[] {
        const req = [];
        const userId = this._userSrv.userContextId;
        Array.from(this.newDataForSave).forEach(val => {
            let parn_Val;
            if (typeof val[1] === 'boolean') {
                val[1] === false ? parn_Val = 'NO' : parn_Val = 'YES';
            } else {
                String(val[1]) === 'null' ? parn_Val = '' : parn_Val = val[1];
            }
            req.push({
                method: 'MERGE',
                requestUri: `USER_CL(${userId})/USER_PARMS_List(\'${userId} ${val[0]}\')`,
                data: {
                    PARM_VALUE: `${parn_Val}`
                }
            });
        });
        return req;
    }
    upStateInputs() {
        Object.keys(this.inputs).forEach(inp => {
            const value = this.form.controls[inp].value;
            this.inputs[inp].value = value;
        });
    }

    cancellation(event?) {
        if (this.btnDisabled) {
            this._msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
        }
        this.fillFormDefaultValues(this.inputs);
        this.editFlag = event;
        this.disableForEditAllForm(event);
    }
    fillFormDefaultValues(inputsForDefault) {
        Object.keys(inputsForDefault).forEach(key => {
            this.form.controls[key].patchValue(inputsForDefault[key].value);
        });
    }

    fillFormDefault(listForDefault: Array<any>) {
        listForDefault.forEach(list => {
            let value = String(list['PARM_VALUE']);
            if (value === 'null' || value === 'undefined') {
                value = '';
            } else {
                value = value;
            }
            this.form.controls[list['PARM_NAME']].patchValue(value);
        });
    }
    edit(event) {
        this.editFlag = event;
        this.disableForEditAllForm(event);
        this.disableOrEnabel();

    }
    close(event) {
        this._router.navigate(['user_param', JSON.parse(localStorage.getItem('lastNodeDue'))]);
    }

    default(event) {
        const defaultListName = this.getQueryDefaultList(this.listForQuery);
        this.apiSrv.read(defaultListName).then(result => {
            this.fillFormDefault(result.splice(1));
        }).catch(error => {
            this._msgSrv.addNewMessage(PARM_ERROR_DB);
        });
    }
    getQueryDefaultList(list) {
        return {
            'USER_PARMS': {
                criteries: {
                    PARM_NAME: list.join('||'),
                    ISN_USER_OWNER: '-99'
                }
            }
        };
    }

    disableOrEnabel() {
        const value = this.form.controls['REMOTE_CRYPTO_SERVER'].value;
        this.disablebtnCarma = value;
        if (value) {
            this.second.forEach(el => {
                this.form.controls[el].enable({ emitEvent: false });
            });
            this.first.forEach(el => {
                this.form.controls[el].disable({ emitEvent: false });
            });
        } else {
            this.second.forEach(el => {
                this.form.controls[el].disable({ emitEvent: false });
            });
            this.first.forEach(el => {
                this.form.controls[el].enable({ emitEvent: false });
            });
        }
    }
    private _pushState() {
        this._userSrv.setChangeState({ isChange: this.btnDisabled });
    }
}
