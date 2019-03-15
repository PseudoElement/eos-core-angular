import { ICardFuncList, E_CARD_TYPE } from './card-func-list.consts';
import { E_CARD_RIGHT } from 'eos-rest/interfaces/rightName';

export class FuncNum {
    public isSelected: boolean;
    get label (): string {
        return this._node.label;
    }
    get funcNum (): E_CARD_RIGHT {
        return this._node.funcNum;
    }
    get type (): E_CARD_TYPE {
        return this._node.type;
    }
    constructor (private _node: ICardFuncList) {}
}
