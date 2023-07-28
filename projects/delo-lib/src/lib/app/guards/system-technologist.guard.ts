import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { USER_CL } from '../../eos-rest/interfaces/structures';
import { IKeyRightTech, KEY_RIGHT_TECH } from '../consts/permission.consts';
import { ETypeDeloRight } from '../../eos-user-params/rights-delo/rights-delo-absolute-rights/absolute-rights.consts';
import { ALL_ROWS } from '../../eos-rest/core/consts';
import { E_TECH_RIGHTS } from '../../eos-user-params/rights-delo/rights-delo-absolute-rights/absolute-rights-classif/tech-user-classif.interface';

@Injectable({ providedIn: "root" })

export class SystemTechnologistGuard implements CanActivate {
    constructor(
        private apCtx: AppContext,
        private PipRX: PipRX,
        private msgSrv: EosMessageService,
        private _router: Router,
    ) {}

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const urlSegment: UrlSegment = next.url[0];
        const url: string = urlSegment.path;
        const conf: IKeyRightTech = this.getConf(url);
        const currentUser = await this.getCurrentUser();
        const systemTechnologistValue = +currentUser.DELO_RIGHTS[ETypeDeloRight.SystemTechnologist];
        const systemAdministratorValue = currentUser.IS_SECUR_ADM;
        if (urlSegment.path === 'desk' && systemAdministratorValue === 1) {
            this._router.navigate(['user_param']);
            return false;
        }
        if (!systemTechnologistValue) {
            this.showMessage(conf);
            return false;
        }

        if(urlSegment.path === 'parameters') {
            const parmSistValue = +currentUser.TECH_RIGHTS[E_TECH_RIGHTS.SystemSettings-1];
            if(!parmSistValue) {
                this.showMessage(conf);
                return false;
            }
        }
        return true;
    }

    private async getCurrentUser(): Promise<USER_CL> {
        if (this.apCtx.CurrentUser) {
            return this.apCtx.CurrentUser;
        } else {
            const currentUser: USER_CL[] = await this.PipRX.read<USER_CL>({
                CurrentUser: ALL_ROWS
            });
            return currentUser[0];
        }
    }

    private getConf(url: string): IKeyRightTech {
        return KEY_RIGHT_TECH[url];
    }

    private showMessage(conf: IKeyRightTech) {
        const msg = conf.name ? `У Вас нет права изменять параметры модуля "${conf.name}"` :
                        `У Вас нет права изменять параметры модуля`
        this.msgSrv.addNewMessage({
            type: 'warning',
            title: '',
            msg,
        });
    }
}
