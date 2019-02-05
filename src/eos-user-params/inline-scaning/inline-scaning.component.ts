import {Component, OnInit} from '@angular/core';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { FormGroup } from '@angular/forms';
import { IInputParamControl, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import {FormHelperService} from '../shared/services/form-helper.services';
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
    templateUrl: 'inline-scaning.component.html'
})

export class InlineScaningComponent implements OnInit {
    public editMode = false;
    public curentUser: IParamUserCl;
    public link: string = '81284';
    public title: string = 'Miko Tamako';
    public inputs;
    public disableBtn: boolean = true;
    public countChecnged: number = 0;
    private inputFields: any;
    private form: FormGroup;

    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _userParamSrv: UserParamsService,
        private _formHelper: FormHelperService,
        ) {
            this.countChecnged = 0;

    }
    ngOnInit() {
        this.curentUser = this._userParamSrv.curentUser;
        this.title = `${this.curentUser['SURNAME_PATRON']} (${this.curentUser['CLASSIF_NAME']})`;
        this.inputFields =  this._formHelper.fillInputFields(BASE_PARAM_INPUTS);
        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this.subscribeForm();
    }

    submit() {
        console.log(this._formHelper);
    }
    cancel(event) {
        this.editMode = event;
        this.setDisableOrEneble();
    }

    edit(event) {
        this.editMode = event;
       this.setDisableOrEneble();

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
        this.form.valueChanges.subscribe(value => {
           this.disableBtn = this._formHelper.changesForm(this.inputFields, value);
        });
    }
}


