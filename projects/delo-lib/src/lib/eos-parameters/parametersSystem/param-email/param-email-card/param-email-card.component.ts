/* import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service'; */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppsettingsParams, AppsettingsTypename } from '../../../../eos-common/consts/params.const';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISettingEmailReceive, ISettingEmailSend, IUploadParam } from '../../../../eos-parameters/interfaces/app-setting.interfaces';
import { DEFAULT_EMAIL_PARAM, InServerType } from '../../../../eos-parameters/parametersSystem/shared/consts/email-param.const';
import { ParamApiSrv } from '../../../../eos-parameters/parametersSystem/shared/service/parameters-api.service';
/* import { RUBRICATOR_DICT } from 'eos-dictionaries/consts/dictionaries/rubricator.consts'; */

@Component({
    selector: 'eos-param-email-card',
    templateUrl: 'param-email-card.component.html',
    styleUrls: ['./param-email-card.component.scss']

})
export class ParamEmailCardComponent implements OnInit, OnDestroy {
    @Input() form: FormGroup;
    @Input() allData: any[];
    @Input() inputs;
    @Input() dataProfile;
    @Input() prepareData;
    @Output() submitEmit = new EventEmitter();
    @Output() cancelEmit = new EventEmitter();
    public emailPass = '';
    public type1 = 'password';
    public isLoading = false;
    public errorPass = false;
    public data = {
        ProfileName: ''
    };
    public get InServerType(): typeof InServerType{
        return InServerType;
    }
    public title;
    get typeInput(): string {
        return !this.form.controls['rec.Password'].value ? 'text' : this.type1;
    }
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(private _paramApiSrv: ParamApiSrv) {}
    ngOnInit(): void {
        this.isLoading = true;
        if (this.dataProfile) {
            this.title = 'Редактирование профиля электронной почты';
            this.editProfile();
            this.errorPass = !Boolean(this.dataProfile['Password']);
            if (this.errorPass) {
                this.form.controls['rec.Password'].valueChanges
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe((state: string) => {
                    this.errorPass = state.length === 0;
                });
            }
        } else {
            this.title = 'Создание профиля электронной почты';
            this.addProfile();
            this.errorPass = true;
            this.form.controls['rec.Password'].setErrors({ isRequired: undefined });
            this.form.controls['rec.Password'].valueChanges
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state: string) => {
                this.errorPass = state.length === 0;
            });
        }
        this.form.controls['rec.ProfileName'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe((state: string) => {
            if (state) {
                let flag = false;
                this.allData.forEach((item) => {
                    if (item['ProfileName'] === state && (!this.dataProfile || this.dataProfile['key'] !== item['key'])) {
                        flag = true;
                    }
                });
                if (flag) {
                    this.form.controls['rec.ProfileName'].setErrors(null);
                    setTimeout(() => {
                        this.form.controls['rec.ProfileName'].setErrors({ valueError: 'Название профиля должно быть уникальным' });
                    }, 0);
                } else {
                    this.form.controls['rec.ProfileName'].setErrors(null);
                }
            } else {
                this.form.controls['rec.ProfileName'].setErrors(null);
                this.form.controls['rec.ProfileName'].setErrors({ isRequired: undefined });
            }
        });
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    cancel() {
        this.cancelEmit.next();
    }
    submit() {
        this.isLoading = true;
        this.submitEmit.next();
    }
    editProfile() {
        const paramReceive: IUploadParam = {
            namespace: AppsettingsParams.Email,
            typename: AppsettingsTypename.TReceive,
            instance: this.dataProfile['key']
        };
        const paramSend: IUploadParam = {
            namespace: AppsettingsParams.Email,
            typename: AppsettingsTypename.TSend,
            instance: this.dataProfile['key']
        };
        const allQueryGet = [];
        allQueryGet.push(this._paramApiSrv.getAppSetting<ISettingEmailReceive>(paramReceive));
        allQueryGet.push(this._paramApiSrv.getAppSetting<ISettingEmailSend>(paramSend));
        return Promise.all<[ISettingEmailReceive, ISettingEmailSend]>(allQueryGet)
        .then(([Receive, Send]) => {
            this.form.controls[`rec.ProfileName`].setValue(this.dataProfile['ProfileName'], { emitEvent: false });
            // this.form.controls[`rec.Password`].setValue(this.dataProfile['Password'], { emitEvent: false });
            this.form.controls[`rec.EmailAccount`].setValue(this.dataProfile['EmailAccount'], { emitEvent: false });
            this.prepareData.rec['ProfileName'] = this.dataProfile['ProfileName'];
            this.prepareData.rec['Password'] = this.dataProfile['Password'];
            this.prepareData.rec['EmailAccount'] = this.dataProfile['EmailAccount'];
            // this.emailPass = this.dataProfile['Password'];
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
    updateProfileName() {
        if (this.form.controls['rec.ProfileName'].value.trim().length !== this.form.controls['rec.ProfileName'].value.length) {
            this.form.controls['rec.ProfileName'].setValue(this.form.controls['rec.ProfileName'].value.trim());
        }
    }
    inputAllElem($event, flag) {
        if (!this.form.controls['rec.InUserName'].value && this.form.controls['rec.EmailAccount'].value) {
            this.form.controls['rec.InUserName'].setValue(this.form.controls['rec.EmailAccount'].value);
        }
        if (!this.form.controls['rec.OutUserName'].value && this.form.controls['rec.EmailAccount'].value) {
            this.form.controls['rec.OutUserName'].setValue(this.form.controls['rec.EmailAccount'].value);
        }
    }
    onKeyUp($event) {
        this.form.controls['rec.Password'].setValue(this.emailPass);
    }
    setVision() {
        this.type1 = 'text';
    }
    resetVision() {
        this.type1 = 'password';
    }
}
