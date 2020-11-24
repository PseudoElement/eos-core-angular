import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { takeUntil } from 'rxjs/operators';
import { IUserSetChanges } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { Subject } from 'rxjs';
import { SUB_PARAMS_LIST_NAV } from 'eos-user-params/shared/consts/user-param.consts';
import { AppContext } from 'eos-rest/services/appContext.service';
import { IUserSettingsModes } from 'eos-user-params/shared/intrfaces/user-params.interfaces';

@Component({
    selector: 'eos-current-user-set',
    templateUrl: './current-user-set.component.html',
    styleUrls: ['./current-user-set.component.scss']
})
export class CurrentUserSetComponent implements OnInit, OnDestroy {
    listSettings = SUB_PARAMS_LIST_NAV;
    paramId: string = 'rc';
    public mainUser;
    public appMode: IUserSettingsModes = {
        arm: true,
    };
    public openingOptionalTab: number = 0;

    private checkCB: boolean;
    private _isChanged: boolean;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        private router: ActivatedRoute,
        private _userParamService: UserParamsService,
        private _apContext: AppContext,
    ) {}
    ngOnInit() {
        this._apContext.setHeader.next(false);
        this.checkCB = this._apContext.cbBase;
        this.mainUser = this._apContext.CurrentUser.ISN_LCLASSIF;
        this.router.params.subscribe(params => {
            this.paramId = params['field-id'];
        });
        this.router.queryParams.subscribe((qParams) => {
            this.mainUser = qParams.isn && Number(qParams.isn) ? Number(qParams.isn) : this.mainUser;
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
                        this.appMode.arm = true;
                        break;
                }
                this.appMode.hasMode = true;
            }
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
    @HostListener('window:beforeunload', ['$event'])
    canWndUnload(evt: BeforeUnloadEvent): any {
        if (this._isChanged) {
            evt.returnValue = '';
            return false;
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
    toggleTheme() {
        if (this.checkCB) {
            return { 'current-settings-CB': true };
        }
    }
}
