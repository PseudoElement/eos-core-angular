import { Injectable } from '@angular/core';
import { IChengeItemAbsolute } from '../../eos-user-params/rights-delo/rights-delo-absolute-rights/right-delo.intefaces';
import { ABSOLUTE_RIGHTS } from '../../eos-user-params/rights-delo/rights-delo-absolute-rights/absolute-rights.consts';

@Injectable()
export class AbsoluteRigthServiceLib {
    /* Получение константы какие права будут в левой части центрального стакана, и как они будут выглядеть */
    public getAbsoluteRigth() {
        return ABSOLUTE_RIGHTS;
    }
    /* Получение какие типы организаций можно редактировать пользователю */
    public getUserEditOrgType(orgTypeList: any[]): any[]{
        return [];
    }
    /* Расширение получения данныъ для пользователя */
    public getExpandStr(): string {
        return '';
    }
    public batchEditOrgType(chenge: IChengeItemAbsolute, uId): any {
        return {};
    }
}