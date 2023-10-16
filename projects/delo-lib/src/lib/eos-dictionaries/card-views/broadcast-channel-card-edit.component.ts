// ///<reference path="../../../node_modules/@angular/core/src/metadata/lifecycle_hooks.d.ts"/>
import { Component, Injector, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {BaseCardEditDirective} from './base-card-edit.component';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { IEmailChannelAccordion, IFileSystemAccordions } from '../../eos-dictionaries/consts/dictionaries/sev/types.consts';
import { BroadcastChannelCardEditService } from '../../eos-dictionaries/services/broadcast-channel-card-edit.service';
import { AppContext } from '../../eos-rest';
import { ETypeRule, E_TECH_RIGHTS } from '../../eos-user-params/index';

@Component({
    selector: 'eos-broadcast-channel-card-edit',
    templateUrl: 'broadcast-channel-card-edit.component.html',
})
export class BroadcastChannelCardEditComponent extends BaseCardEditDirective implements OnChanges, OnDestroy, OnInit {
    public accordionsFileSystem: IFileSystemAccordions = {INCOMING: null, OUTGOING: null};
    public accordionEmailChannel: IEmailChannelAccordion;
    public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private ngUnsubscribe: Subject<any> = new Subject();
    private REC_CHANNEL_TYPE = 'rec.CHANNEL_TYPE';
    private REC_AUTH_METHOD = 'rec.AUTH_METHOD';

    private validatorStore: any[];
    private requirementsEmail = [
        'rec.EMAIL_PROFILE'
    ];
    private requirementsFS = [
        'rec.OUT_STORAGE',
        'rec.OUT_FOLDER',
        'rec.OUT_STORAGE',
        'rec.IN_FOLDER',
    ];

    constructor(injector: Injector, private _channelCardEditSrv: BroadcastChannelCardEditService, private _appCtx: AppContext) {
        super(injector);
        this.validatorStore = [];
        this.currTab = 0;
    }


    async ngOnInit() {
        this.form.controls['rec.CHANNEL_TYPE'].setValue('email');
        await this._loadEmailData();
        this.form.controls['rec.CHANNEL_TYPE'].valueChanges
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(async (flag) => {
                this.onChannelTypeChanged();
                if(flag === 'email') await this._loadEmailData();
                if(flag === 'FileSystem') await this._loadFileSystemData()
            });
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
    ngOnChanges() {
        setTimeout(() => {
            this.onChannelTypeChanged();
        });
    }
    /**
     * Опции этих инпут-селектов - это доступные хранилища, загружаются в BroadcastChannelCardEditService в методе
     * setFileSystemAccordionData, если доступных опций нет - длина массива будет равна 0 
     * @returns При true в темплейте для FileSystem будут отображаться селекты с хранилищами
     */
    get isAnyStorageRegistered(): boolean {
        return this.inputs['rec.OUT_STORAGE'].options.length || this.inputs['rec.IN_STORAGE'].options.length
    }
    get isEmail(): boolean {
        const t = this.getValue(this.REC_CHANNEL_TYPE);
        return t === 'email';
    }

    get authMethod(): number {
        return +this.getValue(this.REC_AUTH_METHOD);
    }
    /**
     * Используется для отображения ссылки на Профили электронной почты
     */
    get hasAccessToSystemParams(): boolean {
        return this._appCtx.CurrentUser.TECH_RIGHTS[E_TECH_RIGHTS.SystemSettings - 1] === ETypeRule.have_right
    }
    /**
     * Теперь настройка Email канала достпуна только для чтения и только для ранее созданных каналов,
     * где все контролы заполнялись вручную и не было селекта Профиль Элеткронной Почты(EMAIL_PROFILE)
     */
    get shouldShowEmailChannelTabs(): boolean {
        return /Delay/.test(this.data.rec['PARAMS']);
    }


    onChannelTypeChanged() {
        if (this.form && this.editMode) {
            if (this.isEmail) {
                this.requirementsEmail.forEach(k => this.validatorEnable(k));
                this.requirementsFS.forEach(k => this.validatorDisable(k));
            } else {
                this.requirementsEmail.forEach(k => this.validatorDisable(k));
                this.requirementsFS.forEach(k => this.validatorEnable(k));
            }
        }
    }
    private async _loadFileSystemData(){
        this.isLoading$.next(true)
        this.accordionsFileSystem = await this._channelCardEditSrv.setFileSystemAccordionData(this.inputs);
        this.isLoading$.next(false)
    }
    private async _loadEmailData(){
        this.isLoading$.next(true);
        this.accordionEmailChannel = await this._channelCardEditSrv.setEmailAccordionData(this.inputs)
        this.isLoading$.next(false);
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
