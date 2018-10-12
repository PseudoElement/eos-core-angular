import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { REGISTRATION_USER } from '../consts/registration.consts';

@Injectable()
export class UserParamRegistrationSrv extends BaseUserSrv {
    readonly fieldGroupsForRegistration: string[] = ['Доп. операции', 'Корр./адресаты',
    'Эл. почта', 'Сканирование', 'Автопоиск', 'СЭВ', 'РКПД'];
    currTab = 0;
    dataAttachDb;
    inputAttach;
    prepInputsAttach;
    prepDataAttach = {rec: {}};
    constructor( injector: Injector ) {
        super(injector, REGISTRATION_USER);
        this.init();
    }
    afterInitUserSearch() {
        this.userParamApiSrv.getData(Object.assign({}, {a: 1}))
        .then(data => {
            this.dataAttachDb = data;
            this.inputAttach = this.getInputAttach();
        });
    }
    getInputAttach() {
        return this.dataSrv.getInputs(this.prepInputsAttach, this.prepDataAttach);
    }
    setTab(i: number) {
        this.currTab = i;
       // this.afterInitUserSearch();
    }
}
