/* import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service'; */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ISettingEmailReceive, ISettingEmailSend, IUploadParam } from '../../../../eos-parameters/interfaces/app-setting.interfaces';
import { DEFAULT_EMAIL_PARAM } from '../../../../eos-parameters/parametersSystem/shared/consts/email-param.const';
import { ParamApiSrv } from '../../../../eos-parameters/parametersSystem/shared/service/parameters-api.service';
/* import { RUBRICATOR_DICT } from 'eos-dictionaries/consts/dictionaries/rubricator.consts'; */

@Component({
    selector: 'eos-param-email-card',
    templateUrl: 'param-email-card.component.html',
    styleUrls: ['./param-email-card.component.scss']

})
export class ParamEmailCardComponent implements OnInit {
    @Input() form: FormGroup;
    @Input() inputs;
    @Input() dataProfile;
    @Input() prepareData;
    @Output() submitEmit = new EventEmitter();
    @Output() cancelEmit = new EventEmitter();
    public isLoading = false;
    public data = {
        ProfileName: ''
    };
    public title = 'Редактирование профиля электронной почты';
    constructor(private _paramApiSrv: ParamApiSrv) {}
    ngOnInit(): void {
        this.isLoading = true;
        if (this.dataProfile) {
            this.editProfile();
        } else {
            this.addProfile();
        }
    }
    cancel() {
        this.cancelEmit.next();
    }
    submit() {
        this.submitEmit.next();
    }
    editProfile() {
        console.log('inputs', this.inputs);
        const paramReceive: IUploadParam = {
            namespace: 'Eos.Delo.Settings.Email',
            typename: 'ReceiveCfg',
            instance: this.dataProfile['key']
        };
        const paramSend: IUploadParam = {
            namespace: 'Eos.Delo.Settings.Email',
            typename: 'SendCfg',
            instance: this.dataProfile['key']
        };
        const allQueryGet = [];
        allQueryGet.push(this._paramApiSrv.getAppSetting<ISettingEmailReceive>(paramReceive));
        allQueryGet.push(this._paramApiSrv.getAppSetting<ISettingEmailSend>(paramSend));
        return Promise.all<[ISettingEmailReceive, ISettingEmailSend]>(allQueryGet)
        .then(([Receive, Send]) => {
            this.form.controls[`rec.ProfileName`].setValue(this.dataProfile['ProfileName'], { emitEvent: false });
            this.form.controls[`rec.Password`].setValue(this.dataProfile['Password'], { emitEvent: false });
            this.form.controls[`rec.EmailAccount`].setValue(this.dataProfile['EmailAccount'], { emitEvent: false });
            this.prepareData.rec['ProfileName'] = this.dataProfile['ProfileName'];
            this.prepareData.rec['Password'] = this.dataProfile['Password'];
            this.prepareData.rec['EmailAccount'] = this.dataProfile['EmailAccount'];
            Object.keys(Receive).forEach((key) => {
                if (this.form.controls[`rec.${key}`]) {
                    this.form.controls[`rec.${key}`].setValue(Receive[key], { emitEvent: false });
                    this.prepareData.rec[key] = Receive[key];
                }
            });
            Object.keys(Send).forEach((key) => {
                if (this.form.controls[`rec.${key}`]) {
                    this.form.controls[`rec.${key}`].setValue(Send[key], { emitEvent: false });
                    this.prepareData.rec[key] = Send[key];
                }
            });
            this.isLoading = false;
        })
        .catch((error) => {
            console.log('error', error);
        });
    }
    addProfile() {
        DEFAULT_EMAIL_PARAM.forEach((item) => {
            this.form.controls[`rec.${item.key}`].setValue(item.value, { emitEvent: false });
        });
        this.isLoading = false;
    }
}
