import { Component, OnInit, /* HostListener, */ OnDestroy} from '@angular/core';
import { ActivatedRoute, Params, Router, RouterStateSnapshot } from '@angular/router';
import { UserParamsService } from '../../eos-user-params/shared/services/user-params.service';
import { takeUntil } from 'rxjs/operators';
import { IUserSetChanges } from '../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { Subject } from 'rxjs';
import { SUB_PARAMS_LIST_NAV } from '../../eos-user-params/shared/consts/user-param.consts';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { IUserSettingsModes } from '../../eos-user-params/shared/intrfaces/user-params.interfaces';
import { FormHelperService } from '../../eos-user-params/shared/services/form-helper.services';
import { PipRX, USER_PARMS } from '../../eos-rest';

@Component({
    selector: 'eos-current-user-set',
    templateUrl: './current-user-set.component.html',
    styleUrls: ['./current-user-set.component.scss']
})
export class CurrentUserSetComponent implements OnInit, OnDestroy {
    listSettings = SUB_PARAMS_LIST_NAV;
    defaultUser: any;
    disableSave: boolean;
    paramId: string = 'rc';
    queryParams = {};
    public mainUser;
    public appMode: IUserSettingsModes = {
        tk: true,
    };
    public openingOptionalTab: number = 0;
    public isLoading: boolean = true;

