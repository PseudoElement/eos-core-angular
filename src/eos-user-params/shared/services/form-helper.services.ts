import {Injectable} from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
@Injectable()
export class FormHelperService {

    public newFormData = {};
    constructor(private _userSrv: UserParamsService ) {

    }

    fillInputFields(inputFields: IInputParamControl[]) {
        const user_scan_right = this._userSrv.curentUser['STREAM_SCAN_RIGHTS'];
        const arrayFills: IInputParamControl[]  = [];
        inputFields.forEach((inputVal: IInputParamControl, index) => {
            const f = Object.assign({}, inputVal);
            arrayFills.push(f);
            switch (f['key']) {
                case 'STREAM_SCAN_RIGHTS_BD' :
                setVal(f, index);
                return;
                case 'STREAM_SCAN_RIGHTS_ARM':
                setVal(f, index);
                return;
                case 'STREAM_SCAN_RIGHTS_BAR_CODE':
                setVal(f, index);
                return;
                default:
                setVal(f, index);
                return;
            }
        });

        return arrayFills;
        function setVal(f, position: number) {
            if (user_scan_right === null) {
                f['value'] = false;
            }   else {
                const splitValue = user_scan_right.split('');
                if (splitValue[position]) {
                    String(splitValue[position]) === '1' ? f['value'] = true : f['value'] = false;
                }   else {
                    f['value'] = false;
                }
            }
        }
    }

    fillInputFieldsSetParams(inputFields: IInputParamControl[]) {
        const user_param = this._userSrv.curentUser['USER_PARMS_HASH'];
        const arrayFills: IInputParamControl[]  = [];
        inputFields.forEach((inputVal: IInputParamControl, index) => {
            const f: IInputParamControl = Object.assign({}, inputVal);
            arrayFills.push(f);
            if (f.controlType === E_FIELD_TYPE.boolean) {
              if (String(user_param[f['key']]) !==  'null' && String(user_param[f['key']]) !==  'undefined') {
                if (user_param[f['key']] === 'NO') {
                    f['value']  = false;
                }   else {
                    f['value']  = true;
                }
              } else {
                f['value']  = false;
              }
            }

            if (f.controlType === E_FIELD_TYPE.string) {
                if (String(user_param[f['key']]) !== 'null' && String(user_param[f['key']]) !==  'undefined') {
                    f['value'] = user_param[f['key']];
                }   else {
                    f['value']  = '';
                }
            }

        });
        return arrayFills;
    }

    changesForm(inputs: IInputParamControl[], newVal) {
        let countChanges = 0;
        let btnDisableFlag = null;
        inputs.forEach((field, index) => {
            if (field.value !== newVal[field.key]) {
                this.newFormData[field.key] = field.value;
                countChanges += 1;
            } else {
                delete this.newFormData[field.key];
            }
        });
        countChanges > 0 ? btnDisableFlag = false : btnDisableFlag = true;
        countChanges = 0;
        return btnDisableFlag;
    }

}
