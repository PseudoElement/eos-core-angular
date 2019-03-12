import { IInputParamControlForIndexRight, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { AbstractControl } from '@angular/forms';
import { E_RIGHT_SIDE_DOC_GROUP_IN_FILE_CARD_ACCESS_CONTENT, IChengeItemInFileCard } from '../rights-delo-absolute-rights/right-delo.intefaces';

export class NodeRightInFileCard {
    isSelected: boolean;
    isCreate: boolean = false;
    touched: boolean = false;
    control: AbstractControl;

    get contentProp2(): E_RIGHT_SIDE_DOC_GROUP_IN_FILE_CARD_ACCESS_CONTENT {
        return this._constData.data['rightContent'];
    }
    get key() {
        return this._constData.key;
    }
    get label() {
        return this._constData.label;
    }
    get change (): IChengeItemInFileCard[] {
        return this._change;
    }
    get value() {
        return this._value;
    }
    private _constData: IInputParamControlForIndexRight;
    private _value: number;
    private _change: IChengeItemInFileCard[] = [];
    constructor (node: IInputParamControlForIndexRight, v: number, con: AbstractControl, curentUser: IParamUserCl) {
        this._constData = node;
        this._value = v;
    }
}
