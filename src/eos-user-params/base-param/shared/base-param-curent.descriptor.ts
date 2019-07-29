import { Injectable } from '@angular/core';
import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
// import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { BaseParamAbstractDescriptor } from './base-param-abstract.descriptor';

@Injectable()
export class BaseParamCurentDescriptor extends BaseParamAbstractDescriptor {
    constructor(
        private _userParamSrv: UserParamsService
    ) {
        super();
    }
    fillValueInputField (fields: IInputParamControl[], isDisabled: boolean = false) {
        const arrInput = [];
        fields.forEach((field: IInputParamControl) => {
            const f = Object.assign({}, field);
            arrInput.push(f);
            switch (f['key']) {
                case 'PASSWORD_DATE':
                    f['value'] = this._userParamSrv.curentUser[f['key']];
                    const pass = this._userParamSrv.sysParams['CHANGE_PASS'];
                    f['disabled'] = pass !== 'YES' ? true : false;
                    f['readonly'] = pass !== 'YES' ? true : false;
                    break;
                case 'DUE_DEP_NAME':
                    if (!this._userParamSrv.isTechUser) {
                        f['value'] = this._userParamSrv.curentUser.DUE_DEP_NAME;
                    } else {
                        f['disabled'] = true;
                        f['readonly'] = true;
                    }
                    break;
                case 'USERTYPE':
                    f['value'] = this._userParamSrv.curentUser[f['key']] === 1 ? true : false;
                    break;
                default:
                    f['value'] = this._userParamSrv.curentUser[f['key']];
            }
        });
        return arrInput;
    }
    fillValueControlField(fields: IInputParamControl[], isDisabled: boolean = false) {
        const arrControls = [];
        fields.forEach((field: IInputParamControl) => {
            const f = Object.assign({}, field);
            arrControls.push(f);
            switch (f['key']) {
                case 'teсhUser':
                    if (this._userParamSrv.isTechUser) {
                        f['value'] = true;
                    } else {
                        f['value'] = false;
                    }
                    break;
                case 'SELECT_ROLE':
                    f['options'] = [
                        {
                            title: '',
                            value: ''
                        }
                    ];
                    // if (this._userParamSrv.curentUser['isAccessDelo']) {
                        if (this._userParamSrv.sysParams['CATEGORIES_FOR_USER']) {
                            const str: String = this._userParamSrv.sysParams['CATEGORIES_FOR_USER'];
                            str.substr(1).split(';').forEach(role => {
                                f['options'].push({
                                    title: role,
                                    value: role
                                });
                            });
                            f['value'] = this._userParamSrv.hashUserContext['CATEGORY'];
                         }
                    /*} else {
                        f['disabled'] = true;
                        f['readonly'] = true;
                    }*/
                    break;
            }
        });
        return arrControls;
    }

    fillValueAccessField(fields: IInputParamControl[], isDisabled: boolean = false) {
        const accessArray = [];
        const arr = this._userParamSrv.curentUser['ACCESS_SYSTEMS'];
        const delo = !!(+arr[0] && !+arr[1]);
        const delo_deloWeb = !!(+arr[0] && +arr[1]);
        const deloWeb = !!((+arr[1] || +arr[27]) && !+arr[0]);
        fields.forEach(field => {
            const f = Object.assign({}, field);
            accessArray.push(f);
            switch (f['key']) {
                case 'delo_web':
                    if (deloWeb) {
                        f['value'] = true;
                    } else if (delo || delo_deloWeb) {
                        f['disabled'] = true;
                    }
                    break;
                case '0-1':
                    if (delo_deloWeb) {
                        f['value'] = true;
                    } else if (deloWeb || delo) {
                        f['disabled'] = true;
                    }
                    break;
                case '1-27':
                    if (deloWeb) {
                        f['value'] = +arr[1] ? '1' : '27';
                    } else {
                        f['value'] = null;
                        f['disabled'] = true;
                    }
                    break;
                case '0':
                    if (delo) {
                        f['value'] = true;
                    } else if (deloWeb || delo_deloWeb) {
                        f['disabled'] = true;
                    }
                    break;
                default:
                    f['value'] = !!+arr[f['key']];
            }
        });
        return accessArray;
     }
    dateToString(date: Date) {
        return this._dateToString(date);
    }
}
