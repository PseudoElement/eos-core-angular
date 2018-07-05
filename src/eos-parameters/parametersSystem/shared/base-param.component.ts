import { FormGroup } from '@angular/forms';
import { E_FIELD_TYPE } from '../shared/interfaces/parameters.interfaces';

export class BaseParamComponent {
    titleHeader;
    data = {};
    dataDb: any;
    prepInputs: any;
    inputs: any;
    form: FormGroup;
    queryObj;
    constructor(paramModel) {
        this.titleHeader = paramModel.title;
        this.prepInputs = this.getObjectInputFields(paramModel.fields);
        this.queryObj = this.getObjQueryInputsField(this.prepInputs._list);
    }
    convData(data: Array<any>) {
        const d = {};
        data.forEach(item => {
            d[item.PARM_NAME] = item.PARM_VALUE;
        });
        return { rec: d };
    }

    getObjQueryInputsField(inputs: Array<any>) {
        return { USER_PARMS: { criteries: { PARM_NAME: inputs.join('||'), ISN_USER_OWNER: '-99' } } };
    }

    createObjRequest(list: any[], value): any[] {
        const req = [];
        list.forEach(item => {
            req.push({
                method: 'POST',
                requestUri: 'SYS_PARMS_Update?PARM_NAME=\'' + item + '\'&PARM_VALUE=\'' + value['rec.' + item] + '\''

            });
        });
        return req;
    }

    private getObjectInputFields(fields) {
        const inputs: any = { _list: [], rec: {} };
        fields.forEach(field => {
            inputs._list.push(field.key);
            inputs.rec[field.key] = { title: field.title, type: E_FIELD_TYPE[field.type], foreignKey: field.key };
        });
        return inputs;
    }
}
