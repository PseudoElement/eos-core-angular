import { Injectable } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';

@Injectable()
export class EosParametersApiServ {
    constructor(private apiSrv: PipRX) {}

    getData(query?: any): Promise<any[]> {
        return this.apiSrv
        .read(query)
        .then((data: any[]) => {
            this.prepareForEdit(data);
            return data;
        });
    }

    setData(query: any[]): Promise<any[]> {
        return this.apiSrv.batch(query, '').then((data: any) => {
            return data;
        });
    }

    protected prepareForEdit(records: any[]): any[] {
        return records.map((record) => this.apiSrv.entityHelper.prepareForEdit(record));
    }
}
