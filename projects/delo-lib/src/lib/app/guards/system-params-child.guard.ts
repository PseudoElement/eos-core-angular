import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { E_PARMS_PAGES } from '../../eos-parameters/parametersSystem/shared/consts/eos-parameters.const';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { ETypeRule, E_TECH_RIGHTS } from '../../eos-user-params/rights-delo/rights-delo-absolute-rights/absolute-rights-classif/tech-user-classif.interface';

@Injectable({
    providedIn: 'root'
})
export class SystemParamsChildGuard implements CanActivateChild {
    public paramId: string | undefined;
    public techRights: string;
    get isCb() {
        return this.appCtx.cbBase
    }
    constructor(public appCtx: AppContext) {

    }
    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        this.paramId = route.params['id'];
        this.techRights = this.appCtx.CurrentUser.TECH_RIGHTS || "";
        console.log(this.techRights);

        if (this.paramId === E_PARMS_PAGES.authentication) {
            return this.checkAuthentificationAccess();
        } else if (this.paramId === E_PARMS_PAGES.logging) {
            return this.checkLoggingAccess();
        } else if (this.paramId === E_PARMS_PAGES['now-organiz']) {
            return this.checkNowOrganizAccess();
        } {
            return this.checkOtherTabsAccess()
        }
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
        if (this.isAccessUsers() && accessToLogging) {
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
    checkOtherTabsAccess(): boolean {
        return this.isAccessSystemParams();
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
