import {Component, OnInit} from '@angular/core';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { FormGroup } from '@angular/forms';
import { IInputParamControl, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import {FormHelperService} from '../shared/services/form-helper.services';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IMessage } from 'eos-common/interfaces';
import { RestError } from 'eos-rest/core/rest-error';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { Router } from '@angular/router';
const BASE_PARAM_INPUTS: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'STREAM_SCAN_RIGHTS_BD',
        label: 'Сканирование на запись в БД',
        required: true,
        disabled: true,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'STREAM_SCAN_RIGHTS_ARM',
        label: 'Настройка АРМ сканирования',
        required: true,
        disabled: true,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'STREAM_SCAN_RIGHTS_BAR_CODE',
        label: 'Печать штрих кода',
        required: true,
        disabled: true,
    }
];
@Component({
    selector: 'eos-inline-scaning',
    styleUrls: ['inline-scaning.component.scss'],
    templateUrl: 'inline-scaning.component.html',
    providers: [FormHelperService]
})

export class InlineScaningComponent implements OnInit {
    public editMode = false;
    public curentUser: IParamUserCl;
    public link: number;
    public title: string = 'Miko Tamako';
    public inputs;
    public disableBtn: boolean = true;
    public countChecnged: number = 0;
    public flagShow: boolean = false;
    public selfLink: string;
    private inputFields: any;
    private form: FormGroup;
    private newData = {};

    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _userParamSrv: UserParamsService,
        private _formHelper: FormHelperService,
        private apiSrv: PipRX,
        private _router: Router,
        private _msgSrv: EosMessageService,
        ) {
            this.countChecnged = 0;
            this.selfLink = this._router.url.split('?')[0];

    }
    ngOnInit() {
        this.curentUser = this._userParamSrv.curentUser;
        this.title = `${this.curentUser['SURNAME_PATRON']} (${this.curentUser['CLASSIF_NAME']})`;
        this.link = this.curentUser['ISN_LCLASSIF'];
        this._userParamSrv.getUserIsn(String(this.curentUser.ISN_LCLASSIF)).then(data => {
            this.init();
            this.flagShow = true;
        });
    }

    init() {
        this.inputFields =  this._formHelper.fillInputFields(BASE_PARAM_INPUTS);
        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this.subscribeForm();
    }

    submit() {
        this.flagShow = false;
        const query = [];
        query.push({
            method: 'MERGE',
            requestUri: `USER_CL(${this.curentUser['ISN_LCLASSIF']})`,
            data: this.newData
        });
         this.apiSrv.batch(query, '').then((data: any) => {
            this.flagShow = true;
            this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
        }).catch(e => {
            this.flagShow = true;
            this.cathError(e);
        });
    }
    cancel(event) {
        this.editMode = event;
        this.setDisableOrEneble();
        this.init();
    }

    edit(event) {
        this.editMode = event;
        this.setDisableOrEneble();

    }
    close(event) {
        this.editMode = event;
        this._router.navigate(['user_param']);
    }

    setDisableOrEneble() {
        for (const key in this.form.controls) {
            if (this.form.controls.hasOwnProperty(key)) {
                if (this.editMode) {
                    this.form.controls[key].enable({onlySelf: true, emitEvent: false});
                }   else {
                    this.form.controls[key].disable({onlySelf: true, emitEvent: false});
                }
            }
        }
    }

    private subscribeForm() {
        this.newData = {};
        this.form.valueChanges.subscribe(value => {
           let string = '';
           this.disableBtn = this._formHelper.changesForm(this.inputFields, value);
           Object.keys(value).forEach(key => {
            string += value[key] ? 1 : 0;
           });
           this.newData = {
            STREAM_SCAN_RIGHTS : string + '                 ',
           };
        });
    }

    private cathError(e) {
        const m: IMessage = {
            type: 'warning',
            title: 'Ошибка сервера',
            msg: '',
        };
        if (e instanceof RestError && (e.code === 434 || e.code === 0)) {
            this._router.navigate(['login'], {
                queryParams: {
                    returnUrl: this._router.url
                }
            });
            return undefined;
        }
        if (e instanceof RestError) {
            m.msg = 'ошибка сервера';
        } else {
            m.msg = e.message ? e.message : e;
        }
        this._msgSrv.addNewMessage(m);
    }
}
