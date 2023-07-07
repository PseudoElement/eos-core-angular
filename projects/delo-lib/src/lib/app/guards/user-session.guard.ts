import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { USER_CL } from '../../eos-rest/interfaces/structures';
import { ETypeDeloRight } from '../../eos-user-params/rights-delo/rights-delo-absolute-rights/absolute-rights.consts';
import { ALL_ROWS } from '../../eos-rest/core/consts';
import { E_TECH_RIGHT } from '../../eos-rest/interfaces/rightName';

@Injectable({ providedIn: "root" })

export class UserSessionGuard implements CanActivate {
    constructor(
        private apCtx: AppContext,
        private PipRX: PipRX,
        private msgSrv: EosMessageService
    ) {}

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const currentUser = await this.getCurrentUser();
        console.log(currentUser);

        const SYSTEM_TEHNOLOGIST = +currentUser.DELO_RIGHTS[ETypeDeloRight.SystemTechnologist];
        const HAS_RIGHT_TO_DICT_USERS = +currentUser.TECH_RIGHTS?.[E_TECH_RIGHT.Users - 1]
        if (!SYSTEM_TEHNOLOGIST || !HAS_RIGHT_TO_DICT_USERS) {
            this.showMessage();
            return false;
        }
        return true;
    }

    private async getCurrentUser(): Promise<USER_CL> {
        if (this.apCtx.CurrentUser) {
            return Promise.resolve(this.apCtx.CurrentUser);
        } else {
            const currentUser: USER_CL[] = await this.PipRX.read<USER_CL>({
                CurrentUser: ALL_ROWS
            });
            return currentUser[0];
        }
    }


    private showMessage (){
        const msg = `У Вас нет доступа к справочнику Пользователи`;

        this.msgSrv.addNewMessage({
            type: 'warning',
            title: '',
            msg,
        });
    }
}
