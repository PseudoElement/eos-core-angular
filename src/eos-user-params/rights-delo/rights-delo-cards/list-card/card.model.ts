import { E_CARD_TYPE } from '../card-func-list.consts';
import { CardRightSrv } from '../card-right.service';
import { USERCARD } from 'eos-rest';
// import { FuncNum } from '../funcnum.model';

export class CardRight {
    public expandable: boolean = true;
    public isExpanded: boolean = false;
    public isLoading: boolean = false;
    public isLimit: boolean;
    public type: E_CARD_TYPE;
    private _value: number;
    get name (): string {
        return this._srv.departments.get(this._card.DUE).CARD_NAME;
    }
    get value(): boolean { // 0 1 2
        return !!this._value;
    }
    set value (v: boolean) {
        console.log('set value (v: boolean)', v);
        this._value = +v;
    }
    get limit(): boolean { // 0 1 2
        return this._value === 2;
    }
    set limit (v: boolean) {
        console.log('set limit (v: boolean)', v);
        this._value = v ? 2 : 1;

    }
    private _funcIndex: number;
    constructor(
        private _srv: CardRightSrv,
        private _card: USERCARD,
        // private funcNum: FuncNum,
    ) {
        this._funcIndex = this._srv.selectedFuncNum.funcNum - 1;
        this.expandable = this._srv.selectedFuncNum.type !== E_CARD_TYPE.none;
        this.isLimit = this._srv.selectedFuncNum.type === E_CARD_TYPE.docGroup;
        this._value = +this._card.FUNCLIST[this._funcIndex];
    }
}
