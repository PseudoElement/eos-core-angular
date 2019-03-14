import { ICardFuncList } from './card-func-list.consts';

export class FuncNum {
    public isSelected: boolean;
    get label () {
        return this._node.label;
    }
    get key () {
        return this._node.key;
    }
    constructor (private _node: ICardFuncList) {}
}
