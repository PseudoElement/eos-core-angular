import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { IKeyRightTech, KEY_RIGHT_TECH } from '../consts/permission.consts';
import { E_PARMS_PAGES } from '../../eos-parameters/parametersSystem/shared/consts/eos-parameters.const';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { ETypeRule, E_TECH_RIGHTS } from '../../eos-user-params/rights-delo/rights-delo-absolute-rights/absolute-rights-classif/tech-user-classif.interface';
import { EosMessageService } from '../../eos-common/index';

@Injectable({
    providedIn: 'root'
})
export class SystemParamsChildGuard implements CanActivateChild {
    public paramId: string | undefined;
    public techRights: string;
    get isCb() {
        return this.appCtx.cbBase
    }
    constructor(public appCtx: AppContext, private router: Router, private _msgSrv: EosMessageService) {

    }
    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const conf: IKeyRightTech = this._getConf("parameters");
        this.paramId = route.params['id'];
        this.techRights = this.appCtx.CurrentUser.TECH_RIGHTS || "";
        if (this.paramId === E_PARMS_PAGES.authentication) {
            return this.checkAuthentificationAccess();
        } else if (this.paramId === E_PARMS_PAGES.logging) {
            return this.checkLoggingAccess();
        } else if (this.paramId === E_PARMS_PAGES['now-organiz']) {
            return this.checkNowOrganizAccess();
        } {
            return this.checkOtherTabsAccess(conf.name);
        }
    }
    private _getConf(url: string): IKeyRightTech {
        return KEY_RIGHT_TECH[url];
    }
    checkAuthentificationAccess(): boolean {
        if (this.isCb) {
            if (this.isAccessUsers() && !this.isLimitedUser()) {
                return true
            }
            return false;
        } else {
            if (this.isAccessSystemParams()) {
                return true;
            }
        }
        return false;
    }
    checkLoggingAccess(): boolean {
        const accessToLogging = this.techRights[E_TECH_RIGHTS.SettingTheBrowsingProtocol - 1] === ETypeRule.have_right;
        if (accessToLogging) {
            return true
        }
        return false;
    }
    checkNowOrganizAccess(): boolean {
        if (this.techRights[E_TECH_RIGHTS.CurrentOrganization - 1] === ETypeRule.have_right) {
            return true;
        } else {
            return false;
        }
    }
    checkOtherTabsAccess(name: string): boolean {
        // return this.isAccessSystemParams();
        if (!this.isAccessSystemParams()) {
            if (this.checkAuthentificationAccess()) {
                this.router.navigate(['parameters/authentication']);
                return
            }
            if (this.checkLoggingAccess()) {
                this.router.navigate(['parameters/logging']);
                return
            }
            if (this.checkNowOrganizAccess()) {
                this.router.navigate(['parameters/now-organiz']);
                return
            }
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение:',
                msg: `У Вас нет права изменять параметры модуля "${name}"`,
            });
            return false;
        }
        return true;
    }
    isAccessUsers(): boolean {
        return this.techRights[E_TECH_RIGHTS.Users - 1] === ETypeRule.have_right
    }
    isAccessSystemParams(): boolean {
        return this.techRights[E_TECH_RIGHTS.SystemSettings - 1] === ETypeRule.have_right
    }
    isLimitedUser(): boolean {
        return !!this.appCtx.limitCardsUser.length
    }
}
