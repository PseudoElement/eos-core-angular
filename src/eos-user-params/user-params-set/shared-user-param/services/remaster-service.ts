import { Injectable } from '@angular/core';
// import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {PipRX} from 'eos-rest/services/pipRX.service';
@Injectable()
export class RemasterService {
    cancelEmit: Subject<any> = new Subject();
    defaultEmit: Subject<any> = new Subject();
    submitEmit: Subject<any> = new Subject();
    editEmit:  Subject<any> = new Subject();
    constructor(
       private _apiSrv: PipRX,
    ) {

    }

    getOrgGroupName(node: any): Promise<any> {
        const query = {
            ORGANIZ_CL: {
                criteries: {
                    ISN_NODE: node
                }
            }
        };
        return this._apiSrv.read(query);
    }
}
