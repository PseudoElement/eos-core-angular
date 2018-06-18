import { Injectable } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';

@Injectable()
export class EosParameters {
    constructor(private apiSrv: PipRX) {
        this.apiSrv = apiSrv;
    }

    getData(query?: any): Promise<any[]> {
        return this.apiSrv.read(query).then((data: any[]) => {
            return data;
        });
    }
}
