import {Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IInputParamControl, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import {FormHelperService} from '../shared/services/form-helper.services';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import {ErrorHelperServices} from '../shared/services/helper-error.services';

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

export class InlineScaningComponent implements OnInit, OnDestroy {
    public editMode = false;
    public curentUser: IParamUserCl;
    public title: string = 'Miko Tamako';
    public inputs;
    public disableBtn: boolean = true;
    public countChecnged: number = 0;
    public flagShow: boolean = false;
    private inputFields: any;
    private form: FormGroup;
    private newData = {};
    private _ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _userParamSrv: UserParamsService,
        private _formHelper: FormHelperService,
        private apiSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices,
        ) {
            this.countChecnged = 0;
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    ngOnInit() {
        this._userParamSrv.getUserIsn({
            expand: 'USER_PARMS_List'
        })
        .then(() => {
            this.curentUser = this._userParamSrv.curentUser;
            this.title = `${this.curentUser['SURNAME_PATRON']} (${this.curentUser['CLASSIF_NAME']}) Поточное сканирование`;
            this.init();
            this.flagShow = true;
        }).catch(error => {
            this._errorSrv.errorHandler(error);
        });
        this._userParamSrv.saveData$
        .pipe(
            takeUntil(this._ngUnsubscribe)
        )
        .subscribe(() => {
            this._userParamSrv.submitSave =  this.submit(null);
        });
    }

    init() {
        this.inputFields =  this._formHelper.fillInputFields(BASE_PARAM_INPUTS);
        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this.subscribeForm();
    }
    submit(event): Promise<any> {
        this.flagShow = false;
        const query = [];
        query.push({
            method: 'MERGE',
            requestUri: `USER_CL(${this.curentUser['ISN_LCLASSIF']})`,
            data: this.newData
        });
    return  this.apiSrv.batch(query, '').then((data: any) => {
            this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                this.flagShow = true;
                this.disableBtn = true;
                this.prepInputs();
                this._pushState();
                this.editMode = false;
                this.setDisableOrEneble();
        }).catch(e => {
            this.flagShow = true;
            this._errorSrv.errorHandler(e);
            this.cancel(false);
        });
    }
    prepInputs() {
        Object.keys(this.inputs).forEach(key => {
            this.inputs[key].value = this.form.controls[key].value;
        });
    }
    prepForm() {
        Object.keys(this.inputs).forEach(key => {
            const val = this.inputs[key].value;
           this.form.controls[key].patchValue(val, {emitEvent: false});
        });
    }
    cancel(event) {
        this.editMode = event;
        this.setDisableOrEneble();
        this.prepForm();
        this.disableBtn = true;
        this._pushState();
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
        this.newData = {};
        this.form.valueChanges.subscribe(value => {
           let string = '';
           this.disableBtn = this._formHelper.changesForm(this.inputs, value);
           this._pushState();
           Object.keys(value).forEach(key => {
            string += value[key] ? 1 : 0;
           });
           this.newData = {
            STREAM_SCAN_RIGHTS : string + '                 ',
           };
        });
    }
    private _pushState () {
        this._userParamSrv.setChangeState({isChange: !this.disableBtn});
  }
}
