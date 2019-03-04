import { Injectable } from '@angular/core';
// import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
// import {PipRX} from 'eos-rest/services/pipRX.service';
@Injectable()
export class RemasterService {
    cancelEmit: Subject<any> = new Subject();
    defaultEmit: Subject<any> = new Subject();
    submitEmit: Subject<any> = new Subject();
    constructor(
       // private _apiSrv: PipRX,
    ) {

    }
}
