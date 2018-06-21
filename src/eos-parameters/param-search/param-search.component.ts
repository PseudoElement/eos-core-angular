import { Component } from '@angular/core';
import { EosParametersApiServ } from '../core/eos-parameters-descriptor.service';

@Component({
    templateUrl: 'param-search.component.html'
})
export class ParamSearchComponent {
    titleHeader = 'Поиск';
    checked = false;
    radioCheck = 'two';
    data: any = 1;

    query1 = { DOCGROUP_CL: { criteries: { LAYER: '0:2' } }, orderby: 'DUE' };
    query2 = { DOCGROUP_CL: { criteries: { ISN_HIGH_NODE: '0' } }, orderby: 'DUE' };
    query3 = { USER_PARMS: { criteries: { PARM_NAME: 'MAX_LOGIN_ATTEMPTS' } } };
    query = this.query3;

    constructor(private ApiServ: EosParametersApiServ) {}
    getDataDb1() {
        this.ApiServ.getData(this.query).then(data => console.dir(data));
    }
}
