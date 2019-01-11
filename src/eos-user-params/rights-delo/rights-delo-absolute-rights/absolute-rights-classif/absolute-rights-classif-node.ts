import { ITechUserClassifConst, E_TECH_USER_CLASSIF_CONTENT } from 'eos-user-params/rights-delo/shared-rights-delo/interfaces/tech-user-classif.interface';
import { NodeAbsoluteRight } from '../node-absolute';

export class RightClassifNode {
    isExpanded: boolean = false;
    get expandable (): boolean {
        return (this._item.expandable !== E_TECH_USER_CLASSIF_CONTENT.none) && !!this._value;
    }
    get key(): number {
        return this._item.key;
    }
    get label(): string {
        return this._item.label;
    }
    get value (): number {
        return this._value;
    }
    set value (v) {
        this._valueLast = this._value;
        this._value = +v;
        if (this._item.expandable !== E_TECH_USER_CLASSIF_CONTENT.none) {
            if (!this._valueLast && v && this._item.expandable !== E_TECH_USER_CLASSIF_CONTENT.limitation) { // создать корневой елемент
                this._parentNode.pushChange({
                    method: 'POST',
                    due: '0.',
                    data: {
                        func: this.key
                    }
                });
            }
            if (this._valueLast && !v) { // удалить все элементы
                console.log('удалить все элементы', E_TECH_USER_CLASSIF_CONTENT[this._item.expandable]);
            }
        }
    }
    private _value: number;
    private _item: ITechUserClassifConst;
    private _valueLast: number;
    private _parentNode: NodeAbsoluteRight;
    constructor(item: ITechUserClassifConst, v: number, pNode: NodeAbsoluteRight) {
        this._item = item;
        this._parentNode = pNode;
        if (this._parentNode.isCreate ) {
            this._value = 0;
            this.value = v;
            return;
        }
        this._value = v;
        this._valueLast = v;
    }
}
