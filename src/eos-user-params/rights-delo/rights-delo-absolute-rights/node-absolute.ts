import { IInputParamControl, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { AbstractControl } from '@angular/forms';
import { E_RIGHT_DELO_ACCESS_CONTENT, IChengeItemAbsolute } from '../shared-rights-delo/interfaces/right-delo.intefaces';

export class NodeAbsoluteRight {
    isSelected: boolean;
    isCreate: boolean = false;
    touched: boolean = false;
    control: AbstractControl;

    get contentProp(): E_RIGHT_DELO_ACCESS_CONTENT {
        return this._constData.data['rightContent'];
    }
    get key() {
        return this._constData.key;
    }
    get label() {
        return this._constData.label;
    }
    get change (): IChengeItemAbsolute[] {
        return this._change;
    }
    get value(): number {
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
        if (v && this.isCreate && this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.all) {
                v = 2; // для параметров с радио "всех и не заполненных", значение по умолчанию "не заполненных"
                this.isCreate = false;
            }
        this._value = v;
        this.control.patchValue(!!v);
    }
    private _constData: IInputParamControl;
    private _value: number;
    private _valueDb: number;
    private _change: IChengeItemAbsolute[] = [];
    constructor (node: IInputParamControl, v: number, con: AbstractControl, curentUser: IParamUserCl) {
        this._constData = node;
        this._value = v;
        this._valueDb = v;
        this.control = con;
    }
    pushChange(node: IChengeItemAbsolute) {
        if (this._change.length && (this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.department ||
            this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthor ||
            this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject)) {
            const index = this._change.findIndex((item: IChengeItemAbsolute) => item.due === node.due);
            if (index >= 0) {
                this._change.splice(index, 1);
                this._checkTouched();
                return;
            }
        }
        if (this._change.length && (this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.docGroup)) {
            const index = this._change.findIndex((item: IChengeItemAbsolute) => item.due === node.due);
            if (index >= 0) {
                this._transformChenge(node, index);
                return;
            }
        }
        if (this._change.length && (this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.classif)) {
            if (node.user_cl) {
                const index = this._change.findIndex((item: IChengeItemAbsolute) => item.user_cl);
                if (index >= 0) {
                        this._change.splice(index, 1, node);
                    return;
                }
            }
            const index = this._change.findIndex((item: IChengeItemAbsolute) => item.due === node.due && item.funcNum === node.funcNum);
            if (index >= 0) {
                this._transformChenge(node, index);
                return;
            }
        }
        this.touched = true;
        this._change.push(node);
    }
    deleteChange() {
        this.touched = false;
        this._change = [];
        this._valueDb = this._value;
    }
    private _checkTouched() {
        if (!this._change.length) {
            this.touched = false;
        }
    }
    private _transformChenge(node: IChengeItemAbsolute, index: number) {
        if ((this._change[index].method === 'POST') && (node.method === 'MERGE')) {
            node.method = 'POST';
            this._change.splice(index, 1, node);
            return;
        }
        if ((this._change[index].method === 'POST') && (node.method === 'DELETE')) {
            this._change.splice(index, 1);
            this._checkTouched();
            return;
        }
        if (this._change[index].method === 'DELETE') {
            node.method = 'MERGE';
            this._change.splice(index, 1, node);
            return;
        }
        if (this._change[index].method === 'MERGE' && (node.method === 'DELETE')) {
            this._change.splice(index, 1, node);
            return;
        }
        if (this._change[index].method === 'MERGE' && (node.method === 'MERGE')) {
            this._change.splice(index, 1);
            this._checkTouched();
            return;
        }
    }
}
