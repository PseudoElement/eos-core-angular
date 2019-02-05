import {Injectable} from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
@Injectable()
export class FormHelperService {
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

    changesForm(inputs: IInputParamControl[], newVal) {
        let countChanges = 0;
        let btnDisableFlag = null;
        inputs.forEach((field, index) => {
            if (field.value !== newVal[field.key]) {
                countChanges += 1;
            }
        });
        countChanges > 0 ? btnDisableFlag = false : btnDisableFlag = true;
        countChanges = 0;
        return btnDisableFlag;
    }

}
