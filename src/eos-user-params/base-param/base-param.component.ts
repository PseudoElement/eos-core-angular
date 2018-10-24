import { Component, Input, OnInit } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { USER_CL } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-params/shared/consts/user-param.consts';

@Component({
    selector: 'eos-params-base-param',
    templateUrl: './base-param.component.html'
})

export class ParamsBaseParamComponent implements OnInit {
    @Input('newUser') newUser: boolean;
    data = [{
        method: 'POST',
        requestUri: 'USER_CL',
        data: {
            ISN_LCLASSIF: '-19999',
            SECURLEVEL: '',
            DUE_DEP: '',
            WEIGHT: '',
            SURNAME_PATRON: 'Имя Фамилия',
            PROTECTED: 0,
            DELETED: 0,
            CLASSIF_NAME: 'nickName',
            PASSWORD: '',
            NOTE: 'заметка',
            ORACLE_ID: 'X182_666',
            ADMIN: 0,
            USERTYPE: 0,
            AV_SYSTEMS: 1100000000000000000000000010,
            ADM_SYSTEMS: '',
            DELO_RIGHTS: 0,
            STREAM_SCAN_RIGHTS: '',
            ARCHIVE_RIGTHS: '',
            TECH_RIGHTS: '',
            LOGIN_ATTEMPTS: '',
            IS_PASSWORD: 1,
            IS_SECUR_ADM: 0,
            PASSWORD_DATE: '',
            TECH_DUE_DEP: '',
            NOTE2: 'заметка222'
        }
    }];
    title: string = 'Новый пользователь';
    curentUser: USER_CL;
    stateHeaderSubmit: boolean = false;
    constructor(
        private _waitClassifSrv: WaitClassifService,
        private _apiSrv: UserParamApiSrv,
        private _userParamSrv: UserParamsService
    ) {}
    ngOnInit () {
        if (!this.newUser) {
            this.curentUser = this._userParamSrv.curentUser;
            this.title = `${this.curentUser['SURNAME_PATRON']} (${this.curentUser['CLASSIF_NAME']})`;
        }
    }
    submit() {
        console.log('submit');
    }
    cancel() {
        console.log('cancel');
        this._apiSrv.setData(this.data);
    }
    testClick() {
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
        .then(data => {
            console.log(data);
        })
        .catch(() => {
            console.log('catch');
        });
    }
}
