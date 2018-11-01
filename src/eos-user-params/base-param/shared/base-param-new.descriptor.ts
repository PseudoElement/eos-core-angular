import { Injectable } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { BaseParamAbstractDescriptor } from './base-param-abstract.descriptor';

@Injectable()

export class BaseParamNewDescriptor extends BaseParamAbstractDescriptor {
    constructor(
        private _userParamSrv: UserParamsService
    ) {
        super();
        // console.log(this._userParamSrv);
        this._userParamSrv.fetchExpandUser();
    }

    fillValueInputField (fields: IInputParamControl[]) {
        fields.forEach((f: IInputParamControl) => {
            this._prepareDataForForm(f);
        });
    }
    fillValueControlField(fields: IInputParamControl[]) {
        fields.forEach((f: IInputParamControl) => {
            switch (f['key']) {
                case 'teсhUser':
                    f['disabled'] = false;
                    f['readonly'] = false;
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
                    }
                    break;
            }
        });
    }
    private _prepareDataForForm (field: IInputParamControl) {
        if (field['key'] === 'PASSWORD_DATE') {
            const date = new Date();
            const pass = this._userParamSrv.sysParams['CHANGE_PASS'];
            if (pass === 'NO') {
                field['disabled'] = true;
                field['readonly'] = true;
                date.setDate(date.getDate() - 1);
                field['value'] = this._dateToString(date);
            } else {
                field['disabled'] = false;
                field['readonly'] = false;
                date.setDate(date.getDate() + 15);
                field['value'] = this._dateToString(date);
            }
        }
    }
}
