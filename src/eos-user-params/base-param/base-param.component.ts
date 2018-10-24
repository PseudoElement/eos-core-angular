import { Component, Input, OnInit } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { USER_CL } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';

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
        // const d = window.document.documentElement;
        window['Rootpath'] = function() {
            return 'classif';
        };
        // console.log('');
        const w = window.open(
            'http://localhost/X182/Eos.Delo.JsControls/Classif/ChooseClassif.aspx?' +
                'Classif=DEPARTMENT&' +
                'return_due=True&' +
                'value_id=__ClassifIds&' +
                'skip_deleted=True&' +
                'select_leaf=True&' +
                'select_nodes=false&' +
                'select_multy=false',
            'name',
            'left=10,top=200,width=1000,height=500'
            // `width=1000,height=500,top=150,left=${window.document.documentElement.clientWidth - 500}`
        ); // D:\temp\x1807\Web14\Eos.Delo.JsControls\WebContent\Scripts\P.ts

        window['endPopup'] = (data, flag) => {
            if (flag !== 'refresh') {
                window['endPopup'] = undefined;
                // def.resolve(data);
                console.log(data);
            }
        };
        const checkDialClosed = setInterval(function () {
            try {
                if (!w || w.closed) {
                    clearInterval(checkDialClosed);
                    // def.reject();
                    console.log('close');
                }
            } catch (e) { }
        }, 500);
    }
}
