import { RKDefaultFields } from './rk-default-values/rk-default-const';



export enum ACRK_GROUP {
    defaultRKValues,
}

export class AdvCardRKDataCtrl {
    name: string;
    constructor () {
    }


    getDescriptions(group: ACRK_GROUP): any {
        switch (group) {
            case ACRK_GROUP.defaultRKValues:
                return RKDefaultFields;
            default:
                break;
        }
    }

    getValues(group: ACRK_GROUP): any {
        switch (group) {
            case ACRK_GROUP.defaultRKValues:
                return this.readValues();
            default:
                break;
        }
    }

    readValues(): any {
        const res = {};
        res['rec'] = {};
        res['rec']['FIELD_1'] = '1';
        return res;
    }





    // getObjectInputFields(fields) {
    //     const inputs: any = { _list: [], rec: {} };
    //     fields.forEach(field => {
    //         this.fieldsType[field.key] = field.type;
    //         inputs._list.push(field.key);
    //         inputs.rec[field.key] = {
    //             title: field.title,
    //             type: E_FIELD_TYPE[field.type],
    //             foreignKey: field.key,
    //             pattern: field.pattern,
    //             length: field.length,
    //             options: field.options,
    //             readonly: !!field.readonly,
    //             formatDbBinary: !!field.formatDbBinary
    //         };
    //     });
    //     return inputs;
    // }
}
