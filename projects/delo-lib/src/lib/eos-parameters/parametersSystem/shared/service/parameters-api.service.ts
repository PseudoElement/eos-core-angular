// import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PipRX } from '../../../../eos-rest/services/pipRX.service';
import { ERROR_LOGIN } from '../../../../app/consts/confirms.const';
import { ConfirmWindowService } from '../../../../eos-common/confirm-window/confirm-window.service';
import { RETURN_URL, URL_LOGIN } from '../../../../app/consts/common.consts';
import { IUploadParam } from '../../../../eos-parameters/interfaces/app-setting.interfaces';

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
                        document.location.assign(URL_LOGIN + RETURN_URL + document.location.href);
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
    getAppSetting<T>(url: IUploadParam): Promise<T> {
        return this.apiSrv.getAppSetting<T>(url);
    }
    setAppSetting<T>(query: IUploadParam, body: T) {
        return this.apiSrv.setAppSetting(query, body);
    }
    // protected prepareForEdit(records: any[]): any[] {
    //     return records.map((record) => this.apiSrv.entityHelper.prepareForEdit(record));
    // }
}
