import { IInputParamControlForIndexRight, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { AbstractControl } from '@angular/forms';
import { E_RIGHT_SIDE_DOC_GROUP_IN_FILE_CARD_ACCESS_CONTENT, IChengeItemInFileCard } from '../shared-rights-delo/interfaces/right-delo.intefaces';

export class NodeRightInFileCard {
    isSelected: boolean;
    isCreate: boolean = false;
    touched: boolean = false;
    control: AbstractControl;

    get contentProp2(): E_RIGHT_SIDE_DOC_GROUP_IN_FILE_CARD_ACCESS_CONTENT {
      //  console.log(this._constData);
     //   console.log(this._constData.data['rightContent']);
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

    set value (v: number) {
        if (v === this._valueDb) {
            this.touched = false;
        } else {
            this.touched = true;
        }
        if (!this._value && v) {
            this.isCreate = true;
        }
        this._value = v;
        this.control.patchValue(!!v);
    }
  //  private _curentUser: IParamUserCl;
    private _constData: IInputParamControlForIndexRight;
    private _value: number;
    private _valueDb: number;
    private _change: IChengeItemInFileCard[] = [];
    constructor (node: IInputParamControlForIndexRight, v: number, con: AbstractControl, curentUser: IParamUserCl) {
        this._constData = node;
        this._value = v;
        this._valueDb = v;
        this.control = con;
       // console.log(this._constData);
      //  this._curentUser = curentUser;
       // console.log(this._curentUser);
    }
}