    private checkCB: boolean;
    private _isChanged: boolean;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _userParamService: UserParamsService,
        private _apContext: AppContext,
        private formHelp: FormHelperService,
        private _pipRx: PipRX
    ) {}
    ngOnInit() {
        this._apContext.setHeader.next(false);
        this.checkCB = this._apContext.cbBase;
        this.mainUser = this._apContext.CurrentUser.ISN_LCLASSIF;
        this._route.params.subscribe(params => {
            this.paramId = params['field-id'];
        });
        this._route.queryParams.subscribe((queryParams: Params) => {
            const qParams: Params = {};
            const keys = Object.keys(queryParams);
            keys.forEach((k) => { qParams[k.toLowerCase()] = queryParams[k]; });
            const isDefault = `${qParams.isn}` === '-99';
            if (isDefault) {
                const newElem = [];
                this.listSettings.forEach((key) => {
                    if (key.url !== 'prof-sert') {
                        newElem.push(key);
                    }
                });
                this.listSettings = newElem;
            }
            this.mainUser = qParams.isn && Number(qParams.isn) && !isDefault ? Number(qParams.isn) : this.mainUser;
            // используется только в настройках пользователей, при сохранении настроек в файл
            this._userParamService.mainUser = this.mainUser;
            this.isLoading = isDefault;
            if (isDefault && !this.defaultUser) {
                const prep = this.formHelp.getObjQueryInputsField();
                this._pipRx.read(prep)
                    .then((data) => {
                        this.defaultUser = this.formHelp.createhash(data);
                        this.isLoading = false;
                    })
                    .catch(() => this.isLoading = false);
            }
            this.queryParams = qParams ? {...qParams} : {};
            if (!this.appMode.hasMode && qParams.mode) {
                this.appMode = {};
                switch (qParams.mode) {
                    case 'ARM': {
                        this.appMode.arm = true;
                        break;
                    }
                    case 'TK': {
                        this.appMode.tk = true;
                        break;
                    }
                    case 'TK_DOC': {
                        this.appMode.tkDoc = true;
                        break;
                    }
                    case 'ARMCBR': {
                        this.appMode.cbr = true;
                        break;
                    }
                    default:
                        this.appMode.tk = true;
                        break;
                }
                this.appMode.hasMode = true;
            } else if (qParams.tab) {
                this.appMode.extExchParams = +qParams.tab || 51;
            }
            this._checkTabExistance(qParams);
            this.openingOptionalTab = 0;
            if (qParams.tab) {
                const tabString = String(qParams.tab);
                if (tabString.length >= 2) {
                    this.openingOptionalTab = tabString.length > 2 ? Number(tabString.substring(2)) : Number(tabString.substring(1));
                }
            }
        });
        this._userParamService.hasChanges$
            .pipe(
                takeUntil(this.ngUnsubscribe)
                )
            .subscribe(({ isChange }: IUserSetChanges) => {
                this._isChanged = isChange;
            });
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this._apContext.setHeader.next(true);
    }
    // @HostListener('window:beforeunload', ['$event'])
    // canWndUnload(evt: BeforeUnloadEvent): any {
    //     if (this._isChanged) {
    //         evt.returnValue = '';
    //         return false;
    //     }
    // }

    canDeactivate(nextState?: RouterStateSnapshot): Promise<boolean> | boolean {
        if (this._isChanged) {
            if (confirm('На текущей вкладке есть несохраненные изменения. Сохранить их и продолжить?')) {
                this._userParamService.setCanDeactivateSubmit(nextState);
                return this._userParamService.submitSave
                .then((ans) => {
                    if (ans === 'error') {
                        return false;
                    } else {
                        this._isChanged = false;
                        return true;
                    }
                 }).catch((error) => {
                     console.log(error);
                     return false;
                 });
            } else {
                return Promise.resolve(false);
            }
        } else {
            return Promise.resolve(true);
        }
    }
    toggleTheme() {
        const objectReturn = {};
        if (this.checkCB) {
             objectReturn['current-settings-CB'] = true;
        }
        if (this.appMode?.extExchParams) {
            objectReturn['current-settings-ext-exch'] = true;
        }
        return objectReturn;
    }
    DefaultSubmitEmit(updateUser: USER_PARMS[]): any {
        if (updateUser[1] !== undefined) {
            const dataUsers = updateUser[0];
            Object.keys(dataUsers).forEach((key) => {
                let value = dataUsers[key].value;
                if (value !== undefined) {
                    if (value === true) {
                        value = 'YES';
                    }
                    if (value === false) {
                        value = 'NO';
                    }
                    this.defaultUser[key] = value;
                }
            });
        } else {
            Object.keys(updateUser).forEach((key) => {
                const dot = key.charAt(3);
                let value = updateUser[key];
                if (value !== undefined) {
                    if (value === true) {
                        value = 'YES';
                    }
                    if (value === false) {
                        value = 'NO';
                    }
                    if (dot === '.') {
                        key = key.substr(4);
                    }
                    this.defaultUser[key] = value;
                }
            });
        }
        return this.defaultUser;
    }
    private _checkTabExistance(qParams: Params) {
        if (!this.appMode) {
            return;
        }
        const redirectToRegistration = (hiddenUrls: Map<string, boolean>) => {
            if (hiddenUrls && hiddenUrls.size) {
                if (this.listSettings) {
                    this.listSettings = this.listSettings.filter((subItem) => !hiddenUrls.has(subItem.url) && subItem.url !== 'inline-scanning');
                }
                if (hiddenUrls.has(this.paramId)) {
                    this._router.navigate([
                        '/user_param',
                        'current-settings',
                        'registration'
                    ], { queryParams: { ...qParams } });
                }
            }
        };

        if (!this._apContext.CurrentUser || !this._apContext.CurrentUser.DELO_RIGHTS || !(+this._apContext.CurrentUser.DELO_RIGHTS[0])) {
            const hiddenUrls = new Map<string, boolean>([
                ['prof-sert', true],
            ]);
            redirectToRegistration(hiddenUrls);
        }
        if (this.appMode.arm) {
            const hiddenUrls = new Map<string, boolean>([
                ['external-application', true],
                ['patterns', true],
                ['inline-scanning', true],
            ]);
            redirectToRegistration(hiddenUrls);
        } else if (this.appMode.cbr) {
            const hiddenUrls = new Map<string, boolean>([
                ['dictionary', true],
                ['ext-exch', true],
                ['prof-sert', true],
                ['visualization', true],
                ['external-application', true],
                ['patterns', true],
                ['inline-scanning', true],
                ['el-signature', true] // для ВИБР убираю вкладку Электронная подпись
            ]);
            redirectToRegistration(hiddenUrls);
        }
    }
}
