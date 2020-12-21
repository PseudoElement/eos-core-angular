import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { NavParamService } from 'app/services/nav-param.service';
import { ActivatedRoute, Params, Router, RouterStateSnapshot } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { SUB_PARAMS_LIST_NAV } from 'eos-user-params/shared/consts/user-param.consts';
import { FormHelperService } from 'eos-user-params/shared/services/form-helper.services';
import { PipRX, USER_PARMS, ICancelFormChangesEvent } from 'eos-rest';
import { IUserSetChanges } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { MESSAGE_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';
import { IUserSettingsModes } from 'eos-user-params/shared/intrfaces/user-params.interfaces';

@Component({
    selector: 'eos-default-settings',
    styleUrls: ['default-settings.component.scss'],
    templateUrl: './default-settings.component.html'
})

export class DefaultSettingsComponent implements OnInit, OnDestroy {
    listSettings = SUB_PARAMS_LIST_NAV;
    defaultUser: any;
    disableSave: boolean;
    paramId: string;
    isWide: boolean = true;
    public appMode: IUserSettingsModes = {
        tk: true,
    };
    public openingOptionalTab: number = 0;

    private _isChanged: boolean;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _navSrv: NavParamService,
        private _router: Router,
        private _route: ActivatedRoute,
        private formHelp: FormHelperService,
        private _pipRx: PipRX,
        private _userParamService: UserParamsService,
        private _errorSrv: ErrorHelperServices,
    ) {
        this._route.params.subscribe(params => (this.paramId = params['id']));
        this._route.queryParams
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe((qParams: Params) => {
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
        this._navSrv.StateSandwich$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state: boolean) => {
                this.isWide = state;
            });
        this._userParamService.hasChanges$
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(({ isChange }: IUserSetChanges) => {
            this._isChanged = isChange;
            //    this._disableSave = disableSave;
        });

        this._pipRx.cancelFormChanges$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((event: ICancelFormChangesEvent) => {
                this._isChanged = event.isChanged;
                this._errorSrv.errorHandler(event.error);
            });
    }
    ngOnInit() {
        const prep = this.formHelp.getObjQueryInputsField();
        this._pipRx.read(prep).then((data) => {
            this.defaultUser = this.formHelp.createhash(data);
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    @HostListener('window:beforeunload', ['$event'])
    canWndUnload(evt: BeforeUnloadEvent): any {
        if (this._isChanged) {
            evt.preventDefault();
            evt.stopPropagation();

            evt.returnValue = MESSAGE_SAVE_ON_LEAVE;
            return MESSAGE_SAVE_ON_LEAVE;
        }
    }

    canDeactivate(nextState?: RouterStateSnapshot): Promise<boolean> | boolean {
        if (this._isChanged) {
            return new Promise((res, rej) => {
                if (confirm('Возможно, внесенные изменения не сохранятся.')) {
                    this._isChanged = false;
                    return res(true);
                } else {
                    return res(false);
                }
            });
        } else {
            return Promise.resolve(true);
        }
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
        if (this.appMode && this.appMode.arm) {
            if (this.listSettings) {
                this.listSettings = this.listSettings.filter((subItem) => subItem.url !== 'external-application' && subItem.url !== 'patterns');
            }

            if (this.paramId === 'external-application') {
                this._router.navigate(['/user-params-set', 'visualization'], { queryParams: { ...qParams } });
            } else if (this.paramId === 'patterns') {
                this._router.navigate(['/user-params-set', 'other'], { queryParams: { ...qParams } });
            }
        }
    }
}
