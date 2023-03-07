import { Injectable } from '@angular/core';
import { AdditionalInputs, IBaseParameters } from '../../eos-parameters/parametersSystem/shared/interfaces/parameters.interfaces';

@Injectable({providedIn: 'root'})
export class ExetentionsParametersPrjRcService {

    additionalInputs: AdditionalInputs[] = [
        {
            input: 'rec.PRJ_RC_SECURLEVEL_CONSIDER',
            readonly: true
        }
    ]

    overrideBaseParam(param: IBaseParameters) {
        return param;
    }
}