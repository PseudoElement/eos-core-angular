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
            if (f['key'] === 'teсhUser') {
                f['disabled'] = true;
            }
        });
    }
    private _prepareDataForForm (field: IInputParamControl) {
        if (field['key'] === 'PASSWORD_DATE') {
            const pass = this._userParamSrv.hashUserContext['CHANGE_PASS'];
            field['readonly'] = pass !== 'YES' ? true : false;
        }
        if (field.controlType === E_FIELD_TYPE.boolean) {
            return !!this._userParamSrv.curentUser[field['key']];
        }
        return this._userParamSrv.curentUser[field['key']];
    }
}
