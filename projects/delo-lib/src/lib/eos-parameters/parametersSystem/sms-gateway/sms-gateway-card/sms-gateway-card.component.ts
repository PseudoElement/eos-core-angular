import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { AppSettingsEditCardService } from '../../../../eos-parameters/parametersSystem/shared/service/app-settings-edit-card.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
const passwordKey = "rec.Password";
const profileName = "rec.ProfileName";

@Component({
    selector: 'sms-gateway-card',
    templateUrl: './sms-gateway-card.component.html',
    styleUrls: ['./sms-gateway-card.component.scss']
})
export class SmsGatewayCardComponent implements OnInit {
    @Input() form: FormGroup;
    @Input() allData: any[];
    @Input() inputs;
    @Input() dataProfile;
    @Input() prepareData;
    @Output() submitEmit = new EventEmitter();
    @Output() cancelEmit = new EventEmitter();
    public typePassworInput = 'password';
    public isLoading = false;
    public title;
    public smsPassword = "";
    private ngUnsubscribe: Subject<any> = new Subject();
    get typeInput(): string {
        return !this.form.controls[passwordKey].value ? 'text' : this.typePassworInput;
    }
    constructor(private appCardSrv: AppSettingsEditCardService) { }

    ngOnInit(): void {
        this.appCardSrv.resetForm(this.form)
        if (this.dataProfile) {
            this.appCardSrv.fillControls(this.dataProfile, this.form)
        }
        this.isLoading = false;
        this.smsPassword = this.form.controls[passwordKey].value;

        if (this.dataProfile) {
            this.title = 'Редактирование профиля смс-шлюза';
        } else {
            this.title = 'Создание профиля смс-шлюза';
        }
        this.form.controls[profileName].addValidators(this.getValidators())
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getValidators() {
        return (control: AbstractControl) => {
            const value = control.value;
            let isvalid = true;
            this.allData.forEach((item) => {
                if (item['ProfileName'] === value && (!this.dataProfile || this.dataProfile['key'] !== item['key'])) {
                    isvalid = false;
                }
            });

             return isvalid ? null : { 'unique': true };
        }
    }
    cancel() {
        this.cancelEmit.next();
    }
    submit() {
        this.submitEmit.next();
    }
    onKeyUp($event) {
        this.form.controls[passwordKey].setValue(this.smsPassword);
    }
    setVision() {
        this.typePassworInput = 'text';
    }
    resetVision() {
        this.typePassworInput = 'password';
    }

}
