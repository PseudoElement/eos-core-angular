import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { AbstractControl } from '@angular/forms';

export class NodeAbsoluteRight {
    isSelected: boolean;
    isCreate: boolean = false;
    touched: boolean = false;
    control: AbstractControl;

    get contentProp() {
        return this._constData.data['rightContent'];
    }
    get key() {
        return this._constData.key;
    }
    get label() {
        return this._constData.label;
    }
    get change () {
        return this._change;
    }
    get value() {
        return this._value;
    }

    set value (v: number) {
        console.log(v);
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
    private _constData: IInputParamControl;
    private _value: number;
    private _valueDb: number;
    private _change = [];
    constructor (node: IInputParamControl, v: number, con: AbstractControl) {
        this._constData = node;
        this._value = v;
        this._valueDb = v;
        this.control = con;
    }
    pushChange(node) {
        if (this._change.length) { // если повторное изменение есть то удаляем текущее
            const index = this._change.findIndex(item => item['userDep']['DUE'] === node['userDep']['DUE']);
            if (index >= 0) {
                this._change.splice(index, 1);
                if (!this._change.length) {
                    this.touched = false;
                }
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
}
