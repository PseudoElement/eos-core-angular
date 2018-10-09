import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';

@Injectable()
export class UserParamApiSrv {
    constructor(
        private apiSrv: PipRX,
        private _router: Router
    ) {}
    getData(query?: any): Promise<any> {
        return this.apiSrv
        .read(query)
        .then((data: any[]) => {
            // this.prepareForEdit(data);
            return data;
        })
        .catch(err => {
            if (err.code === 434) {
                this._router.navigate(
                    ['/login'],
                    {
                        queryParams: {
                            returnUrl: this._router.url
                        }
                    }
                );
            }
            throw err;
        });
    }

    setData(query: any[]): Promise<any[]> {
        console.log(query);
        return this.apiSrv.batch(query, '').then((data: any) => {
            return null;
        });
       /* return this.apiSrv.batch(query, '').then((data: any) => {
            return data;
        });*/
    }

    // protected prepareForEdit(records: any[]): any[] {
    //     return records.map((record) => this.apiSrv.entityHelper.prepareForEdit(record));
    // }
}
