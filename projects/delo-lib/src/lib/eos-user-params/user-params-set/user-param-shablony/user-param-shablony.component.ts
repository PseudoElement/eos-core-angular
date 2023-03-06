import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { OTHER_USER_SHABLONY } from '../shared-user-param/consts/other.consts';
import { UserParamsService } from '../../shared/services/user-params.service';
import { FormHelperService } from '../../shared/services/form-helper.services';
import { EosDataConvertService } from '../../../eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from '../../../eos-common/services/input-control.service';
// import { EosMessageService } from 'eos-common/services/eos-message.service';
import { AppContext } from '../../../eos-rest/services/appContext.service';
import { PipRX } from '../../../eos-rest';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../../eos-user-params/shared/services/helper-error.services';

@Component({
    selector: 'eos-user-param-shablony',
    templateUrl: 'user-param-shablony.component.html',
    styleUrls: ['user-param-shablony.component.scss'],
    providers: [FormHelperService],
})

export class UserParamShablonyComponent implements OnDestroy, OnInit {
    @Input() defaultTitle: string;
    @Input() defaultUser: any;
    @Input() mainUser?;
    @Input() isCurrentSettings?: boolean;

    @Output() DefaultSubmitEmit: EventEmitter<any> = new EventEmitter();
    public initShablony: Array<any>;
    public form: UntypedFormGroup;
    public inputs: any;
    public btnDisable;
    public currentUser;
    public defaultValues;
    private allData: any;
    private prepareData: any;
    private prepareInputs: any;
    private mapChanges = new Map();
    private defoltInputs: any;
    private flagEdit: boolean = false;

    get titleHeader() {
        if (this.currentUser) {
            if (this.currentUser.isTechUser) {
                return this.defaultTitle ? 'Шаблоны по умолчанию' : this.currentUser.CLASSIF_NAME + '- Шаблоны';
            }
            return this.defaultTitle ? 'Шаблоны по умолчанию' : `${this.currentUser['DUE_DEP_SURNAME']} - Шаблоны`;
        }
        return '';
    }
    constructor(
        private _userSrv: UserParamsService,
        private formHelp: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private _appContext: AppContext,
        private _pipRx: PipRX,
        private _msg: EosMessageService,
        private _errorSrv: ErrorHelperServices
    ) {
        this.flagEdit = false;
        this.btnDisable = true;
    }

    ngOnInit() {
        this.flagEdit = !!this.isCurrentSettings;
        if (this.defaultTitle) {
            this.currentUser = this.defaultTitle;
            this.allData = this.defaultUser;
            this.inint();
            this.initShablony = this.getInitShablony(this.defaultUser);
            this.defaultValues = [];
        } else {
            const config = {expand: 'USER_PARMS_List'};
            if (this.mainUser) {
                config['isn_cl'] = this.mainUser;
            }
            this._userSrv.getUserIsn(config)
                .then((d) => {
                    this.allData = this._userSrv.hashUserContext;
                    this.currentUser = this._userSrv.curentUser;
                    this.inint();
                    this.initShablony = this.getInitShablony(this.allData);
                    this.currentUser = this._userSrv.curentUser;
                    this._pipRx.read(this.formHelp.getObjQueryInputsField()).then(data => {
                        this.defaultValues = this.formHelp.createhash(data);
                    }).catch(error => {
                        this._errorSrv.errorHandler(error);
                    });
                })
                .catch(err => {
                });
        }
    }

    ngOnDestroy() {}

    getInitShablony(result) {
        const arrayDateMain = [];
        let prepareObj = {};
        Object.keys(this.inputs).forEach(el => {
            prepareObj['PARM_NAME'] = el.substr(4);
            prepareObj['PARM_VALUE'] = result[el.substr(4)];
            prepareObj['keyForm'] = el;
            arrayDateMain.push(prepareObj);
            prepareObj = {};
        });
        return arrayDateMain;
    }

    checkElem() {
        let flag = true;
        OTHER_USER_SHABLONY.fields.forEach(element => {
            if (element.key === 'Реестр перечня РК') {
                flag = false;
            }
        });
        return flag;
    }

