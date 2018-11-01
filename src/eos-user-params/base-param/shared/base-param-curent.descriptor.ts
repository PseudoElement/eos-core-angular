import { Injectable } from '@angular/core';
import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { BaseParamAbstractDescriptor } from './base-param-abstract.descriptor';

@Injectable()
export class BaseParamCurentDescriptor extends BaseParamAbstractDescriptor {
    constructor(
        private _userParamSrv: UserParamsService
    ) {
        super();
    }
    fillValueInputField (fields: IInputParamControl[]) {
        fields.forEach((f: IInputParamControl) => {
            f['value'] = this._prepareDataForForm(f);
        });
    }
    fillValueControlField(fields: IInputParamControl[]) {
        fields.forEach((f: IInputParamControl) => {
            switch (f['key']) {
                case 'teсhUser':
                    f['disabled'] = true;
                    f['readonly'] = true;
                    if (this._userParamSrv.isTechUser) {
                        f['value'] = true;
                    }
                    break;
                case 'SELECT_ROLE':
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
                    break;
            }
        });
    }
    private _prepareDataForForm (field: IInputParamControl) {
        if (field['key'] === 'PASSWORD_DATE') {
            const pass = this._userParamSrv.hashUserContext['CHANGE_PASS'];
            field['disabled'] = pass !== 'YES' ? true : false;
            field['readonly'] = pass !== 'YES' ? true : false;
        }
        if (field['key'] === 'DUE_DEP_NAME') {
            field['disabled'] = true;
            field['readonly'] = true;
        }
        if (field.controlType === E_FIELD_TYPE.boolean) {
            return !!this._userParamSrv.curentUser[field['key']];
        }
        return this._userParamSrv.curentUser[field['key']];
    }
}
