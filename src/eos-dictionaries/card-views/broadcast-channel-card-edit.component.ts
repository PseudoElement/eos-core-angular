///<reference path="../../../node_modules/@angular/core/src/metadata/lifecycle_hooks.d.ts"/>
import {Component, Injector, OnChanges} from '@angular/core';
import {BaseCardEditComponent} from './base-card-edit.component';

@Component({
    selector: 'eos-broadcast-channel-card-edit',
    templateUrl: 'broadcast-channel-card-edit.component.html',
})
export class BroadcastChannelCardEditComponent extends BaseCardEditComponent implements OnChanges {

    private REC_CHANNEL_TYPE = 'rec.CHANNEL_TYPE';
    private REC_AUTH_METHOD = 'rec.AUTH_METHOD';

    private validatorStore: any[];
    private requirementsEmail = [
        'rec.SMTP_EMAIL',
        'rec.SMTP_SERVER',
        'rec.SMTP_PORT',
        'rec.ENCRYPTION_TYPE',
        'rec.AUTH_METHOD',
        'rec.POP3_SERVER',
        'rec.POP3_PORT',
        'rec.POP3_LOGIN',
        'rec.POP3_PASSWORD',
    ];
    private requirementsFS = [
        'rec.OUT_FOLDER',
        'rec.IN_FOLDER',
    ];
    private requirementsSMTP = [
        'rec.SMTP_LOGIN',
        'rec.SMTP_PASSWORD',
    ];

    constructor(injector: Injector) {
        super(injector);
        this.validatorStore = [];
        this.currTab = 0;
    }

    ngOnChanges() {
        setTimeout(() => {
            this.onChannelTypeChanged();
        });
    }

    get isEmail(): boolean {
        const t = this.getValue(this.REC_CHANNEL_TYPE);
        return t === 'email';
    }

    get authMethod(): number {
        return +this.getValue(this.REC_AUTH_METHOD);
    }


    onAuthMethodChanged() {
        setTimeout(() => {
            if (this.isEmail && (this.authMethod !== 0)) {
                this.requirementsSMTP.forEach(k => this.validatorEnable(k));
            } else {
                this.requirementsSMTP.forEach(k => this.validatorDisable(k));
            }
        });
    }

    onChannelTypeChanged() {
        if (this.form) {
            if (this.isEmail) {
                this.requirementsEmail.forEach(k => this.validatorEnable(k));
                this.requirementsFS.forEach(k => this.validatorDisable(k));
            } else {
                this.requirementsEmail.forEach(k => this.validatorDisable(k));
                this.requirementsFS.forEach(k => this.validatorEnable(k));
            }
            this.onAuthMethodChanged();
        }
    }

    private validatorEnable(key: string) {
        const control = this.inputs[key];
        if (control) {
            if (this.form.controls[key].validator) {
                return;
            } else {
                this.form.controls[key].setValidators(this.validatorStore[key]);
                this.inputs[key].required = true;
                this.form.controls[key].updateValueAndValidity();
            }
        }
    }

    private validatorDisable(key: string) {
        const control = this.inputs[key];
        if (control) {
            control.required = false;
            if (this.form.controls[key].validator) {
                this.validatorStore[key] = this.form.controls[key].validator;
                this.form.controls[key].clearValidators();
                this.inputs[key].required = false;
                this.form.controls[key].updateValueAndValidity();
            }
        }
    }
}