    inint() {
        if (this._appContext.cbBase && this.checkElem()) {
            OTHER_USER_SHABLONY.fields.splice(25, 0,
            {
                key: 'Реестр перечня РК',
                type: 'string',
                title: ''
            },
            {
                key: 'Реестр РК',
                type: 'string',
                title: ''
            },

            );
        }
        this.prepareData = this.formHelp.parse_Create(OTHER_USER_SHABLONY.fields, this.allData);
        this.prepareInputs = this.formHelp.getObjectInputFields(OTHER_USER_SHABLONY.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.editMode();
        this.formSubscriber();
    }

    formSubscriber() {
        this.form.valueChanges.subscribe(data => {
            this.checkTouch(data);
        });
    }

    checkTouch(data) {
        let countError = 0;
        Object.keys(data).forEach(key => {
            if (this.inputs[key].value !== data[key]) {
                countError += 1;
                this.mapChanges.set(key.substring(4), data[key]);
            } else {
                if (this.mapChanges.has(key.substring(4))) {
                    this.mapChanges.delete(key.substring(4));
                }
            }
        });
        if (countError > 0 || this.mapChanges.size) {
            this.btnDisable = false;
        } else {
            this.btnDisable = true;
        }
        this._pushState();
    }

    prepFormForSave() {
        Object.keys(this.inputs).forEach((key) => {
            const value = this.form.controls[key].value;
            this.inputs[key].value = value;
        });
    }

    prepFormCancel(input, flag) {
        Object.keys(input).forEach((key) => {
            const val = input[key].value;
            this.form.controls[key].patchValue(val, { emitEvent: flag });
        });
    }

    editMode() {
        if (this.flagEdit) {
            this.form.enable({ emitEvent: false });
        } else {
            this.form.disable({ emitEvent: false });
        }
    }

    edit($event) {
        this.flagEdit = $event;
        this.editMode();
    }

    submit() {
        if (this.mapChanges.size) {
            return this._pipRx.batch(this.createUrl(), '').then(() => {
                this.prepFormForSave();
                this.mapChanges.clear();
                this.btnDisable = true;
                this._pushState();
                if (!this.isCurrentSettings) {
                    this.flagEdit = false;
                } else {
                    this.btnDisable = false;
                }
                // this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
                this.editMode();
                if (this.defaultTitle) {
                    this.DefaultSubmitEmit.emit(this.form.value);
                }
                this._msg.addNewMessage(this.createMessage('success', '', 'Изменения сохранены'));
            }).catch((error) => {
                this._errorSrv.errorHandler(error);
                this.cancel();
                this._msg.addNewMessage(this.createMessage('warning', '', 'Изменения не сохранены'));
            });
        } else {
            this.cancel();
        }
    }

    createUrl(): any[] {
        const req = [];
        if (this.defaultUser) {
            if (this.mapChanges.size) {
                req.concat(this.formHelp.CreateDefaultRequest(req, this.mapChanges));
            }
        } else {
            const userId = this._userSrv.userContextId;
            if (this.mapChanges.size) {
                req.concat(this.formHelp.pushIntoArrayRequest(req, this.mapChanges, userId));
            }
        }
        return req;
    }

    default(event?) {
        this.prepareData = {};
        this.prepareInputs = {};
        this.prepareData = this.formHelp.parse_Create(OTHER_USER_SHABLONY.fields, this.defaultValues);
        this.prepareInputs = this.formHelp.getObjectInputFields(OTHER_USER_SHABLONY.fields);
        this.defoltInputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.prepFormCancel(this.defoltInputs, true);
    }

    cancel($event?) {
        this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
        this.flagEdit = false;
        this.prepFormCancel(this.inputs, true);
        this.mapChanges.clear();
        this.btnDisable = true;
        this.flagEdit = false;
        this._pushState();
        this.editMode();
    }

    createMessage(type, title, msg) {
        return {
            type: type,
            title: title,
            msg: msg,
            dismissOnTimeout: 6000,
        };
    }

    private _pushState() {
        this._userSrv.setChangeState({ isChange: !this.btnDisable });
    }

}
