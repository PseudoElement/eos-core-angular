import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { REGISTRATION_USER } from '../consts/registration.consts';

@Injectable()
export class UserParamRegistrationSrv extends BaseUserSrv {
    readonly fieldGroupsForRegistration: string[] = ['Доп. операции', 'Корр./адресаты',
    'Эл. почта', 'Сканирование', 'Автопоиск', 'СЭВ', 'РКПД'];
    currTab = 0;
    constructor( injector: Injector ) {
        super(injector, REGISTRATION_USER);
        this.init();
    }
    setTab(i: number) {
        this.currTab = i;
    }
}
