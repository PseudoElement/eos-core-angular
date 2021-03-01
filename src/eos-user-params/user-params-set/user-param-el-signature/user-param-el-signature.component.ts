import { Component, TemplateRef, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserParamsService } from '../../shared/services/user-params.service';
import { ELECTRONIC_SIGNATURE } from '../shared-user-param/consts/electronic-signature';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { FormHelperService } from '../../shared/services/form-helper.services';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE, PARM_ERROR_DB } from '../shared-user-param/consts/eos-user-params.const';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { CarmaHttpService, Istore } from 'app/services/carmaHttp.service';
import { CarmaHttp2Service } from 'app/services/camaHttp2.service';
import { IUserSettingsModes } from 'eos-user-params/shared/intrfaces/user-params.interfaces';
@Component({
    selector: 'eos-user-param-el-signature',
    // styleUrls: ['user-param-el-signature.component.scss'],
    templateUrl: 'user-param-el-signature.component.html',
    providers: [FormHelperService],
})

export class UserParamElSignatureComponent implements OnInit, OnDestroy {
    @Input() defaultTitle: string;
    @Input() defaultUser: any;
    @Input() mainUser?;
    @Input() isCurrentSettings?: boolean;
    @Input() appMode: IUserSettingsModes;

    @Output() DefaultSubmitEmit: EventEmitter<any> = new EventEmitter();
    public control: AbstractControl;
    public form: FormGroup;
    public inputs: any;
    public nameButton: string;
    public controlName: string;
    public btnDisabled: boolean = false;
    public isLoading: boolean = true;
    public editFlag: boolean = false;
    public disablebtnCarma: boolean = false;
    public currentUser;
    get titleHeader() {
        if (this.currentUser) {
            if (this.currentUser.isTechUser) {
                return this.defaultTitle ? 'Электронная подпись по умолчанию' : this.currentUser.CLASSIF_NAME + '- Электронная подпись';
            }
            return this.defaultTitle ? 'Электронная подпись по умолчанию' : `${this.currentUser['DUE_DEP_SURNAME']} - Электронная подпись`;
        }
        return '';
    }
    private allData;
    private inputFieldsDefault;
    // sendFrom: string = '';
    // saveValueSendForm: string = '';
    private inputFields: any;
    // private modalRef: BsModalRef;
    private newDataForSave = new Map();
    private mapBtnName = new Map([
        ['CERT_DIFF_CHECK_STORES', 'Хранилища сертификатов для проверки'],
        ['CERT_OTHER_STORES', 'Хранилища прочих сертификатов'],
        ['CERT_USER_STORES', 'Хранилища сертификатов пользователя']
    ]);

    // private readonly first = ['CRYPTO_ACTIVEX', 'CRYPTO_INITSTR', 'SIGN_BASE64', 'PKI_ACTIVEX', 'PKI_INITSTR'];
    private readonly second = ['DIFF_CHECK_CRYPTO_INITSTR', 'DIFF_CHECK_PKI_INITSTR'];
    private listForQuery: Array<string> = [];
    constructor(
        private _userSrv: UserParamsService,
        private _inputCtrlSrv: InputParamControlService,
        private _formHelper: FormHelperService,
        private _modalService: BsModalService,
        private apiSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices,
        public carmaHttp2Srv: CarmaHttp2Service,
        public certStoresService: CarmaHttpService,
    ) { }
    get isWebAndArm() {
        if (!this.isCurrentSettings) {
            return true;
        }
        const rules = ['arm', 'cbr'];
        let hasRule = false;
        rules.forEach((rule) => {
            if (this.appMode.hasOwnProperty(rule)) {
                hasRule = true;
            }
        });
        return hasRule;
    }
    ngOnDestroy() { }
    ngOnInit() {
        this.editFlag = !!this.isCurrentSettings;
        if (this.defaultTitle) {
            this.currentUser = this.defaultTitle;
            this.allData = this.defaultUser;
            this.init();
            const stores: Istore[] = [{ Location: 'sscu', Address: '', Name: 'My' }];
            this.carmaHttp2Srv.connect('', stores);
        } else {
            const config = {expand: 'USER_PARMS_List'};
            if (this.mainUser) {
                config['isn_cl'] = this.mainUser;
            }
            this._userSrv.getUserIsn(config).then(() => {
                this.currentUser = this._userSrv.curentUser;
                this.init();
            })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    init() {
        if (this.defaultTitle) {
            this.inputFields = this._formHelper.fillInputFieldsSetParams(ELECTRONIC_SIGNATURE, this.allData);
        } else {
            const user_param = this._userSrv.curentUser['USER_PARMS_HASH'];
            this.inputFields = this._formHelper.fillInputFieldsSetParams(ELECTRONIC_SIGNATURE, user_param);
        }
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

    getQueryList(data) {
        const arraQlist = [];
        data.forEach((el) => {
            arraQlist.push(el.key);
        });
        return arraQlist;
    }

    subscribeForm() {
        let count_error = 0;
        this.form.valueChanges
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
        if (!event) {
            this.form.disable({ onlySelf: true, emitEvent: false });
        } else {
            this.form.enable({ onlySelf: true, emitEvent: false });
        }
    }

    submit(event?): Promise<any> {
        let query;
        if (this.defaultTitle) {
            query = this._formHelper.CreateDefaultRequest([], this.newDataForSave);
        } else {
            query = this.createObjRequest();
        }
        return this.apiSrv
            .batch(query, '')
            .then(data => {
                this.upStateInputs();
                this.btnDisabled = false;
                this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                // this._userSrv.getUserIsn(String(userId));
                this.editFlag = false;
                this.disableForEditAllForm(event);
                this._pushState();
                this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
                if (this.defaultTitle) {
                    this.DefaultSubmitEmit.emit([this.form.controls, true]);
                }
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
        this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
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
            this.form.controls[list.key].patchValue(list.value);
        });
    }
    edit(event) {
        this.editFlag = event;
        this.disableForEditAllForm(event);
        this.disableOrEnabel();
    }

    default(event) {
        const defaultListName = this._formHelper.getObjQueryInputsFieldForDefault(this.listForQuery);
        this.apiSrv.read(defaultListName).then(result => {
            this.inputFieldsDefault = this._formHelper.fillInputFieldsSetParams(ELECTRONIC_SIGNATURE, this._formHelper.createhash(result));
            this.fillFormDefault(this.inputFieldsDefault);
            this.disableOrEnabel();
        }).catch(error => {
            this._msgSrv.addNewMessage(PARM_ERROR_DB);
        });
    }

    disableOrEnabel() {
        const value = this.form.controls['DIFF_CHECK_EDS'].value;
        this.disablebtnCarma = value;
        if (value) {
            this.second.forEach(el => {
                this.form.controls[el].enable({ emitEvent: false });
            });
            // this.first.forEach(el => {
            //     this.form.controls[el].disable({ emitEvent: false });
            // });
        } else {
            this.second.forEach(el => {
                this.form.controls[el].disable({ emitEvent: false });
            });
            // this.first.forEach(el => {
            //     this.form.controls[el].enable({ emitEvent: false });
            // });
        }
    }
    private _pushState() {
        this._userSrv.setChangeState({ isChange: this.btnDisabled });
    }
}
