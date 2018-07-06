import { Component } from '@angular/core';
import { EosParametersApiServ } from '../shared/service/eos-parameters-descriptor.service';

@Component({
    selector: 'eos-param-search',
    templateUrl: 'param-search.component.html'
})
export class ParamSearchComponent {
    titleHeader = 'Поиск';
    checked = false;
    radioCheck = 'two';
    data: any = 1;
    query4 = {
        USER_PARMS: {
            criteries: {
                PARM_NAME: 'APPSRV_CRYPTO_ACTIVEX||APPSRV_CRYPTO_INITSTR||APPSRV_PKI_ACTIVEX||APPSRV_PKI_INITSTR',
                ISN_USER_OWNER: '-99'
            }
        }
    };

    setParm = [{ method: 'POST', requestUri: 'SYS_PARMS_Update?PARM_NAME=\'REG_CHECK_EDIT\'&PARM_VALUE=\'YES\'' }];

    constructor(private ApiServ: EosParametersApiServ) {}
    getDataDb1() {
        this.ApiServ.getData(this.query4).then(data => console.dir(data));
    }

    setData() {
        this.ApiServ.setData(this.setParm)
        .then(data => console.dir(data));
    }
}
