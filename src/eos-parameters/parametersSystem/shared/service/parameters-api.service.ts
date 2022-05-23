// import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ERROR_LOGIN } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';

@Injectable()
export class ParamApiSrv {
    constructor(
        private apiSrv: PipRX,
        // private _router: Router,
        private _confirmSrv: ConfirmWindowService,
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
                this._confirmSrv
                .confirm2(ERROR_LOGIN)
                .then((confirmed) => {
                    if (confirmed) {
                        document.location.assign('../login.aspx?ReturnUrl=' + document.location.href);
                    }
                });
                /* this._router.navigate(
                    ['/login'],
                    {
                        queryParams: {
                            returnUrl: this._router.url
                        }
                    }
                ); */
            }
            throw err;
        });
    }

    setData(query: any[]): Promise<any[]> {
        return this.apiSrv.batch(query, '').then((data: any) => {
            return data;
        });
    }

    // protected prepareForEdit(records: any[]): any[] {
    //     return records.map((record) => this.apiSrv.entityHelper.prepareForEdit(record));
    // }
}
